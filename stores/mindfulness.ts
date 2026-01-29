/**
 * Mindfulness Store
 *
 * Manages mindfulness session tracking and streaks.
 * Persists to Supabase mindfulness_sessions table.
 * Uses selectors to avoid unnecessary re-renders.
 */

import { create } from 'zustand';
import { mindfulnessApi } from '@/services/api/mindfulness';
import { coachApi } from '@/services/api/coach';
import type { MindfulnessSession } from '@/types';

interface MindfulnessState {
  todaySessions: MindfulnessSession[];
  sessionHistory: MindfulnessSession[];
  hasCompletedToday: boolean;
  isLoading: boolean;
  error: string | null;
}

interface MindfulnessActions {
  fetchTodaySessions: (userId: string) => Promise<void>;
  fetchSessionHistory: (userId: string) => Promise<void>;
  fetchAll: (userId: string) => Promise<void>;
  recordSession: (
    userId: string,
    session: {
      session_id: string;
      session_title: string;
      category?: string;
      duration_seconds: number;
      target_duration_seconds?: number;
      completed: boolean;
      phases_completed?: number;
      total_phases?: number;
    }
  ) => Promise<void>;
  reset: () => void;
}

type MindfulnessStore = MindfulnessState & MindfulnessActions;

const initialState: MindfulnessState = {
  todaySessions: [],
  sessionHistory: [],
  hasCompletedToday: false,
  isLoading: false,
  error: null,
};

export const useMindfulnessStore = create<MindfulnessStore>((set) => ({
  ...initialState,

  fetchTodaySessions: async (userId: string) => {
    try {
      const todaySessions = await mindfulnessApi.getTodaySessions(userId);
      const hasCompletedToday = todaySessions.some((s) => s.completed);
      set({ todaySessions, hasCompletedToday });
    } catch (err) {
      console.error('Failed to fetch today mindfulness sessions:', err);
    }
  },

  fetchSessionHistory: async (userId: string) => {
    try {
      const sessionHistory = await mindfulnessApi.getSessionHistory(userId);
      set({ sessionHistory });
    } catch (err) {
      console.error('Failed to fetch mindfulness history:', err);
    }
  },

  fetchAll: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const [todaySessions, sessionHistory] = await Promise.all([
        mindfulnessApi.getTodaySessions(userId),
        mindfulnessApi.getSessionHistory(userId),
      ]);
      const hasCompletedToday = todaySessions.some((s) => s.completed);
      set({
        todaySessions,
        sessionHistory,
        hasCompletedToday,
        isLoading: false,
      });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch mindfulness data',
      });
    }
  },

  recordSession: async (userId, session) => {
    set({ isLoading: true });
    try {
      const recorded = await mindfulnessApi.recordSession(userId, session);
      set((state) => ({
        todaySessions: [recorded, ...state.todaySessions],
        sessionHistory: [recorded, ...state.sessionHistory],
        hasCompletedToday: state.hasCompletedToday || session.completed,
        isLoading: false,
      }));

      // Update mindfulness streak if session was completed
      if (session.completed) {
        coachApi.updateStreak(userId, 'mindfulness').catch((err) => {
          console.error('Failed to update mindfulness streak:', err);
        });
      }
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to record session',
      });
    }
  },

  reset: () => set(initialState),
}));

// Selector hooks
export const useTodayMindfulnessSessions = () => useMindfulnessStore((s) => s.todaySessions);
export const useMindfulnessHistory = () => useMindfulnessStore((s) => s.sessionHistory);
export const useHasCompletedMindfulnessToday = () => useMindfulnessStore((s) => s.hasCompletedToday);
export const useMindfulnessLoading = () => useMindfulnessStore((s) => s.isLoading);
export const useMindfulnessError = () => useMindfulnessStore((s) => s.error);

// Derived selectors
export const useTodayMindfulnessCount = () => useMindfulnessStore((s) => s.todaySessions.length);
export const useTotalMindfulnessMinutes = () =>
  useMindfulnessStore((s) =>
    Math.round(s.sessionHistory.reduce((sum, session) => sum + (session.duration_seconds ?? 0), 0) / 60)
  );
