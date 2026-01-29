/**
 * useAppData Hook
 *
 * Fetches all app data on mount when user is authenticated
 * This is the main data loading hook for the app
 */

import { useEffect, useCallback } from 'react';
import { useUser } from '@/stores';
import { useProfileStore } from '@/stores/profile';
import { useSeasonStore } from '@/stores/season';
import { useProgressStore } from '@/stores/progress';
import { useChatStore } from '@/stores/chat';
import { useNutritionStore } from '@/stores/nutrition';
import { useMindfulnessStore } from '@/stores/mindfulness';

export function useAppData() {
  const user = useUser();

  useEffect(() => {
    if (!user?.id) return;

    const userId = user.id;

    // Fetch all data via getState() to avoid stale closure deps
    useProfileStore.getState().fetchProfile(userId);
    useSeasonStore.getState().fetchAll(userId);
    useProgressStore.getState().fetchAll(userId);
    useChatStore.getState().fetchMessages(userId);
    useNutritionStore.getState().fetchTodayNutrition(userId);
    useNutritionStore.getState().fetchTargets(userId);
    useMindfulnessStore.getState().fetchAll(userId);

    // Subscribe to realtime messages
    useChatStore.getState().subscribeToMessages(userId);

    // Cleanup on unmount
    return () => {
      useChatStore.getState().unsubscribe(userId);
    };
  }, [user?.id]);
}

/**
 * useRefreshData Hook
 *
 * Returns a memoized function to refresh all app data
 */
export function useRefreshData() {
  const user = useUser();

  const refresh = useCallback(async () => {
    if (!user?.id) return;

    const userId = user.id;
    await Promise.all([
      useProfileStore.getState().fetchProfile(userId),
      useSeasonStore.getState().fetchAll(userId),
      useProgressStore.getState().fetchAll(userId),
      useNutritionStore.getState().fetchTodayNutrition(userId),
      useNutritionStore.getState().fetchTargets(userId),
      useMindfulnessStore.getState().fetchAll(userId),
    ]);
  }, [user?.id]);

  return refresh;
}
