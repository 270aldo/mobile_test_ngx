import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { colors, borderRadius, spacing } from '@/constants/theme';

interface ScrollControlsProps {
  onTopPress: () => void;
  onBottomPress: () => void;
  bottom?: number;
  right?: number;
  testIDPrefix?: string;
}

/**
 * ScrollControls - Floating up/down buttons for long screens
 */
export function ScrollControls({
  onTopPress,
  onBottomPress,
  bottom = 32,
  right = 16,
  testIDPrefix = 'scroll-controls',
}: ScrollControlsProps) {
  return (
    <View style={[styles.container, { bottom, right }]} pointerEvents="box-none">
      <Pressable
        style={styles.button}
        onPress={onTopPress}
        testID={`${testIDPrefix}-up`}
        accessibilityRole="button"
        accessibilityLabel="Subir"
      >
        <ChevronUp size={18} color={colors.text} />
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={onBottomPress}
        testID={`${testIDPrefix}-down`}
        accessibilityRole="button"
        accessibilityLabel="Bajar"
      >
        <ChevronDown size={18} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    gap: spacing.sm,
    zIndex: 20,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(8, 8, 12, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
