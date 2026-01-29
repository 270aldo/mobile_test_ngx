/**
 * Mindfulness API Service
 *
 * Operations for mindfulness session tracking
 */

import { supabase } from '@/lib/supabase';
import { handleQueryResult, getTodayDate } from './base';
import type { MindfulnessSession, TablesInsert } from '@/types';

export const mindfulnessApi = {
  /**
   * Get today's mindfulness sessions
   */
  getTodaySessions: async (userId: string): Promise<MindfulnessSession[]> => {
    const today = getTodayDate();

    const { data, error } = await supabase
      .from('mindfulness_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .order('created_at', { ascending: false });

    return handleQueryResult(data ?? [], error);
  },

  /**
   * Record a completed mindfulness session
   */
  recordSession: async (
    userId: string,
    session: Omit<TablesInsert<'mindfulness_sessions'>, 'id' | 'user_id' | 'date' | 'created_at' | 'updated_at'> & { date?: string }
  ): Promise<MindfulnessSession> => {
    const { date, ...rest } = session;
    const targetDate = date ?? getTodayDate();

    const { data, error } = await supabase
      .from('mindfulness_sessions')
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
   * Get session history (last N sessions)
   */
  getSessionHistory: async (
    userId: string,
    limit: number = 30
  ): Promise<MindfulnessSession[]> => {
    const { data, error } = await supabase
      .from('mindfulness_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    return handleQueryResult(data ?? [], error);
  },

  /**
   * Check if user has completed a session today
   */
  hasTodaySession: async (userId: string): Promise<boolean> => {
    const today = getTodayDate();

    const { data, error } = await supabase
      .from('mindfulness_sessions')
      .select('id')
      .eq('user_id', userId)
      .eq('date', today)
      .eq('completed', true)
      .limit(1);

    if (error) return false;
    return (data?.length ?? 0) > 0;
  },
};
