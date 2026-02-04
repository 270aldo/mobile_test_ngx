import { useEffect, useRef, Component, type ReactNode } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore, useIsHydrated, useIsAuthenticated } from '@/stores/auth';
import { colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

/**
 * Error Boundary to prevent white screen crashes
 */
class RootErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('Root error boundary caught:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.loading}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>{this.state.error?.message}</Text>
          <StatusBar style="light" />
        </View>
      );
    }
    return this.props.children;
  }
}

export default function RootLayout() {
  return (
    <RootErrorBoundary>
      <RootLayoutContent />
    </RootErrorBoundary>
  );
}

function RootLayoutContent() {
  const isHydrated = useIsHydrated();
  const hasHydrated = useRef(false);

  useEffect(() => {
    // Prevent duplicate hydration calls
    if (hasHydrated.current) return;
    hasHydrated.current = true;

    let settled = false;
    const fallbackTimer = setTimeout(() => {
      if (settled) return;
      console.warn('Auth hydration timeout. Continuing with fallback.');
      if (!useAuthStore.getState().isHydrated) {
        useAuthStore.setState({ isHydrated: true });
      }
      SplashScreen.hideAsync();
    }, 5000);

    useAuthStore.getState().hydrate().finally(() => {
      settled = true;
      clearTimeout(fallbackTimer);
      SplashScreen.hideAsync();
    });

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, []);

  // DEV BYPASS: Skip hydration check to test UI (only in dev + explicit flag)
  const skipHydration = __DEV__ && process.env.EXPO_PUBLIC_DEV_BYPASS === 'true';

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
  // DEV BYPASS: Force show tabs for testing (only in dev + explicit flag)
  const devBypass = __DEV__ && process.env.EXPO_PUBLIC_DEV_BYPASS === 'true';
  const isAuthenticated = useIsAuthenticated();

  // Real authentication flow
  const isLoggedIn = devBypass || isAuthenticated;
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
  errorTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorMessage: {
    color: colors.chrome,
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
