import { View, Text, StyleSheet } from 'react-native';
import {
  ScanBarcode,
  Image as ImageIcon,
  Info,
  Timer,
  Crosshair,
} from 'lucide-react-native';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

type CameraMode = 'SCAN' | 'FORM' | 'PHOTO';

interface CameraModeOverlayProps {
  mode: CameraMode;
  isRecording?: boolean;
  recordingTime?: number;
}

/**
 * CameraModeOverlay - Mode-specific UI overlays for camera
 *
 * Shows contextual guidance and UI elements per mode:
 * - SCAN: Barcode detection zone, food recognition hint
 * - FORM: Recording timer, rep counter guide
 * - PHOTO: Pose guide, lighting indicator
 */
export function CameraModeOverlay({
  mode,
  isRecording = false,
  recordingTime = 0,
}: CameraModeOverlayProps) {
  if (mode === 'SCAN') {
    return (
      <View style={styles.overlay}>
        {/* Scan zone indicator */}
        <View style={styles.scanZone}>
          <View style={styles.scanLine} />
        </View>

        {/* Tips */}
        <View style={styles.tipContainer}>
          <Info size={14} color={colors.mint} />
          <Text style={styles.tipText}>
            Centra el código de barras o la comida
          </Text>
        </View>

        {/* Detection options */}
        <View style={styles.detectionOptions}>
          <View style={styles.detectionOption}>
            <ScanBarcode size={16} color={colors.textSecondary} />
            <Text style={styles.detectionText}>Barcode</Text>
          </View>
          <View style={[styles.detectionOption, styles.detectionOptionActive]}>
            <Crosshair size={16} color={colors.mint} />
            <Text style={[styles.detectionText, styles.detectionTextActive]}>
              AI Food
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (mode === 'FORM') {
    return (
      <View style={styles.overlay}>
        {/* Recording indicator */}
        {isRecording && (
          <View style={styles.recordingIndicator}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingTime}>
              {formatTime(recordingTime)}
            </Text>
          </View>
        )}

        {/* Body guide overlay */}
        <View style={styles.bodyGuide}>
          <View style={styles.bodyGuideHead} />
          <View style={styles.bodyGuideTorso} />
          <View style={styles.bodyGuideLegs} />
        </View>

        {/* Tips */}
        <View style={styles.tipContainer}>
          <Timer size={14} color={colors.warning} />
          <Text style={styles.tipText}>
            {isRecording
              ? 'Realiza 3-5 repeticiones completas'
              : 'Graba de 5-15 segundos para análisis'}
          </Text>
        </View>
      </View>
    );
  }

  if (mode === 'PHOTO') {
    return (
      <View style={styles.overlay}>
        {/* Pose guide */}
        <View style={styles.poseGuide}>
          <View style={styles.poseOutline} />
        </View>

        {/* Tips */}
        <View style={styles.tipContainer}>
          <ImageIcon size={14} color={colors.ngx} />
          <Text style={styles.tipText}>
            Misma pose y luz que tu foto anterior
          </Text>
        </View>

        {/* Pose options */}
        <View style={styles.poseOptions}>
          <View style={[styles.poseOption, styles.poseOptionActive]}>
            <Text style={styles.poseText}>Frontal</Text>
          </View>
          <View style={styles.poseOption}>
            <Text style={styles.poseText}>Lateral</Text>
          </View>
          <View style={styles.poseOption}>
            <Text style={styles.poseText}>Espalda</Text>
          </View>
        </View>
      </View>
    );
  }

  return null;
}

// Format seconds to mm:ss
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },

  // SCAN mode
  scanZone: {
    width: '70%',
    height: 180,
    borderWidth: 2,
    borderColor: colors.mint,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  scanLine: {
    width: '100%',
    height: 2,
    backgroundColor: colors.mint,
    shadowColor: colors.mint,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  detectionOptions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  detectionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.full,
  },
  detectionOptionActive: {
    backgroundColor: 'rgba(0, 245, 170, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 170, 0.3)',
  },
  detectionText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  detectionTextActive: {
    color: colors.mint,
  },

  // FORM mode
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(255, 68, 68, 0.2)',
    borderRadius: borderRadius.full,
    marginTop: spacing.md,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.error,
  },
  recordingTime: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.error,
    fontVariant: ['tabular-nums'],
  },
  bodyGuide: {
    alignItems: 'center',
    opacity: 0.3,
  },
  bodyGuideHead: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.warning,
  },
  bodyGuideTorso: {
    width: 60,
    height: 80,
    borderWidth: 2,
    borderColor: colors.warning,
    marginTop: -2,
    borderTopWidth: 0,
  },
  bodyGuideLegs: {
    width: 60,
    height: 100,
    borderWidth: 2,
    borderColor: colors.warning,
    marginTop: -2,
    borderTopWidth: 0,
  },

  // PHOTO mode
  poseGuide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  poseOutline: {
    width: 120,
    height: 200,
    borderWidth: 2,
    borderColor: 'rgba(109, 0, 255, 0.3)',
    borderRadius: 60,
    borderStyle: 'dashed',
  },
  poseOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  poseOption: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.full,
  },
  poseOptionActive: {
    backgroundColor: 'rgba(109, 0, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(109, 0, 255, 0.3)',
  },
  poseText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },

  // Shared
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: borderRadius.full,
  },
  tipText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
  },
});
