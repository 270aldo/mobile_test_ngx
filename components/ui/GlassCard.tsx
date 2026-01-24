import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, spacing, gradients } from '@/constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  padding?: 'sm' | 'md' | 'lg' | 'xl' | number;
  highlight?: boolean;
  testID?: string;
}

/**
 * GlassCard - Glassmorphism card component
 *
 * Basado en: mobile_genesis_hybrid_v2_flow.html
 * - Fondo: rgba(10, 10, 12, 0.7) + blur(12)
 * - Borde: 1px rgba(255,255,255,0.08)
 * - Highlight superior: gradiente violeta
 */
export function GlassCard({
  children,
  style,
  intensity = 12,
  padding = 'lg',
  highlight = true,
  testID,
}: GlassCardProps) {
  const paddingMap = {
    sm: spacing.sm,
    md: spacing.md,
    lg: spacing.lg,
    xl: spacing.xl,
  };
  const resolvedPadding = typeof padding === 'number'
    ? padding
    : paddingMap[padding];

  return (
    <View
      style={[styles.container, style]}
      testID={testID}
    >
      <BlurView
        intensity={intensity}
        tint="dark"
        style={[styles.blur, { padding: resolvedPadding }]}
      >
        {/* Top highlight line */}
        {highlight && (
          <LinearGradient
            colors={gradients.glassHighlight}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.highlight}
          />
        )}
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: borderRadius.xl, // 24px como el prototype
    borderWidth: 1,
    borderColor: colors.glassBorder, // rgba(255,255,255,0.08)
    backgroundColor: colors.glass, // rgba(10, 10, 12, 0.7)
  },
  blur: {
    flex: 1,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 12,
    height: 1,
    opacity: 0.6,
  },
});
