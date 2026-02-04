/**
 * Workout API Service
 *
 * Operations for workout logging and exercise tracking
 */

import { supabase } from '@/lib/supabase';
import { handleQueryResult, handleQueryResultOrNull } from './base';
import type {
  Workout,
  ExerciseBlock,
  WorkoutLog,
  SetLog,
  WorkoutWithLogs,
  TablesInsert,
} from '@/types';

export const workoutApi = {
  /**
   * Get workout by ID with exercise blocks
   */
  getWorkout: async (workoutId: string): Promise<WorkoutWithLogs | null> => {
    const { data, error } = await supabase
      .from('workouts')
      .select(`
        *,
        exercise_blocks (*),
        workout_logs (*)
      `)
      .eq('id', workoutId)
      .single();

    return handleQueryResultOrNull(data, error);
  },

  /**
   * Get exercise blocks for a workout
   */
  getExerciseBlocks: async (workoutId: string): Promise<ExerciseBlock[]> => {
    const { data, error } = await supabase
      .from('exercise_blocks')
      .select('*')
      .eq('workout_id', workoutId)
      .order('order_index');

    return handleQueryResult(data ?? [], error);
  },

  /**
   * Update workout status
   */
  updateWorkoutStatus: async (
    workoutId: string,
    status: 'scheduled' | 'in_progress' | 'completed' | 'skipped'
  ): Promise<Workout> => {
    const { data, error } = await supabase
      .from('workouts')
      .update({ status })
      .eq('id', workoutId)
      .select()
      .single();

    return handleQueryResult(data, error);
  },

  /**
   * Start a workout - create workout log
   */
  startWorkout: async (
    workoutId: string,
    userId: string
  ): Promise<WorkoutLog> => {
    // Update workout status to in_progress
    await workoutApi.updateWorkoutStatus(workoutId, 'in_progress');

    // Create workout log
    const { data, error } = await supabase
      .from('workout_logs')
      .insert({
        workout_id: workoutId,
        user_id: userId,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    return handleQueryResult(data, error);
  },

  /**
   * Complete a workout
   */
  completeWorkout: async (
    workoutLogId: string,
    workoutId: string,
    completionData: {
      perceived_effort?: number;
      energy_level?: number;
      mood_before?: number;
      mood_after?: number;
      notes?: string;
      pain_points?: string[];
    }
  ): Promise<WorkoutLog> => {
    const completedAt = new Date().toISOString();

    // Update workout status
    await workoutApi.updateWorkoutStatus(workoutId, 'completed');

    // Update workout log
    const { data, error } = await supabase
      .from('workout_logs')
      .update({
        ...completionData,
        completed_at: completedAt,
      })
      .eq('id', workoutLogId)
      .select()
      .single();

    return handleQueryResult(data, error);
  },

  /**
   * Log a single set
   */
  logSet: async (setData: TablesInsert<'set_logs'>): Promise<SetLog> => {
    const { data, error } = await supabase
      .from('set_logs')
      .insert(setData)
      .select()
      .single();

    return handleQueryResult(data, error);
  },

  /**
   * Log multiple sets at once
   */
  logSets: async (setsData: TablesInsert<'set_logs'>[]): Promise<SetLog[]> => {
    const { data, error } = await supabase
      .from('set_logs')
      .insert(setsData)
      .select();

    return handleQueryResult(data ?? [], error);
  },

  /**
   * Get set logs for a workout log
   */
  getSetLogs: async (workoutLogId: string): Promise<SetLog[]> => {
    const { data, error } = await supabase
      .from('set_logs')
      .select('*')
      .eq('workout_log_id', workoutLogId)
      .order('logged_at');

    return handleQueryResult(data ?? [], error);
  },

  /**
   * Get workout history for user
   */
  getWorkoutHistory: async (
    userId: string,
    limit: number = 10
  ): Promise<WorkoutLog[]> => {
    const { data, error } = await supabase
      .from('workout_logs')
      .select('*')
      .eq('user_id', userId)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false })
      .limit(limit);

    return handleQueryResult(data ?? [], error);
  },

  /**
   * Get last completed workout
   */
  getLastWorkout: async (userId: string): Promise<WorkoutLog | null> => {
    const { data, error } = await supabase
      .from('workout_logs')
      .select('*')
      .eq('user_id', userId)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false })
      .limit(1)
      .single();

    return handleQueryResultOrNull(data, error);
  },
};
