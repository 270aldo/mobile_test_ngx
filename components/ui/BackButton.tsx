import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { colors, touchTarget } from '@/constants/theme';

interface BackButtonProps {
  fallbackRoute?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * BackButton - Navigate back with safe fallback route
 */
export function BackButton({
  fallbackRoute = '/(tabs)',
  style,
  testID = 'back-button',
}: BackButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    const canGoBack =
      typeof (router as { canGoBack?: () => boolean }).canGoBack === 'function' &&
      (router as { canGoBack: () => boolean }).canGoBack();

    if (canGoBack) {
      router.back();
      return;
    }

    router.replace(fallbackRoute as any);
  };

  return (
    <Pressable
      style={[styles.button, style]}
      onPress={handlePress}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel="Regresar"
      accessibilityHint="Vuelve a la pantalla anterior"
    >
      <ChevronLeft size={20} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: touchTarget.min,
    height: touchTarget.min,
    borderRadius: touchTarget.min / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
