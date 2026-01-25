/**
 * Profile API Service
 *
 * CRUD operations for user profiles and subscriptions
 */

import { supabase } from '@/lib/supabase';
import { handleQueryResult, handleQueryResultOrNull } from './base';
import type { Profile, Subscription, TablesUpdate } from '@/types';

export const profileApi = {
  /**
   * Get current user's profile
   */
  getProfile: async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    return handleQueryResultOrNull(data, error);
  },

  /**
   * Update user profile
   */
  updateProfile: async (
    userId: string,
    updates: TablesUpdate<'profiles'>
  ): Promise<Profile> => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    return handleQueryResult(data, error);
  },

  /**
   * Complete onboarding and update profile data
   */
  completeOnboarding: async (
    userId: string,
    profileData: TablesUpdate<'profiles'>
  ): Promise<Profile> => {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...profileData,
        onboarding_completed: true,
      })
      .eq('id', userId)
      .select()
      .single();

    return handleQueryResult(data, error);
  },

  /**
   * Get user's subscription
   */
  getSubscription: async (userId: string): Promise<Subscription | null> => {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    return handleQueryResultOrNull(data, error);
  },

  /**
   * Get profile with subscription
   */
  getProfileWithSubscription: async (
    userId: string
  ): Promise<{ profile: Profile | null; subscription: Subscription | null }> => {
    const [profile, subscription] = await Promise.all([
      profileApi.getProfile(userId),
      profileApi.getSubscription(userId),
    ]);

    return { profile, subscription };
  },
};
