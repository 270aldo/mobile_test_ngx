/**
 * Checkin API Service
 *
 * Operations for daily and weekly check-ins
 */

import { supabase } from '@/lib/supabase';
import { handleQueryResult, handleQueryResultOrNull, getTodayDate, getWeekStartDate } from './base';
import type { Checkin, TablesInsert, TablesUpdate } from '@/types';

export const checkinApi = {
  /**
   * Get today's daily checkin
   */
  getTodayCheckin: async (userId: string): Promise<Checkin | null> => {
    const today = getTodayDate();

    const { data, error } = await supabase
      .from('checkins')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'daily')
      .eq('date', today)
      .single();

    return handleQueryResultOrNull(data, error);
  },

  /**
   * Get this week's weekly checkin
   */
  getWeeklyCheckin: async (userId: string): Promise<Checkin | null> => {
    // Get start of current week (Monday, local)
    const weekStart = getWeekStartDate();

    const { data, error } = await supabase
      .from('checkins')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'weekly')
      .gte('date', weekStart)
      .order('date', { ascending: false })
      .limit(1)
      .single();

    return handleQueryResultOrNull(data, error);
  },

  /**
   * Create or update daily checkin
   */
  upsertDailyCheckin: async (
    userId: string,
    checkinData: Omit<TablesInsert<'checkins'>, 'user_id' | 'type' | 'date'>
  ): Promise<Checkin> => {
    const today = getTodayDate();

    const { data, error } = await supabase
      .from('checkins')
      .upsert(
        {
          user_id: userId,
          type: 'daily',
          date: today,
          ...checkinData,
        },
        { onConflict: 'user_id,type,date' }
      )
      .select()
      .single();

    return handleQueryResult(data, error);
  },

  /**
   * Create or update weekly checkin
   */
  upsertWeeklyCheckin: async (
    userId: string,
    checkinData: Omit<TablesInsert<'checkins'>, 'user_id' | 'type'>
  ): Promise<Checkin> => {
    const { data, error } = await supabase
      .from('checkins')
      .upsert(
        {
          user_id: userId,
          type: 'weekly',
          ...checkinData,
        },
        { onConflict: 'user_id,type,date' }
      )
      .select()
      .single();

    return handleQueryResult(data, error);
  },

  /**
   * Get checkin history
   */
  getCheckinHistory: async (
    userId: string,
    type: 'daily' | 'weekly',
    limit: number = 30
  ): Promise<Checkin[]> => {
    const { data, error } = await supabase
      .from('checkins')
      .select('*')
      .eq('user_id', userId)
      .eq('type', type)
      .order('date', { ascending: false })
      .limit(limit);

    return handleQueryResult(data ?? [], error);
  },

  /**
   * Get checkins for date range
   */
  getCheckinsByDateRange: async (
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<Checkin[]> => {
    const { data, error } = await supabase
      .from('checkins')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date');

    return handleQueryResult(data ?? [], error);
  },

  /**
   * Get weight history for progress chart
   */
  getWeightHistory: async (
    userId: string,
    limit: number = 12
  ): Promise<Array<{ date: string; weight_kg: number }>> => {
    const { data, error } = await supabase
      .from('checkins')
      .select('date, weight_kg')
      .eq('user_id', userId)
      .eq('type', 'weekly')
      .not('weight_kg', 'is', null)
      .order('date', { ascending: false })
      .limit(limit);

    const result = handleQueryResult(data ?? [], error);
    return result
      .filter((c): c is { date: string; weight_kg: number } => c.weight_kg !== null)
      .reverse();
  },
};
