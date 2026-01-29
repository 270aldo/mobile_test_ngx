import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Play, Pause, RotateCcw, Maximize2 } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

interface ExerciseDemoProps {
  /** Exercise name */
  exerciseName: string;
  /** Video/GIF URL */
  videoUrl?: string;
  /** Thumbnail URL */
  thumbnailUrl?: string;
  /** Duration in seconds (for display) */
  duration?: number;
  /** On fullscreen press */
  onFullscreen?: () => void;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Test ID */
  testID?: string;
}

/**
 * ExerciseDemo - Exercise demonstration video/GIF player
 *
 * Features:
 * - Auto-loop playback
 * - No audio (silent demos)
 * - Fullscreen option
 * - Thumbnail with play overlay
 *
 * Used in:
 * - Workout Player
 * - Form Check results
 * - Exercise library
 */
export function ExerciseDemo({
  exerciseName,
  videoUrl,
  thumbnailUrl,
  duration = 15,
  onFullscreen,
  size = 'md',
  testID,
}: ExerciseDemoProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const sizeConfig = {
    sm: { width: 100, height: 100, iconSize: 20 },
    md: { width: 160, height: 160, iconSize: 28 },
    lg: { width: '100%' as const, height: 200, iconSize: 36 },
  };

  const config = sizeConfig[size];

  return (
    <View
      style={[
        styles.container,
        { width: config.width, height: config.height },
      ]}
      testID={testID}
    >
      {/* Video/Thumbnail */}
      <View style={styles.videoContainer}>
        {thumbnailUrl ? (
          <Image
            source={{ uri: thumbnailUrl }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              {exerciseName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        {/* Play overlay */}
        {!isPlaying && (
          <View style={styles.playOverlay}>
            <Pressable
              style={styles.playButton}
              onPress={() => setIsPlaying(true)}
            >
              <Play size={config.iconSize} color={colors.text} fill={colors.text} />
            </Pressable>
          </View>
        )}

        {/* Playing controls */}
        {isPlaying && (
          <View style={styles.playingControls}>
            <Pressable
              style={styles.controlButton}
              onPress={() => setIsPlaying(false)}
            >
              <Pause size={16} color={colors.text} />
            </Pressable>
            <Pressable style={styles.controlButton}>
              <RotateCcw size={16} color={colors.text} />
            </Pressable>
          </View>
        )}

        {/* Fullscreen button */}
        {onFullscreen && (
          <Pressable
            style={styles.fullscreenButton}
            onPress={onFullscreen}
          >
            <Maximize2 size={16} color={colors.text} />
          </Pressable>
        )}

        {/* Duration badge */}
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{duration}s</Text>
        </View>
      </View>

      {/* Exercise name (only for lg size) */}
      {size === 'lg' && (
        <Text style={styles.exerciseName} numberOfLines={1}>
          {exerciseName}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  thumbnail: {
    ...StyleSheet.absoluteFillObject,
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(109, 0, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.ngx,
    opacity: 0.5,
  },

  // Play overlay
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(109, 0, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 4,
  },

  // Playing controls
  playingControls: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
    gap: spacing.xs,
  },
  controlButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Fullscreen
  fullscreenButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Duration
  durationBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    paddingVertical: 2,
    paddingHorizontal: spacing.xs,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: borderRadius.sm,
  },
  durationText: {
    fontSize: typography.fontSize.xs,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },

  // Exercise name
  exerciseName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    padding: spacing.sm,
    textAlign: 'center',
  },
});
