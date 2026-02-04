import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  X,
  ScanBarcode,
  Video,
  Image as ImageIcon,
} from 'lucide-react-native';
import {
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
  type BarcodeScanningResult,
} from 'expo-camera';
import * as Linking from 'expo-linking';
import { CameraModeOverlay, CameraControls } from '@/components/camera';
import { ScreenBackground } from '@/components/ui';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

type AppCameraMode = 'SCAN' | 'FORM' | 'PHOTO';

const MODES: AppCameraMode[] = ['SCAN', 'FORM', 'PHOTO'];

const MODE_CONFIG = {
  SCAN: {
    icon: ScanBarcode,
    label: 'SCAN',
    description: 'Escanea comida o código de barras',
    color: colors.mint,
  },
  FORM: {
    icon: Video,
    label: 'FORM',
    description: 'Graba tu técnica para análisis',
    color: colors.warning,
  },
  PHOTO: {
    icon: ImageIcon,
    label: 'PHOTO',
    description: 'Captura tu progreso',
    color: colors.ngx,
  },
};

export default function CameraScreen() {
  const router = useRouter();
  const [activeMode, setActiveMode] = useState<AppCameraMode>('FORM');
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [lastScannedBarcode, setLastScannedBarcode] = useState<string | null>(null);

  // Camera permissions
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();

  // Camera ref
  const cameraRef = useRef<CameraView>(null);

  const translateX = useSharedValue(0);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordingTimeRef = useRef(0);
  const barcodeScanCooldown = useRef(false);

  // Keep ref in sync with state for use in callbacks
  useEffect(() => {
    recordingTimeRef.current = recordingTime;
  }, [recordingTime]);

  // Derive CameraView props from app state
  const cameraMode = activeMode === 'FORM' ? 'video' as const : 'picture' as const;
  const flash = flashEnabled ? 'on' as const : 'off' as const;
  const facing = isFrontCamera ? 'front' as const : 'back' as const;

  // Recording timer effect (UI display only)
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);

  const handleModeChange = useCallback((mode: AppCameraMode) => {
    if (isRecording) {
      cameraRef.current?.stopRecording();
      setIsRecording(false);
      setRecordingTime(0);
    }
    setLastScannedBarcode(null);
    setActiveMode(mode);
  }, [isRecording]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      const currentIndex = MODES.indexOf(activeMode);

      if (event.translationX < -50 && currentIndex < MODES.length - 1) {
        runOnJS(handleModeChange)(MODES[currentIndex + 1]);
      } else if (event.translationX > 50 && currentIndex > 0) {
        runOnJS(handleModeChange)(MODES[currentIndex - 1]);
      }

      translateX.value = withSpring(0);
    });

  // Barcode scanning handler
  const handleBarcodeScanned = useCallback((result: BarcodeScanningResult) => {
    if (barcodeScanCooldown.current) return;
    barcodeScanCooldown.current = true;

    setLastScannedBarcode(result.data);
    Alert.alert(
      'Código escaneado',
      `Tipo: ${result.type}\nDatos: ${result.data}`,
      [
        {
          text: 'Buscar producto',
          onPress: () => {
            router.push('/nutrition/log');
          },
        },
        {
          text: 'Escanear otro',
          onPress: () => {
            setLastScannedBarcode(null);
          },
        },
      ]
    );

    setTimeout(() => {
      barcodeScanCooldown.current = false;
    }, 3000);
  }, [router]);

  // Capture handler — real camera operations
  const handleCapture = useCallback(async () => {
    if (!cameraRef.current) return;

    if (activeMode === 'FORM') {
      if (!micPermission?.granted) {
        const permission = await requestMicPermission();
        if (!permission?.granted) {
          Alert.alert(
            'Micrófono requerido',
            'Activa el micrófono para grabar tu técnica.',
            [
              permission && !permission.canAskAgain
                ? { text: 'Abrir configuración', onPress: () => Linking.openSettings() }
                : { text: 'OK' },
            ]
          );
          return;
        }
      }
      if (isRecording) {
        // Stop recording
        cameraRef.current.stopRecording();
        // recordAsync promise resolves in the start handler
      } else {
        // Start recording
        setIsRecording(true);
        setRecordingTime(0);
        try {
          const video = await cameraRef.current.recordAsync({
            maxDuration: 15,
          });
          setIsRecording(false);
          setRecordingTime(0);
          if (video?.uri) {
            Alert.alert(
              'Video guardado',
              `Video grabado exitosamente. GENESIS analizará tu técnica.`,
              [
                { text: 'Ver análisis', onPress: () => router.push('/(tabs)/chat') },
                { text: 'OK' },
              ]
            );
          }
        } catch (error) {
          console.error('Recording error:', error);
          setIsRecording(false);
          setRecordingTime(0);
        }
      }
    } else if (activeMode === 'PHOTO') {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.85,
          skipProcessing: false,
        });
        if (photo?.uri) {
          Alert.alert(
            'Foto capturada',
            '¡Tu foto de progreso ha sido guardada!',
            [
              { text: 'Ver galería', onPress: () => router.push('/(tabs)/progress') },
              { text: 'OK' },
            ]
          );
        }
      } catch (error) {
        console.error('Photo capture error:', error);
        Alert.alert('Error', 'No se pudo capturar la foto. Intenta de nuevo.');
      }
    }
    // SCAN mode: handled by onBarcodeScanned callback
  }, [activeMode, isRecording, micPermission?.granted, requestMicPermission, router]);

  const handleFlashToggle = () => {
    setFlashEnabled(!flashEnabled);
  };

  const handleFlip = () => {
    setIsFrontCamera(!isFrontCamera);
    if (!isFrontCamera) {
      setFlashEnabled(false);
    }
  };

  const handleGalleryOpen = () => {
    Alert.alert(
      'Galería',
      'Selecciona una imagen de tu galería',
      [{ text: 'OK' }]
    );
  };

  const handleClose = useCallback(() => {
    if (isRecording) {
      Alert.alert(
        '¿Cancelar grabación?',
        'Se perderá el video actual.',
        [
          { text: 'Continuar grabando', style: 'cancel' },
          {
            text: 'Cancelar',
            style: 'destructive',
            onPress: () => {
              cameraRef.current?.stopRecording();
              setIsRecording(false);
              setRecordingTime(0);
              router.back();
            },
          },
        ]
      );
    } else {
      router.back();
    }
  }, [isRecording, router]);

  const ActiveIcon = MODE_CONFIG[activeMode].icon;
  const hasPermission = cameraPermission?.granted;

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScreenBackground gradientColors={['#0A0A0F', '#050505']} gradientLocations={[0, 1]}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable style={styles.closeButton} onPress={handleClose}>
              <X size={24} color={colors.text} />
            </Pressable>
            <View style={styles.headerCenter}>
              <Text style={[styles.headerTitle, { color: MODE_CONFIG[activeMode].color }]}>
                {MODE_CONFIG[activeMode].label}
              </Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>

          {/* Viewfinder */}
          <GestureDetector gesture={panGesture}>
            <View style={styles.viewfinderContainer}>
              <View style={[styles.viewfinder, hasPermission && styles.viewfinderActive]}>
                {hasPermission ? (
                  <CameraView
                    ref={cameraRef}
                    style={StyleSheet.absoluteFill}
                    facing={facing}
                    flash={flash}
                    mode={cameraMode}
                    barcodeScannerSettings={
                      activeMode === 'SCAN'
                        ? { barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'qr', 'code128', 'code39'] }
                        : undefined
                    }
                    onBarcodeScanned={
                      activeMode === 'SCAN' && !lastScannedBarcode
                        ? handleBarcodeScanned
                        : undefined
                    }
                  />
                ) : (
                  <View style={styles.viewfinderPlaceholder}>
                    <ActiveIcon size={48} color={colors.textMuted} />
                    <Text style={styles.viewfinderText}>
                      {MODE_CONFIG[activeMode].description}
                    </Text>
                    {cameraPermission && !cameraPermission.canAskAgain ? (
                      <Pressable onPress={() => Linking.openSettings()}>
                        <Text style={[styles.viewfinderHint, styles.permissionLink]}>
                          Activar cámara en Configuración
                        </Text>
                      </Pressable>
                    ) : (
                      <Pressable onPress={requestCameraPermission}>
                        <Text style={[styles.viewfinderHint, styles.permissionLink]}>
                          Toca para permitir acceso a la cámara
                        </Text>
                      </Pressable>
                    )}
                  </View>
                )}

                <CameraModeOverlay
                  mode={activeMode}
                  isRecording={isRecording}
                  recordingTime={recordingTime}
                />

                <View style={[styles.corner, styles.cornerTL, { borderColor: MODE_CONFIG[activeMode].color }]} />
                <View style={[styles.corner, styles.cornerTR, { borderColor: MODE_CONFIG[activeMode].color }]} />
                <View style={[styles.corner, styles.cornerBL, { borderColor: MODE_CONFIG[activeMode].color }]} />
                <View style={[styles.corner, styles.cornerBR, { borderColor: MODE_CONFIG[activeMode].color }]} />
              </View>
            </View>
          </GestureDetector>

          {/* Camera Controls */}
          <CameraControls
            flashEnabled={flashEnabled}
            onFlashToggle={handleFlashToggle}
            onFlip={handleFlip}
            onGalleryOpen={handleGalleryOpen}
            isFrontCamera={isFrontCamera}
          />

          {/* Capture Button */}
          <View style={styles.captureContainer}>
            <Pressable
              style={[
                styles.captureButton,
                isRecording && styles.captureButtonRecording,
              ]}
              onPress={handleCapture}
            >
              <View
                style={[
                  styles.captureInner,
                  isRecording && styles.captureInnerRecording,
                ]}
              >
                {activeMode === 'FORM' && isRecording ? (
                  <View style={styles.stopSquare} />
                ) : activeMode === 'FORM' ? (
                  <View style={styles.recordDot} />
                ) : null}
              </View>
            </Pressable>
          </View>

          {/* Mode Selector */}
          <View style={styles.modeSelector}>
            {MODES.map((mode) => (
              <Pressable
                key={mode}
                style={styles.modeButton}
                onPress={() => handleModeChange(mode)}
              >
                <Text
                  style={[
                    styles.modeText,
                    activeMode === mode && { color: MODE_CONFIG[mode].color },
                  ]}
                >
                  {mode}
                </Text>
                {activeMode === mode && (
                  <View
                    style={[
                      styles.modeIndicator,
                      { backgroundColor: MODE_CONFIG[mode].color },
                    ]}
                  />
                )}
              </Pressable>
            ))}
          </View>

          <Text style={styles.swipeHint}>
            ← Desliza para cambiar modo →
          </Text>
        </SafeAreaView>
      </ScreenBackground>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.void,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 2,
  },
  headerSpacer: {
    width: 44,
  },
  viewfinderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  viewfinder: {
    width: '100%',
    aspectRatio: 3 / 4,
    maxHeight: '60%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewfinderActive: {
    borderWidth: 0,
  },
  viewfinderPlaceholder: {
    position: 'absolute',
    alignItems: 'center',
    gap: spacing.md,
    zIndex: 0,
  },
  viewfinderText: {
    fontSize: typography.fontSize.base,
    color: colors.textMuted,
    textAlign: 'center',
  },
  viewfinderHint: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    opacity: 0.6,
    marginTop: spacing.sm,
  },
  permissionLink: {
    color: colors.ngx,
    opacity: 1,
    fontWeight: typography.fontWeight.semibold,
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderWidth: 2,
  },
  cornerTL: {
    top: spacing.md,
    left: spacing.md,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    top: spacing.md,
    right: spacing.md,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  cornerBL: {
    bottom: spacing.md,
    left: spacing.md,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    bottom: spacing.md,
    right: spacing.md,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  captureContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: colors.text,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonRecording: {
    borderColor: colors.error,
  },
  captureInner: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    backgroundColor: colors.text,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInnerRecording: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  recordDot: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  stopSquare: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
    paddingBottom: spacing.sm,
  },
  modeButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  modeText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  modeIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: spacing.xs,
  },
  swipeHint: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    paddingBottom: spacing.lg,
    opacity: 0.6,
  },
});
