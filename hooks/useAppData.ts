/**
 * useAppData Hook
 *
 * Fetches all app data on mount when user is authenticated
 * This is the main data loading hook for the app
 */

import { useEffect } from 'react';
import { useUser } from '@/stores';
import { useProfileStore } from '@/stores/profile';
import { useSeasonStore } from '@/stores/season';
import { useProgressStore } from '@/stores/progress';
import { useChatStore } from '@/stores/chat';

export function useAppData() {
  const user = useUser();
  const fetchProfile = useProfileStore((s) => s.fetchProfile);
  const fetchSeasonAll = useSeasonStore((s) => s.fetchAll);
  const fetchProgressAll = useProgressStore((s) => s.fetchAll);
  const fetchMessages = useChatStore((s) => s.fetchMessages);
  const subscribeToMessages = useChatStore((s) => s.subscribeToMessages);
  const unsubscribe = useChatStore((s) => s.unsubscribe);

  useEffect(() => {
    if (!user?.id) return;

    // Fetch all data
    fetchProfile(user.id);
    fetchSeasonAll(user.id);
    fetchProgressAll(user.id);
    fetchMessages(user.id);

    // Subscribe to realtime messages
    subscribeToMessages(user.id);

    // Cleanup on unmount
    return () => {
      unsubscribe(user.id);
    };
  }, [user?.id]);
}

/**
 * useRefreshData Hook
 *
 * Returns a function to refresh all app data
 */
export function useRefreshData() {
  const user = useUser();
  const fetchProfile = useProfileStore((s) => s.fetchProfile);
  const fetchSeasonAll = useSeasonStore((s) => s.fetchAll);
  const fetchProgressAll = useProgressStore((s) => s.fetchAll);

  const refresh = async () => {
    if (!user?.id) return;

    await Promise.all([
      fetchProfile(user.id),
      fetchSeasonAll(user.id),
      fetchProgressAll(user.id),
    ]);
  };

  return refresh;
}
