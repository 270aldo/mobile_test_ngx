import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import { colors, typography } from '@/constants/theme';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
  value?: string;
  sublabel?: string;
  color?: 'primary' | 'mint' | 'warning';
}

// Color values for gradient ends
const GRADIENT_ENDS = {
  primary: '#8B33FF',
  mint: '#00D4AA',
  warning: '#FFB347',
} as const;

/**
 * ProgressRing - Circular progress indicator
 *
 * Premium visual for displaying progress metrics.
 * Features gradient stroke.
 */
export function ProgressRing({
  progress,
  size = 100,
  strokeWidth = 8,
  label,
  value,
  sublabel,
  color = 'primary',
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const center = size / 2;

  const colorMap = {
    primary: { start: colors.primary, end: GRADIENT_ENDS.primary },
    mint: { start: colors.mint, end: GRADIENT_ENDS.mint },
    warning: { start: colors.warning, end: GRADIENT_ENDS.warning },
  };

  const gradientColors = colorMap[color];

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Defs>
          <LinearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={gradientColors.start} />
            <Stop offset="100%" stopColor={gradientColors.end} />
          </LinearGradient>
        </Defs>

        {/* Background track */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Progress arc - rotated -90deg to start from top */}
        <G transform={`rotate(-90 ${center} ${center})`}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={`url(#gradient-${color})`}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
          />
        </G>
      </Svg>

      {/* Center content */}
      <View style={styles.centerContent}>
        {label && <Text style={styles.label}>{label}</Text>}
        {value && <Text style={[styles.value, { color: gradientColors.start }]}>{value}</Text>}
        {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
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
  label: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  value: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    marginVertical: 2,
  },
  sublabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
});
