/**
 * Progress Store
 *
 * Manages check-ins, streaks, and badges
 *
 * IMPORTANT: Always use selectors to access state to prevent unnecessary re-renders
 */

import { create } from 'zustand';
import { checkinApi, coachApi } from '@/services/api';
import { getTodayDate } from '@/services/api/base';
import type { Checkin, Streak, Badge, CoachNote } from '@/types';

interface ProgressState {
  todayCheckin: Checkin | null;
  weeklyCheckin: Checkin | null;
  checkinHistory: Checkin[];
  streaks: Streak[];
  badges: Badge[];
  coachNotes: CoachNote[];
  weightHistory: { date: string; weight_kg: number }[];
  isLoading: boolean;
  error: string | null;
}

interface ProgressActions {
  fetchTodayCheckin: (userId: string) => Promise<void>;
  fetchWeeklyCheckin: (userId: string) => Promise<void>;
  fetchStreaks: (userId: string) => Promise<void>;
  fetchBadges: (userId: string) => Promise<void>;
  fetchCoachNotes: (userId: string) => Promise<void>;
  fetchWeightHistory: (userId: string) => Promise<void>;
  fetchAll: (userId: string) => Promise<void>;
  submitDailyCheckin: (userId: string, data: Partial<Checkin>) => Promise<void>;
  submitWeeklyCheckin: (userId: string, data: Partial<Checkin>) => Promise<void>;
  dismissCoachNote: (noteId: string) => Promise<void>;
  reset: () => void;
}

type ProgressStore = ProgressState & ProgressActions;

const initialState: ProgressState = {
  todayCheckin: null,
  weeklyCheckin: null,
  checkinHistory: [],
  streaks: [],
  badges: [],
  coachNotes: [],
  weightHistory: [],
  isLoading: false,
  error: null,
};

export const useProgressStore = create<ProgressStore>((set, get) => ({
  ...initialState,

  fetchTodayCheckin: async (userId: string) => {
    try {
      const todayCheckin = await checkinApi.getTodayCheckin(userId);
      set({ todayCheckin });
    } catch (error) {
      console.error('Failed to fetch today checkin:', error);
    }
  },

  fetchWeeklyCheckin: async (userId: string) => {
    try {
      const weeklyCheckin = await checkinApi.getWeeklyCheckin(userId);
      set({ weeklyCheckin });
    } catch (error) {
      console.error('Failed to fetch weekly checkin:', error);
    }
  },

  fetchStreaks: async (userId: string) => {
    try {
      const streaks = await coachApi.getStreaks(userId);
      set({ streaks });
    } catch (error) {
      console.error('Failed to fetch streaks:', error);
    }
  },

  fetchBadges: async (userId: string) => {
    try {
      const badges = await coachApi.getBadges(userId);
      set({ badges });
    } catch (error) {
      console.error('Failed to fetch badges:', error);
    }
  },

  fetchCoachNotes: async (userId: string) => {
    try {
      const coachNotes = await coachApi.getHomeCoachNotes(userId);
      set({ coachNotes });
    } catch (error) {
      console.error('Failed to fetch coach notes:', error);
    }
  },

  fetchWeightHistory: async (userId: string) => {
    try {
      const weightHistory = await checkinApi.getWeightHistory(userId);
      set({ weightHistory });
    } catch (error) {
      console.error('Failed to fetch weight history:', error);
    }
  },

  /**
   * Fetch all progress data at once
   */
  fetchAll: async (userId: string) => {
    set({ isLoading: true, error: null });

    try {
      const [todayCheckin, weeklyCheckin, streaks, badges, coachNotes, weightHistory] =
        await Promise.all([
          checkinApi.getTodayCheckin(userId),
          checkinApi.getWeeklyCheckin(userId),
          coachApi.getStreaks(userId),
          coachApi.getBadges(userId),
          coachApi.getHomeCoachNotes(userId),
          checkinApi.getWeightHistory(userId),
        ]);

      set({
        todayCheckin,
        weeklyCheckin,
        streaks,
        badges,
        coachNotes,
        weightHistory,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch progress data',
      });
    }
  },

  submitDailyCheckin: async (userId: string, data: Partial<Checkin>) => {
    set({ isLoading: true });

    try {
      const todayCheckin = await checkinApi.upsertDailyCheckin(userId, data);
      set({ todayCheckin, isLoading: false });

      // Update checkin streak
      await coachApi.updateStreak(userId, 'checkin');
      const streaks = await coachApi.getStreaks(userId);
      set({ streaks });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to submit checkin',
      });
    }
  },

  submitWeeklyCheckin: async (userId: string, data: Partial<Checkin>) => {
    set({ isLoading: true });

    try {
      const weeklyCheckin = await checkinApi.upsertWeeklyCheckin(userId, {
        ...data,
        date: getTodayDate(),
      });
      set({ weeklyCheckin, isLoading: false });

      // Refresh weight history if weight was submitted
      if (data.weight_kg) {
        const weightHistory = await checkinApi.getWeightHistory(userId);
        set({ weightHistory });
      }
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to submit weekly checkin',
      });
    }
  },

  dismissCoachNote: async (noteId: string) => {
    try {
      await coachApi.dismissCoachNote(noteId);
      set((state) => ({
        coachNotes: state.coachNotes.filter((n) => n.id !== noteId),
      }));
    } catch (error) {
      console.error('Failed to dismiss coach note:', error);
    }
  },

  reset: () => set(initialState),
}));

// Selector hooks
export const useTodayCheckin = () => useProgressStore((s) => s.todayCheckin);
export const useWeeklyCheckin = () => useProgressStore((s) => s.weeklyCheckin);
export const useStreaks = () => useProgressStore((s) => s.streaks);
export const useBadges = () => useProgressStore((s) => s.badges);
export const useCoachNotes = () => useProgressStore((s) => s.coachNotes);
export const useWeightHistory = () => useProgressStore((s) => s.weightHistory);
export const useProgressLoading = () => useProgressStore((s) => s.isLoading);
export const useProgressError = () => useProgressStore((s) => s.error);

// Derived selectors - use shallow comparison to avoid infinite loops
export const useWorkoutStreak = () => {
  const streaks = useProgressStore((s) => s.streaks);
  return streaks.find((streak) => streak.streak_type === 'workout') ?? null;
};
export const useCheckinStreak = () => {
  const streaks = useProgressStore((s) => s.streaks);
  return streaks.find((streak) => streak.streak_type === 'checkin') ?? null;
};
export const useHasTodayCheckin = () => useProgressStore((s) => s.todayCheckin !== null);
export const useActiveCoachNote = () => {
  const coachNotes = useProgressStore((s) => s.coachNotes);
  return coachNotes[0] ?? null;
};
