import { Stack } from 'expo-router';
import { colors } from '@/constants/theme';

export default function NourishLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.void } }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
