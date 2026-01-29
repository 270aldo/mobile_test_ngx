import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import { colors, spacing, typography } from '@/constants/theme';

interface MacroRingProps {
  /** Current calories consumed */
  current: number;
  /** Target calories */
  target: number;
  /** Size of the ring */
  size?: number;
  /** Stroke width */
  strokeWidth?: number;
  /** Show remaining instead of consumed */
  showRemaining?: boolean;
}

/**
 * MacroRing - Large calorie tracking ring
 *
 * Premium visualization for daily calorie progress.
 * Shows current/target with gradient progress arc.
 */
export function MacroRing({
  current,
  target,
  size = 180,
  strokeWidth = 12,
  showRemaining = false,
}: MacroRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.round((current / target) * 100));
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const center = size / 2;

  const remaining = Math.max(0, target - current);
  const isOverTarget = current > target;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Defs>
          <LinearGradient id="calorie-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors.warning} />
            <Stop offset="100%" stopColor="#FF8C00" />
          </LinearGradient>
          <LinearGradient id="over-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors.error} />
            <Stop offset="100%" stopColor="#FF4444" />
          </LinearGradient>
        </Defs>

        {/* Background track */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Progress arc */}
        <G transform={`rotate(-90 ${center} ${center})`}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={isOverTarget ? "url(#over-gradient)" : "url(#calorie-gradient)"}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={isOverTarget ? 0 : strokeDashoffset}
          />
        </G>
      </Svg>

      {/* Center content */}
      <View style={styles.centerContent}>
        <Text style={[styles.currentValue, isOverTarget && styles.overTarget]}>
          {showRemaining ? remaining.toLocaleString() : current.toLocaleString()}
        </Text>
        <Text style={styles.unit}>
          {showRemaining ? 'restantes' : 'kcal'}
        </Text>
        <View style={styles.targetContainer}>
          <Text style={styles.targetLabel}>de </Text>
          <Text style={styles.targetValue}>{target.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentValue: {
    fontSize: 42,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 48,
  },
  overTarget: {
    color: colors.error,
  },
  unit: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: -4,
  },
  targetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  targetLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
  targetValue: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
});
