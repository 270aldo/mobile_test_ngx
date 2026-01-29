import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Play, User, Clock, Volume2, VolumeX } from 'lucide-react-native';
import { GlassCard } from '@/components/ui';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

interface CoachVideoProps {
  /** Coach name */
  coachName: string;
  /** Video title/topic */
  title?: string;
  /** Video URL */
  videoUrl?: string;
  /** Thumbnail URL */
  thumbnailUrl?: string;
  /** Duration in seconds */
  duration: number;
  /** When the video was recorded */
  recordedAt?: string;
  /** On play press */
  onPlay?: () => void;
  /** Test ID */
  testID?: string;
}

/**
 * CoachVideo - Video message from human coach
 *
 * Embedded in:
 * - Chat (Coach Notes)
 * - Workout (personalized instructions)
 * - Progress (feedback on metrics)
 *
 * Features:
 * - Mint accent (coach styling)
 * - Coach attribution
 * - Sound controls
 */
export function CoachVideo({
  coachName,
  title,
  videoUrl,
  thumbnailUrl,
  duration,
  recordedAt,
  onPlay,
  testID,
}: CoachVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeAgo = (dateString?: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'hace unos minutos';
    if (diffHours < 24) return `hace ${diffHours}h`;
    if (diffDays === 1) return 'ayer';
    return `hace ${diffDays} días`;
  };

  const handlePlay = () => {
    setIsPlaying(true);
    onPlay?.();
  };

  return (
    <GlassCard variant="mint" style={styles.card} testID={testID}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.coachInfo}>
          <View style={styles.coachAvatar}>
            <User size={14} color={colors.mint} />
          </View>
          <View>
            <Text style={styles.coachName}>{coachName}</Text>
            {recordedAt && (
              <Text style={styles.recordedAt}>{formatTimeAgo(recordedAt)}</Text>
            )}
          </View>
        </View>
        <View style={styles.videoBadge}>
          <Text style={styles.videoBadgeText}>VIDEO</Text>
        </View>
      </View>

      {/* Video player */}
      <View style={styles.videoContainer}>
        {thumbnailUrl ? (
          <Image
            source={{ uri: thumbnailUrl }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.thumbnailPlaceholder}>
            <User size={32} color={colors.mint} />
          </View>
        )}

        {!isPlaying ? (
          // Play overlay
          <Pressable style={styles.playOverlay} onPress={handlePlay}>
            <View style={styles.playButton}>
              <Play size={28} color={colors.void} fill={colors.void} />
            </View>
          </Pressable>
        ) : (
          // Playing controls
          <View style={styles.playingControls}>
            <Pressable
              style={styles.muteButton}
              onPress={() => setIsMuted(!isMuted)}
            >
              {isMuted ? (
                <VolumeX size={18} color={colors.text} />
              ) : (
                <Volume2 size={18} color={colors.text} />
              )}
            </Pressable>
          </View>
        )}

        {/* Duration */}
        <View style={styles.durationBadge}>
          <Clock size={10} color={colors.text} />
          <Text style={styles.durationText}>{formatDuration(duration)}</Text>
        </View>
      </View>

      {/* Title if present */}
      {title && (
        <Text style={styles.title}>{title}</Text>
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 170, 0.2)',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  coachInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  coachAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 245, 170, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coachName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.mint,
  },
  recordedAt: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginTop: 1,
  },
  videoBadge: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    backgroundColor: 'rgba(0, 245, 170, 0.15)',
    borderRadius: borderRadius.sm,
  },
  videoBadgeText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: colors.mint,
    letterSpacing: 1,
  },

  // Video
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    position: 'relative',
  },
  thumbnail: {
    ...StyleSheet.absoluteFillObject,
  },
  thumbnailPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 245, 170, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Play overlay
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.mint,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 4,
  },

  // Playing controls
  playingControls: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
  },
  muteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Duration
  durationBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: spacing.xs,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: borderRadius.sm,
  },
  durationText: {
    fontSize: typography.fontSize.xs,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },

  // Title
  title: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginTop: spacing.md,
    lineHeight: 22,
  },
});
