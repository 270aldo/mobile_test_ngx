import React from 'react';
import { StyleSheet, StyleProp, ImageStyle, View, ViewStyle } from 'react-native';
import { Image, ImageSource, ImageContentFit } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

// Default blurhash for NGX dark aesthetic
const DEFAULT_BLURHASH = '|00000fQfQfQfQfQfQfQfQfQ~qfQfQfQfQfQfQfQfQj[';

// NGX-specific blurhashes for different content types
export const blurhashes = {
  hero: '|14.w*IU0K9F00_3-;%M00~q4nofWBofWBWBofWBj[',
  avatar: '|00000fQfQfQfQfQ~qfQfQfQ',
  workout: '|25RZrxu-;%M~qIU00%M%M00',
  dark: '|00000fQfQfQfQfQfQfQfQfQ',
} as const;

export type OverlayType = 'none' | 'gradient' | 'dark' | 'vignette';

interface OptimizedImageProps {
  source: ImageSource | string | number;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  contentFit?: ImageContentFit;
  placeholder?: string;
  transition?: number;
  priority?: 'low' | 'normal' | 'high';
  overlay?: OverlayType;
  overlayOpacity?: number;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  testID?: string;
}

/**
 * OptimizedImage - High-performance image component for NGX GENESIS
 *
 * Features:
 * - Blurhash placeholder for smooth loading
 * - Multiple overlay types for text legibility
 * - Priority loading for hero images
 * - Automatic caching via expo-image
 *
 * @example
 * <OptimizedImage
 *   source={require('@/assets/images/hero/hero_upper_push.jpg')}
 *   style={{ width: '100%', height: 200 }}
 *   overlay="gradient"
 *   priority="high"
 * />
 */
export function OptimizedImage({
  source,
  style,
  containerStyle,
  contentFit = 'cover',
  placeholder = DEFAULT_BLURHASH,
  transition = 300,
  priority = 'normal',
  overlay = 'none',
  overlayOpacity = 0.6,
  onLoad,
  onError,
  testID,
}: OptimizedImageProps) {
  // Resolve source to proper format
  const resolvedSource = typeof source === 'string'
    ? { uri: source }
    : source;

  const renderOverlay = () => {
    switch (overlay) {
      case 'gradient':
        return (
          <LinearGradient
            colors={[
              'transparent',
              'transparent',
              `rgba(5, 5, 5, ${overlayOpacity * 0.3})`,
              `rgba(5, 5, 5, ${overlayOpacity})`,
            ]}
            locations={[0, 0.3, 0.7, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        );
      case 'dark':
        return (
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: `rgba(5, 5, 5, ${overlayOpacity})` },
            ]}
            pointerEvents="none"
          />
        );
      case 'vignette':
        return (
          <LinearGradient
            colors={[
              'transparent',
              `rgba(5, 5, 5, ${overlayOpacity * 0.5})`,
              `rgba(5, 5, 5, ${overlayOpacity})`,
            ]}
            locations={[0.3, 0.7, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Image
        source={resolvedSource}
        style={[styles.image, style]}
        placeholder={{ blurhash: placeholder }}
        contentFit={contentFit}
        transition={transition}
        priority={priority}
        onLoad={onLoad}
        onError={(e) => onError?.(new Error(e.error || 'Image load failed'))}
        testID={testID}
      />
      {renderOverlay()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default OptimizedImage;
