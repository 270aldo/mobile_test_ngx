import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Play, Clock, BookOpen, ChevronRight } from 'lucide-react-native';
import { GlassCard, Label } from '@/components/ui';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

interface MicroLessonProps {
  /** Lesson title */
  title: string;
  /** Brief description */
  description?: string;
  /** Duration in seconds (60-90s typical) */
  duration: number;
  /** Thumbnail URL */
  thumbnailUrl?: string;
  /** Category/topic */
  category?: string;
  /** Whether lesson is completed */
  completed?: boolean;
  /** On play press */
  onPlay?: () => void;
  /** Test ID */
  testID?: string;
}

/**
 * MicroLesson - Short educational video card
 *
 * 60-90 second lessons on:
 * - Technique tips
 * - Nutrition insights
 * - Recovery strategies
 * - Mindset coaching
 *
 * Appears in:
 * - Chat (contextual suggestions)
 * - Progress (related to metrics)
 * - Workout (between exercises)
 */
export function MicroLesson({
  title,
  description,
  duration,
  thumbnailUrl,
  category = 'Técnica',
  completed = false,
  onPlay,
  testID,
}: MicroLessonProps) {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    if (secs === 0) return `${mins}m`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Pressable onPress={onPlay}>
      <GlassCard style={styles.card} testID={testID}>
        <View style={styles.content}>
          {/* Thumbnail */}
          <View style={styles.thumbnailContainer}>
            {thumbnailUrl ? (
              <Image
                source={{ uri: thumbnailUrl }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.thumbnailPlaceholder}>
                <BookOpen size={24} color={colors.ngx} />
              </View>
            )}

            {/* Play button overlay */}
            <View style={styles.playOverlay}>
              <Play size={20} color={colors.text} fill={colors.text} />
            </View>

            {/* Duration */}
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{formatDuration(duration)}</Text>
            </View>
          </View>

          {/* Info */}
          <View style={styles.info}>
            <View style={styles.categoryRow}>
              <Label color="ngx">{category}</Label>
              {completed && (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedText}>Visto</Text>
                </View>
              )}
            </View>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            {description && (
              <Text style={styles.description} numberOfLines={2}>
                {description}
              </Text>
            )}
          </View>

          {/* Arrow */}
          <ChevronRight size={20} color={colors.textMuted} />
        </View>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },

  // Thumbnail
  thumbnailContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    position: 'relative',
  },
  thumbnail: {
    ...StyleSheet.absoluteFillObject,
  },
  thumbnailPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(109, 0, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    paddingVertical: 2,
    paddingHorizontal: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 4,
  },
  durationText: {
    fontSize: 10,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
  },

  // Info
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  completedBadge: {
    paddingVertical: 2,
    paddingHorizontal: spacing.xs,
    backgroundColor: 'rgba(0, 245, 170, 0.15)',
    borderRadius: borderRadius.sm,
  },
  completedText: {
    fontSize: typography.fontSize.xs,
    color: colors.mint,
    fontWeight: typography.fontWeight.medium,
  },
  title: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    lineHeight: 20,
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    lineHeight: 18,
  },
});
