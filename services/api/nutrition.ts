/**
 * Nutrition API Service
 *
 * Operations for food logs and macro targets
 */

import { supabase } from '@/lib/supabase';
import { ApiError, handleQueryResult, handleQueryResultOrNull, getTodayDate } from './base';
import type { FoodLog, NutritionTarget, TablesInsert } from '@/types';

export const nutritionApi = {
  // ─── Food Logs ──────────────────────────────────────────

  /**
   * Get all food logs for a specific date (defaults to today)
   */
  getFoodLogsByDate: async (
    userId: string,
    date?: string
  ): Promise<FoodLog[]> => {
    const targetDate = date ?? getTodayDate();

    const { data, error } = await supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('date', targetDate)
      .order('created_at', { ascending: true });

    return handleQueryResult(data ?? [], error);
  },

  /**
   * Add a food item to a meal
   */
  addFoodLog: async (
    userId: string,
    item: Omit<TablesInsert<'food_logs'>, 'id' | 'user_id' | 'date' | 'created_at' | 'updated_at'> & { date?: string }
  ): Promise<FoodLog> => {
    const { date, ...rest } = item;
    const targetDate = date ?? getTodayDate();

    const { data, error } = await supabase
      .from('food_logs')
      .insert({
        user_id: userId,
        date: targetDate,
        ...rest,
      })
      .select()
      .single();

    return handleQueryResult(data, error);
  },

  /**
   * Remove a food log entry
   */
  removeFoodLog: async (logId: string): Promise<void> => {
    const { error } = await supabase
      .from('food_logs')
      .delete()
      .eq('id', logId);

    if (error) {
      throw new ApiError(error);
    }
  },

  /**
   * Remove all food logs for a meal type on a date
   */
  clearMealLogs: async (
    userId: string,
    mealType: string,
    date?: string
  ): Promise<void> => {
    const targetDate = date ?? getTodayDate();

    const { error } = await supabase
      .from('food_logs')
      .delete()
      .eq('user_id', userId)
      .eq('date', targetDate)
      .eq('meal_type', mealType);

    if (error) {
      throw new ApiError(error);
    }
  },

  // ─── Nutrition Targets ──────────────────────────────────

  /**
   * Get user's macro targets
   */
  getTargets: async (userId: string): Promise<NutritionTarget | null> => {
    const { data, error } = await supabase
      .from('nutrition_targets')
      .select('*')
      .eq('user_id', userId)
      .single();

    return handleQueryResultOrNull(data, error);
  },

  /**
   * Create or update user's macro targets
   */
  upsertTargets: async (
    userId: string,
    targets: Partial<Pick<NutritionTarget, 'calories' | 'protein' | 'carbs' | 'fat'>>
  ): Promise<NutritionTarget> => {
    const { data, error } = await supabase
      .from('nutrition_targets')
      .upsert(
        {
          user_id: userId,
          ...targets,
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    return handleQueryResult(data, error);
  },
};
