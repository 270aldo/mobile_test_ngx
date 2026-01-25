import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Loader2 } from 'lucide-react-native';
import { colors, spacing, typography } from '@/constants/theme';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * LoadingState - Animated loading indicator
 *
 * Provides visual feedback during async operations.
 * Features a spinning icon and optional message.
 */
export function LoadingState({
  message = 'Cargando...',
  size = 'md',
}: LoadingStateProps) {
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    // Spinning animation
    const spin = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Pulse animation for text
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 0.6,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    spin.start();
    pulse.start();

    return () => {
      spin.stop();
      pulse.stop();
    };
  }, [spinValue, pulseValue]);

  const rotation = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const iconSize = size === 'sm' ? 20 : size === 'lg' ? 32 : 24;

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
        <Loader2 size={iconSize} color={colors.ngx} />
      </Animated.View>
      <Animated.Text style={[styles.message, { opacity: pulseValue }]}>
        {message}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  message: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
