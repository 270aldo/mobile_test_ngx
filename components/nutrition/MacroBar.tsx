import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';

interface MacroBarProps {
  /** Label (P, C, F or full name) */
  label: string;
  /** Current amount in grams */
  current: number;
  /** Target amount in grams */
  target: number;
  /** Bar color */
  color: string;
  /** Show full label */
  showFullLabel?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * MacroBar - Horizontal progress bar for macronutrients
 *
 * Visual representation of macro intake vs target.
 */
export function MacroBar({
  label,
  current,
  target,
  color,
  showFullLabel = false,
  size = 'md',
}: MacroBarProps) {
  const progress = Math.min(100, Math.round((current / target) * 100));
  const remaining = Math.max(0, target - current);
  const isOver = current > target;

  const sizeConfig = {
    sm: { height: 4, fontSize: typography.fontSize.xs },
    md: { height: 8, fontSize: typography.fontSize.sm },
    lg: { height: 12, fontSize: typography.fontSize.base },
  };

  const config = sizeConfig[size];

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, { fontSize: config.fontSize }]}>
          {showFullLabel ? label : label.charAt(0)}
        </Text>
        <View style={styles.values}>
          <Text style={[styles.current, isOver && styles.overValue]}>
            {current}g
          </Text>
          <Text style={styles.separator}>/</Text>
          <Text style={styles.target}>{target}g</Text>
        </View>
      </View>

      <View style={[styles.track, { height: config.height }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${Math.min(100, progress)}%`,
              backgroundColor: isOver ? colors.error : color,
              height: config.height,
            },
          ]}
        />
        {isOver && (
          <View
            style={[
              styles.overFill,
              {
                width: `${Math.min(100, (current / target - 1) * 100)}%`,
                height: config.height,
              },
            ]}
          />
        )}
      </View>

      <View style={styles.remainingRow}>
        <Text style={styles.remaining}>
          {isOver ? `+${current - target}g exceso` : `${remaining}g restantes`}
        </Text>
        <Text style={styles.percentage}>{progress}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    color: colors.text,
    fontWeight: typography.fontWeight.semibold,
  },
  values: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  current: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    fontWeight: typography.fontWeight.semibold,
  },
  overValue: {
    color: colors.error,
  },
  separator: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginHorizontal: 2,
  },
  target: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
  track: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 4,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  fill: {
    borderRadius: 4,
  },
  overFill: {
    backgroundColor: 'rgba(255, 68, 68, 0.5)',
    borderRadius: 4,
  },
  remainingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  remaining: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  percentage: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
});
