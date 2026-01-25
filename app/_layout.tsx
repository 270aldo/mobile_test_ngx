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
    });
  }, [hydrate]);

  if (!isHydrated) {
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
  // ┌─────────────────────────────────────────────────────────────┐
  // │  DEV MODE: Auth bypass enabled for UI development          │
  // │  To enable real auth, uncomment the block below and        │
  // │  comment out the DEV MODE block                            │
  // └─────────────────────────────────────────────────────────────┘

  // PRODUCTION AUTH (uncomment when ready):
  // const isLoggedIn = useIsAuthenticated();
  // const user = useAuthStore((s) => s.user);
  // const needsOnboarding = !!user && !user.user_metadata?.onboarding_completed;

  // DEV MODE: Skip auth for design work
  const isLoggedIn = true;
  const needsOnboarding = false;

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
