import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from './GlassCard';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import type { CoachNotePriority } from '@/types';

interface CoachNoteCardProps {
  title: string;
  content: string;
  priority?: CoachNotePriority;
  ctaText?: string;
  onCtaPress?: () => void;
  onDismiss?: () => void;
  testID?: string;
}

const priorityConfig: Record<
  CoachNotePriority,
  { icon: keyof typeof Ionicons.glyphMap; color: string }
> = {
  info: { icon: 'information-circle', color: colors.mint },
  action: { icon: 'arrow-forward-circle', color: colors.mint },
  celebration: { icon: 'trophy', color: colors.warning },
};

/**
 * CoachNoteCard - Displays coach notes with mint accent styling
 *
 * Used on Home, Workout, and Progress screens to show
 * personalized feedback from the human coach
 */
export function CoachNoteCard({
  title,
  content,
  priority = 'info',
  ctaText,
  onCtaPress,
  onDismiss,
  testID,
}: CoachNoteCardProps) {
  const config = priorityConfig[priority];

  return (
    <GlassCard variant="mint" padding="md" testID={testID}>
      {/* Top accent line */}
      <View style={styles.accentLine} />

      <View style={styles.container}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name={config.icon} size={22} color={config.color} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Label */}
          <Text style={styles.label}>COACH NOTE</Text>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Description */}
          <Text style={styles.description}>{content}</Text>

          {/* CTA Button */}
          {ctaText && onCtaPress && (
            <Pressable
              onPress={onCtaPress}
              style={({ pressed }) => [
                styles.ctaButton,
                pressed && styles.ctaButtonPressed,
              ]}
            >
              <Text style={styles.ctaText}>{ctaText}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.mint} />
            </Pressable>
          )}
        </View>

        {/* Dismiss button */}
        {onDismiss && (
          <Pressable
            onPress={onDismiss}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.dismissButton}
          >
            <Ionicons name="close" size={18} color={colors.textMuted} />
          </Pressable>
        )}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  accentLine: {
    position: 'absolute',
    top: 0,
    left: spacing.lg,
    right: spacing.lg,
    height: 2,
    backgroundColor: colors.mint,
    borderRadius: 1,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  iconContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  label: {
    color: colors.mint,
    fontSize: typography.fontSize.label,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.widest,
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  description: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.base,
    lineHeight: 20,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  ctaButtonPressed: {
    opacity: 0.7,
  },
  ctaText: {
    color: colors.mint,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  dismissButton: {
    padding: spacing.xs,
  },
});
