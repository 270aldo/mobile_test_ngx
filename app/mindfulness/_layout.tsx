import { Stack } from 'expo-router';
import { colors } from '@/constants/theme';

export default function MindfulnessLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.void },
      }}
    >
      <Stack.Screen name="visualization" />
    </Stack>
  );
}
