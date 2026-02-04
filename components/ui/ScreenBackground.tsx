import React from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  ImageBackground,
  ImageResizeMode,
  ImageSourcePropType,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/theme';

interface ScreenBackgroundProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  gradientColors?: string[];
  gradientLocations?: number[];
  glowColors?: [string, string];
  glowHeight?: number;
  backgroundImage?: ImageSourcePropType;
  backgroundImageResizeMode?: ImageResizeMode;
  testID?: string;
}

/**
 * ScreenBackground - Shared gradient + optional glow backdrop
 */
export function ScreenBackground({
  children,
  style,
  gradientColors = ['#0A0A0F', '#0D0B14', '#050505'],
  gradientLocations = [0, 0.4, 1],
  glowColors,
  glowHeight = 400,
  backgroundImage,
  backgroundImageResizeMode = 'cover',
  testID,
}: ScreenBackgroundProps) {
  return (
    <View style={[styles.container, style]} testID={testID}>
      {backgroundImage && (
        <ImageBackground
          source={backgroundImage}
          style={StyleSheet.absoluteFill}
          resizeMode={backgroundImageResizeMode}
        />
      )}
      <LinearGradient
        colors={gradientColors as [string, string, ...string[]]}
        locations={gradientLocations as [number, number, ...number[]]}
        style={StyleSheet.absoluteFill}
      />

      {glowColors && (
        <View style={[styles.glowContainer, { height: glowHeight }]}>
          <LinearGradient
            colors={glowColors}
            style={styles.glow}
          />
        </View>
      )}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.void,
  },
  glowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  glow: {
    flex: 1,
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
  },
});

export default ScreenBackground;
