import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors } from '@/constants/theme';
import { useIsAuthenticated, useIsHydrated, useUser } from '@/stores/auth';

export default function Index() {
  const isHydrated = useIsHydrated();
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();
  const devBypass = __DEV__ && process.env.EXPO_PUBLIC_DEV_BYPASS === 'true';

  if (!isHydrated && !devBypass) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (devBypass) {
    return <Redirect href="/(tabs)" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  const needsOnboarding = !user?.user_metadata?.onboarding_completed;
  if (needsOnboarding) {
    return <Redirect href="/(onboarding)" />;
  }

  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
