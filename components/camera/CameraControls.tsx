import { View, StyleSheet, Pressable } from 'react-native';
import {
  Zap,
  ZapOff,
  FlipHorizontal2,
  ImagePlus,
  Settings2,
} from 'lucide-react-native';
import { colors, spacing } from '@/constants/theme';

interface CameraControlsProps {
  /** Flash enabled */
  flashEnabled: boolean;
  /** On flash toggle */
  onFlashToggle: () => void;
  /** On camera flip */
  onFlip: () => void;
  /** On gallery open */
  onGalleryOpen: () => void;
  /** On settings open */
  onSettingsOpen?: () => void;
  /** Is front camera */
  isFrontCamera?: boolean;
}

/**
 * CameraControls - Secondary camera action buttons
 *
 * Provides:
 * - Flash toggle
 * - Camera flip (front/back)
 * - Gallery access
 * - Settings (optional)
 */
export function CameraControls({
  flashEnabled,
  onFlashToggle,
  onFlip,
  onGalleryOpen,
  onSettingsOpen,
  isFrontCamera = false,
}: CameraControlsProps) {
  return (
    <View style={styles.container}>
      {/* Left side controls */}
      <View style={styles.controlGroup}>
        <Pressable
          style={({ pressed }) => [
            styles.controlButton,
            pressed && styles.controlButtonPressed,
          ]}
          onPress={onFlashToggle}
          disabled={isFrontCamera}
        >
          {flashEnabled ? (
            <Zap size={22} color={colors.warning} fill={colors.warning} />
          ) : (
            <ZapOff size={22} color={isFrontCamera ? colors.textMuted : colors.text} />
          )}
        </Pressable>
      </View>

      {/* Center spacer for capture button */}
      <View style={styles.spacer} />

      {/* Right side controls */}
      <View style={styles.controlGroup}>
        <Pressable
          style={({ pressed }) => [
            styles.controlButton,
            pressed && styles.controlButtonPressed,
          ]}
          onPress={onFlip}
        >
          <FlipHorizontal2 size={22} color={colors.text} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.controlButton,
            pressed && styles.controlButtonPressed,
          ]}
          onPress={onGalleryOpen}
        >
          <ImagePlus size={22} color={colors.text} />
        </Pressable>

        {onSettingsOpen && (
          <Pressable
            style={({ pressed }) => [
              styles.controlButton,
              pressed && styles.controlButtonPressed,
            ]}
            onPress={onSettingsOpen}
          >
            <Settings2 size={22} color={colors.text} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  controlGroup: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  spacer: {
    width: 72, // Same as capture button
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: [{ scale: 0.95 }],
  },
});
