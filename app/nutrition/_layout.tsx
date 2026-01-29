import { Stack } from 'expo-router';
import { colors } from '@/constants/theme';

export default function NutritionLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.void },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="log" />
      <Stack.Screen name="supplements" />
    </Stack>
  );
}
