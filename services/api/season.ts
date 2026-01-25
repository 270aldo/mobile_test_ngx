/**
 * Season API Service
 *
 * Operations for training seasons and related workouts
 */

import { supabase } from '@/lib/supabase';
import { handleQueryResult, handleQueryResultOrNull, getTodayDate } from './base';
import type { Season, Workout, SeasonWithWorkouts, WorkoutWithExercises } from '@/types';

export const seasonApi = {
  /**
   * Get active season for user
   */
  getActiveSeason: async (userId: string): Promise<Season | null> => {
    const { data, error } = await supabase
      .from('seasons')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    return handleQueryResultOrNull(data, error);
  },

  /**
   * Get active season with all workouts
   */
  getActiveSeasonWithWorkouts: async (
    userId: string
  ): Promise<SeasonWithWorkouts | null> => {
    const { data, error } = await supabase
      .from('seasons')
      .select(`
        *,
        workouts (
          *,
          exercise_blocks (*)
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    return handleQueryResultOrNull(data, error);
  },

  /**
   * Get today's workout for user
   */
  getTodayWorkout: async (userId: string): Promise<WorkoutWithExercises | null> => {
    const today = getTodayDate();

    const { data, error } = await supabase
      .from('workouts')
      .select(`
        *,
        exercise_blocks (*)
      `)
      .eq('user_id', userId)
      .eq('scheduled_date', today)
      .single();

    return handleQueryResultOrNull(data, error);
  },

  /**
   * Get workouts for a specific week in a season
   */
  getWeekWorkouts: async (
    userId: string,
    seasonId: string,
    weekNumber: number
  ): Promise<Workout[]> => {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', userId)
      .eq('season_id', seasonId)
      .eq('week_number', weekNumber)
      .order('day_of_week');

    return handleQueryResult(data ?? [], error);
  },

  /**
   * Get current week's workouts from active season
   */
  getCurrentWeekWorkouts: async (userId: string): Promise<Workout[]> => {
    const season = await seasonApi.getActiveSeason(userId);
    if (!season) return [];

    return seasonApi.getWeekWorkouts(userId, season.id, season.current_week ?? 1);
  },

  /**
   * Update season progress (current week/phase)
   */
  updateSeasonProgress: async (
    seasonId: string,
    updates: { current_week?: number; current_phase?: string }
  ): Promise<Season> => {
    const { data, error } = await supabase
      .from('seasons')
      .update(updates)
      .eq('id', seasonId)
      .select()
      .single();

    return handleQueryResult(data, error);
  },

  /**
   * Get all seasons for user (for history view)
   */
  getAllSeasons: async (userId: string): Promise<Season[]> => {
    const { data, error } = await supabase
      .from('seasons')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return handleQueryResult(data ?? [], error);
  },
};
