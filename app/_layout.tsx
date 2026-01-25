import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore, useIsHydrated, useIsAuthenticated } from '@/stores/auth';
import { colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const isHydrated = useIsHydrated();

  useEffect(() => {
    hydrate().finally(() => {
      SplashScreen.hideAsync();
    }).catch(() => {
      SplashScreen.hideAsync();
    });
  }, [hydrate]);

  // DEV BYPASS: Skip hydration check to test UI
  const skipHydration = true;

  if (!isHydrated && !skipHydration) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <RootNavigator />
    </>
  );
}

function RootNavigator() {
  // DEV BYPASS: Force show tabs for testing
  const devBypass = true;

  // Real authentication flow
  const isLoggedIn = devBypass || useIsAuthenticated();
  const user = useAuthStore((s) => s.user);

  // Check if user needs onboarding (profile not completed)
  const needsOnboarding = !devBypass && !!user && !user.user_metadata?.onboarding_completed;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'fade',
      }}
    >
      {/* Protected: Only for authenticated users */}
      <Stack.Protected guard={isLoggedIn && !needsOnboarding}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>

      {/* Protected: Only for users who need onboarding */}
      <Stack.Protected guard={isLoggedIn && needsOnboarding}>
        <Stack.Screen name="(onboarding)" />
      </Stack.Protected>

      {/* Protected: Only for unauthenticated users */}
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      {/* Always accessible */}
      <Stack.Screen name="(modals)" options={{ presentation: 'modal' }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
