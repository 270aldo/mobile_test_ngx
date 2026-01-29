import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors, animation } from '@/constants/theme';

interface PulseDotProps {
  color?: 'ngx' | 'mint' | 'warning';
  size?: number;
}

/**
 * PulseDot - Indicador de mensaje nuevo con animación de pulso
 *
 * Basado en: mobile_genesis_hybrid_v2_flow.html
 * .pulse-dot { animation: pulse 1.6s ease-in-out infinite; }
 */
export function PulseDot({ color = 'mint', size = 8 }: PulseDotProps) {
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0.7);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.1, {
        duration: animation.duration.pulse / 2,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
    opacity.value = withRepeat(
      withTiming(1, {
        duration: animation.duration.pulse / 2,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, [scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const colorMap = {
    mint: colors.mint,
    ngx: colors.ngx,
    warning: colors.warning,
  };
  const dotColor = colorMap[color];

  return (
    <Animated.View
      style={[
        styles.dot,
        { width: size, height: size, backgroundColor: dotColor },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    borderRadius: 999,
  },
});
