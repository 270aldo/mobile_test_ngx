/**
 * Profile Store
 *
 * Manages user profile and subscription state
 *
 * IMPORTANT: Always use selectors to access state to prevent unnecessary re-renders
 */

import { create } from 'zustand';
import { profileApi } from '@/services/api';
import type { Profile, Subscription } from '@/types';

interface ProfileState {
  profile: Profile | null;
  subscription: Subscription | null;
  isLoading: boolean;
  error: string | null;
}

interface ProfileActions {
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<Profile>) => Promise<void>;
  completeOnboarding: (userId: string, data: Partial<Profile>) => Promise<void>;
  reset: () => void;
}

type ProfileStore = ProfileState & ProfileActions;

const initialState: ProfileState = {
  profile: null,
  subscription: null,
  isLoading: false,
  error: null,
};

export const useProfileStore = create<ProfileStore>((set, get) => ({
  ...initialState,

  /**
   * Fetch profile and subscription data
   */
  fetchProfile: async (userId: string) => {
    if (!userId) {
      set({ error: 'No user ID provided' });
      return;
    }
    set({ isLoading: true, error: null });

    try {
      const { profile, subscription } = await profileApi.getProfileWithSubscription(userId);
      set({ profile, subscription, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch profile',
      });
    }
  },

  /**
   * Update profile data
   */
  updateProfile: async (userId: string, updates: Partial<Profile>) => {
    if (!userId) {
      set({ error: 'No user ID provided' });
      return;
    }
    set({ isLoading: true, error: null });

    try {
      const profile = await profileApi.updateProfile(userId, updates);
      set({ profile, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update profile',
      });
    }
  },

  /**
   * Complete onboarding with profile data
   */
  completeOnboarding: async (userId: string, data: Partial<Profile>) => {
    set({ isLoading: true, error: null });

    try {
      const profile = await profileApi.completeOnboarding(userId, data);
      set({ profile, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to complete onboarding',
      });
    }
  },

  /**
   * Reset store state
   */
  reset: () => set(initialState),
}));

// Selector hooks for optimal re-renders
export const useProfile = () => useProfileStore((s) => s.profile);
export const useSubscription = () => useProfileStore((s) => s.subscription);
export const useProfileLoading = () => useProfileStore((s) => s.isLoading);
export const useProfileError = () => useProfileStore((s) => s.error);

// Derived selectors
export const useIsHybridPlan = () =>
  useProfileStore((s) => s.subscription?.plan?.includes('hybrid') ?? false);
export const useOnboardingCompleted = () =>
  useProfileStore((s) => s.profile?.onboarding_completed ?? false);
