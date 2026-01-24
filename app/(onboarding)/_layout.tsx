import { Stack } from 'expo-router';
import { colors } from '@/constants/theme';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
        gestureEnabled: false, // Prevent back gesture during onboarding
      }}
    >
      <Stack.Screen name="index" />
      {/* Onboarding screens will be added here */}
      {/* The 14-step onboarding flow will include:
          1. Welcome
          2. Goal Selection
          3. Experience Level
          4. Body Metrics
          5. Workout Frequency
          6. Available Equipment
          7. Time Availability
          8. Injuries/Limitations
          9. Nutrition Preferences
          10. Sleep Schedule
          11. Coach Introduction
          12. AI Calibration
          13. Subscription Selection
          14. Setup Complete
      */}
    </Stack>
  );
}
