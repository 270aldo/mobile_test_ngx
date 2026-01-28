import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/theme';

export type VideoOverlayType = 'none' | 'gradient' | 'dark' | 'violet';

interface VideoBackgroundProps {
  source: { uri: string } | number; // number for require()
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  overlay?: VideoOverlayType;
  overlayOpacity?: number;
  isPlaying?: boolean;
  isMuted?: boolean;
  shouldLoop?: boolean;
  onLoad?: () => void;
  onError?: (error: string) => void;
  fallbackColor?: string;
  testID?: string;
}

/**
 * VideoBackground - Ambient video background for premium screens
 *
 * Use cases:
 * - Splash/Login screens
 * - Rest timer background
 * - Hero sections with motion
 *
 * Features:
 * - Auto-loop
 * - Multiple overlay types
 * - Fallback color while loading
 * - Performance optimized (muted, no controls)
 *
 * @example
 * <VideoBackground
 *   source={require('@/assets/videos/rest_timer_bg.mp4')}
 *   overlay="violet"
 *   overlayOpacity={0.5}
 * >
 *   <Text>Rest Timer Content</Text>
 * </VideoBackground>
 */
export function VideoBackground({
  source,
  children,
  style,
  overlay = 'gradient',
  overlayOpacity = 0.6,
  isPlaying = true,
  isMuted = true,
  shouldLoop = true,
  onLoad,
  onError,
  fallbackColor = colors.void,
  testID,
}: VideoBackgroundProps) {
  const videoRef = useRef<Video>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.playAsync();
      } else {
        videoRef.current.pauseAsync();
      }
    }
  }, [isPlaying]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded && !isLoaded) {
      setIsLoaded(true);
      onLoad?.();
    }
  };

  const renderOverlay = () => {
    switch (overlay) {
      case 'gradient':
        return (
          <LinearGradient
            colors={[
              `rgba(5, 5, 5, ${overlayOpacity * 0.3})`,
              `rgba(5, 5, 5, ${overlayOpacity * 0.5})`,
              `rgba(5, 5, 5, ${overlayOpacity})`,
            ]}
            locations={[0, 0.5, 1]}
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
      case 'violet':
        return (
          <LinearGradient
            colors={[
              `rgba(109, 0, 255, ${overlayOpacity * 0.2})`,
              `rgba(5, 5, 5, ${overlayOpacity * 0.5})`,
              `rgba(5, 5, 5, ${overlayOpacity})`,
            ]}
            locations={[0, 0.4, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: fallbackColor }, style]} testID={testID}>
      <Video
        ref={videoRef}
        source={source}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        shouldPlay={isPlaying}
        isLooping={shouldLoop}
        isMuted={isMuted}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        onError={(error) => onError?.(error || 'Video playback error')}
        // Performance optimizations
        useNativeControls={false}
        progressUpdateIntervalMillis={1000}
      />

      {/* Overlay */}
      {renderOverlay()}

      {/* Content */}
      <View style={styles.content} pointerEvents="box-none">
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
});

export default VideoBackground;
