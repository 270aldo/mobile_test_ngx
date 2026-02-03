/**
 * Coach API Service
 *
 * Operations for coach assignments and notes
 */

import { supabase } from '@/lib/supabase';
import { getLocalDateString, getTodayDate, handleQueryResult, handleQueryResultOrNull } from './base';
import type { CoachAssignment, CoachNote, Badge, Streak } from '@/types';

export const coachApi = {
  /**
   * Get active coach assignment for user
   */
  getCoachAssignment: async (userId: string): Promise<CoachAssignment | null> => {
    const { data, error } = await supabase
      .from('coach_assignments')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    return handleQueryResultOrNull(data, error);
  },

  /**
   * Get active coach notes for user
   */
  getActiveCoachNotes: async (
    userId: string,
    location?: string
  ): Promise<CoachNote[]> => {
    let query = supabase
      .from('coach_notes')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .is('dismissed_at', null)
      .order('created_at', { ascending: false });

    // Filter by location if specified
    if (location) {
      query = query.contains('display_location', [location]);
    }

    // Filter out expired notes
    const now = new Date().toISOString();
    query = query.or(`show_until.is.null,show_until.gt.${now}`);

    const { data, error } = await query;

    return handleQueryResult(data ?? [], error);
  },

  /**
   * Get coach notes for home screen
   */
  getHomeCoachNotes: async (userId: string): Promise<CoachNote[]> => {
    return coachApi.getActiveCoachNotes(userId, 'home');
  },

  /**
   * Dismiss a coach note
   */
  dismissCoachNote: async (noteId: string): Promise<CoachNote> => {
    const { data, error } = await supabase
      .from('coach_notes')
      .update({ dismissed_at: new Date().toISOString() })
      .eq('id', noteId)
      .select()
      .single();

    return handleQueryResult(data, error);
  },

  /**
   * Get user badges
   */
  getBadges: async (userId: string): Promise<Badge[]> => {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    return handleQueryResult(data ?? [], error);
  },

  /**
   * Get user streaks
   */
  getStreaks: async (userId: string): Promise<Streak[]> => {
    const { data, error } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId);

    return handleQueryResult(data ?? [], error);
  },

  /**
   * Get specific streak
   */
  getStreak: async (
    userId: string,
    streakType: 'workout' | 'checkin' | 'hydration' | 'mindfulness'
  ): Promise<Streak | null> => {
    const { data, error } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .eq('streak_type', streakType)
      .single();

    return handleQueryResultOrNull(data, error);
  },

  /**
   * Update streak (called after completing an activity)
   */
  updateStreak: async (
    userId: string,
    streakType: 'workout' | 'checkin' | 'hydration' | 'mindfulness'
  ): Promise<Streak> => {
    const today = getTodayDate();
    const existingStreak = await coachApi.getStreak(userId, streakType);

    if (existingStreak) {
      // Check if already updated today
      if (existingStreak.last_activity_date === today) {
        return existingStreak;
      }

      // Check if streak continues (yesterday or earlier today)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = getLocalDateString(yesterday);

      const continuesStreak = existingStreak.last_activity_date === yesterdayStr;
      const newCount = continuesStreak ? (existingStreak.current_count ?? 0) + 1 : 1;
      const newLongest = Math.max(existingStreak.longest_count ?? 0, newCount);

      const { data, error } = await supabase
        .from('streaks')
        .update({
          current_count: newCount,
          longest_count: newLongest,
          last_activity_date: today,
          streak_started_at: continuesStreak
            ? existingStreak.streak_started_at
            : new Date().toISOString(),
        })
        .eq('id', existingStreak.id)
        .select()
        .single();

      return handleQueryResult(data, error);
    } else {
      // Create new streak
      const { data, error } = await supabase
        .from('streaks')
        .insert({
          user_id: userId,
          streak_type: streakType,
          current_count: 1,
          longest_count: 1,
          last_activity_date: today,
          streak_started_at: new Date().toISOString(),
        })
        .select()
        .single();

      return handleQueryResult(data, error);
    }
  },
};
