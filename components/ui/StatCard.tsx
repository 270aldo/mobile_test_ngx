import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LucideIcon } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sublabel?: string;
  progress?: number; // 0-100, shows progress bar
  trend?: 'up' | 'down' | 'neutral';
  color?: 'primary' | 'mint' | 'warning' | 'chrome';
  style?: StyleProp<ViewStyle>;
}

/**
 * StatCard - Premium metric display card
 *
 * Compact card for displaying stats with optional progress bar.
 * Used in dashboard grids.
 */
export function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
  progress,
  color = 'primary',
  style,
}: StatCardProps) {
  const colorMap = {
    primary: colors.primary,
    mint: colors.mint,
    warning: colors.warning,
    chrome: colors.chrome,
  };

  const accentColor = colorMap[color];

  return (
    <View style={[styles.container, style]}>
      {/* Subtle gradient background */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.03)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: `${accentColor}15` }]}>
        <Icon size={16} color={accentColor} />
      </View>

      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Value */}
      <Text style={styles.value}>{value}</Text>

      {/* Progress bar */}
      {progress !== undefined && (
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <LinearGradient
              colors={[accentColor, `${accentColor}88`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]}
            />
          </View>
        </View>
      )}

      {/* Sublabel */}
      {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(20, 20, 25, 0.8)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    padding: spacing.md,
    alignItems: 'center',
    overflow: 'hidden',
    minWidth: 100,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  value: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: 4,
  },
  progressContainer: {
    width: '100%',
    marginVertical: spacing.xs,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  sublabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
});
