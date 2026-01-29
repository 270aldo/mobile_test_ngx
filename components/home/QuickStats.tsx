import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Droplet, Moon, Plus, Minus } from 'lucide-react-native';
import { GlassCard } from '@/components/ui';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

interface QuickStatsProps {
  /** Water glasses consumed */
  waterCurrent?: number;
  /** Water glasses target */
  waterTarget?: number;
  /** Sleep hours */
  sleepHours?: number;
  /** Callback to add water */
  onAddWater?: () => void;
  /** Callback to remove water */
  onRemoveWater?: () => void;
  /** Test ID for testing */
  testID?: string;
}

/**
 * QuickStats - Mini stat cards for Water and Sleep
 *
 * Compact display for quick tracking items that don't need
 * full-screen modules. Water has +/- buttons for quick logging.
 */
export function QuickStats({
  waterCurrent = 0,
  waterTarget = 8,
  sleepHours,
  onAddWater,
  onRemoveWater,
  testID,
}: QuickStatsProps) {
  const waterProgress = Math.min(100, Math.round((waterCurrent / waterTarget) * 100));

  return (
    <View style={styles.container} testID={testID}>
      {/* Water Card */}
      <GlassCard style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, styles.waterIcon]}>
            <Droplet size={14} color={colors.mint} />
          </View>
          <Text style={styles.cardLabel}>Agua</Text>
        </View>

        <View style={styles.waterContent}>
          <Text style={styles.waterValue}>
            {waterCurrent}
            <Text style={styles.waterTarget}>/{waterTarget}</Text>
          </Text>
          <Text style={styles.waterUnit}>vasos</Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${waterProgress}%` }]}
          />
        </View>

        {/* Quick actions */}
        <View style={styles.waterActions}>
          <Pressable
            style={[styles.waterButton, waterCurrent === 0 && styles.waterButtonDisabled]}
            onPress={onRemoveWater}
            disabled={waterCurrent === 0}
          >
            <Minus size={14} color={waterCurrent === 0 ? colors.textMuted : colors.text} />
          </Pressable>
          <Pressable style={styles.waterButton} onPress={onAddWater}>
            <Plus size={14} color={colors.text} />
          </Pressable>
        </View>
      </GlassCard>

      {/* Sleep Card */}
      <GlassCard style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, styles.sleepIcon]}>
            <Moon size={14} color={colors.ngx} />
          </View>
          <Text style={styles.cardLabel}>Sueño</Text>
        </View>

        <View style={styles.sleepContent}>
          {sleepHours !== undefined ? (
            <>
              <Text style={styles.sleepValue}>{sleepHours.toFixed(1)}</Text>
              <Text style={styles.sleepUnit}>hrs</Text>
              <Text style={styles.sleepSubtext}>anoche</Text>
            </>
          ) : (
            <>
              <Text style={styles.sleepPlaceholder}>--</Text>
              <Text style={styles.sleepSubtext}>No registrado</Text>
            </>
          )}
        </View>

        {/* Quality indicator */}
        {sleepHours !== undefined && (
          <View style={styles.qualityContainer}>
            <View
              style={[
                styles.qualityBadge,
                sleepHours >= 7 ? styles.qualityGood : styles.qualityLow,
              ]}
            >
              <Text
                style={[
                  styles.qualityText,
                  sleepHours >= 7 ? styles.qualityTextGood : styles.qualityTextLow,
                ]}
              >
                {sleepHours >= 7 ? 'Óptimo' : 'Bajo'}
              </Text>
            </View>
          </View>
        )}
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  card: {
    flex: 1,
    padding: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterIcon: {
    backgroundColor: 'rgba(0, 245, 170, 0.15)',
  },
  sleepIcon: {
    backgroundColor: 'rgba(109, 0, 255, 0.15)',
  },
  cardLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Water styles
  waterContent: {
    marginBottom: spacing.sm,
  },
  waterValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  waterTarget: {
    fontSize: typography.fontSize.lg,
    color: colors.textMuted,
  },
  waterUnit: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  progressBar: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.mint,
    borderRadius: 2,
  },
  waterActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  waterButton: {
    flex: 1,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterButtonDisabled: {
    opacity: 0.5,
  },

  // Sleep styles
  sleepContent: {
    marginBottom: spacing.sm,
  },
  sleepValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  sleepUnit: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: -2,
  },
  sleepSubtext: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  sleepPlaceholder: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
  },
  qualityContainer: {
    marginTop: 'auto',
  },
  qualityBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  qualityGood: {
    backgroundColor: 'rgba(0, 245, 170, 0.15)',
  },
  qualityLow: {
    backgroundColor: 'rgba(255, 71, 87, 0.15)',
  },
  qualityText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  qualityTextGood: {
    color: colors.mint,
  },
  qualityTextLow: {
    color: colors.error,
  },
});
