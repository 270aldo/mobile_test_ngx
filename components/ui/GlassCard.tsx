import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp, Image, ImageSourcePropType } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, spacing, gradients } from '@/constants/theme';

type CardVariant = 'default' | 'elevated' | 'mint' | 'hero';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | number;
  highlight?: boolean;
  variant?: CardVariant;
  backgroundImage?: ImageSourcePropType;
  testID?: string;
}

/**
 * GlassCard - Premium glassmorphism card component
 *
 * Variants:
 * - default: Standard glass card with violet highlight
 * - elevated: Higher contrast, more prominent shadow
 * - mint: Mint accent for coach/hybrid content
 * - hero: Large hero card with gradient background
 */
export function GlassCard({
  children,
  style,
  intensity = 20,
  padding = 'lg',
  highlight = true,
  variant = 'default',
  backgroundImage,
  testID,
}: GlassCardProps) {
  const paddingMap = {
    none: 0,
    sm: spacing.sm,
    md: spacing.md,
    lg: spacing.lg,
    xl: spacing.xl,
  };
  const resolvedPadding = typeof padding === 'number'
    ? padding
    : paddingMap[padding];

  const containerStyles = [
    styles.container,
    variant === 'elevated' && styles.containerElevated,
    variant === 'mint' && styles.containerMint,
    variant === 'hero' && styles.containerHero,
    style,
  ];

  const highlightColors = variant === 'mint'
    ? ['rgba(0, 245, 170, 0)', 'rgba(0, 245, 170, 0.6)', 'rgba(0, 245, 170, 0)']
    : gradients.glassHighlight;

  return (
    <View style={containerStyles} testID={testID}>
      {/* Outer glow for elevated variant */}
      {variant === 'elevated' && (
        <View style={styles.outerGlow} />
      )}

      {/* Optional Background Image */}
      {backgroundImage && (
        <>
          <Image
            source={backgroundImage}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
          {/* Dark overlay for text legibility on images */}
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(5, 5, 5, 0.6)' }]} />
        </>
      )}

      <BlurView
        intensity={intensity}
        tint="dark"
        style={[styles.blur, { padding: resolvedPadding }]}
      >
        {/* Top highlight line */}
        {highlight && (
          <LinearGradient
            colors={highlightColors as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.highlight}
          />
        )}

        {/* Hero gradient overlay */}
        {variant === 'hero' && (
          <LinearGradient
            colors={['rgba(109, 0, 255, 0.15)', 'rgba(109, 0, 255, 0.05)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Inner content */}
        <View style={styles.content}>
          {children}
        </View>
      </BlurView>

      {/* Bottom inner shadow for depth */}
      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.3)']}
        style={styles.innerShadow}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(15, 15, 18, 0.8)',
    // Subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  containerElevated: {
    borderColor: 'rgba(109, 0, 255, 0.2)',
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 24,
  },
  containerMint: {
    borderColor: 'rgba(0, 245, 170, 0.2)',
    backgroundColor: 'rgba(0, 245, 170, 0.05)',
  },
  containerHero: {
    borderColor: 'rgba(109, 0, 255, 0.3)',
    backgroundColor: 'rgba(20, 15, 30, 0.9)',
  },
  outerGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: borderRadius.xl + 2,
    backgroundColor: 'transparent',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  blur: {
    flex: 1,
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 24,
    right: 24,
    height: 1,
  },
  innerShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
});
