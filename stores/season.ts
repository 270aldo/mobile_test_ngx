/**
 * Season Store
 *
 * Manages active training season and today's workout
 *
 * IMPORTANT: Always use selectors to access state to prevent unnecessary re-renders
 */

import { create } from 'zustand';
import { seasonApi } from '@/services/api';
import type { Season, Workout, WorkoutWithExercises } from '@/types';

interface SeasonState {
  activeSeason: Season | null;
  todayWorkout: WorkoutWithExercises | null;
  weekWorkouts: Workout[];
  isLoading: boolean;
  error: string | null;
}

interface SeasonActions {
  fetchActiveSeason: (userId: string) => Promise<void>;
  fetchTodayWorkout: (userId: string) => Promise<void>;
  fetchWeekWorkouts: (userId: string) => Promise<void>;
  fetchAll: (userId: string) => Promise<void>;
  reset: () => void;
}

type SeasonStore = SeasonState & SeasonActions;

const initialState: SeasonState = {
  activeSeason: null,
  todayWorkout: null,
  weekWorkouts: [],
  isLoading: false,
  error: null,
};

export const useSeasonStore = create<SeasonStore>((set, get) => ({
  ...initialState,

  /**
   * Fetch active season
   */
  fetchActiveSeason: async (userId: string) => {
    set({ isLoading: true, error: null });

    try {
      const activeSeason = await seasonApi.getActiveSeason(userId);
      set({ activeSeason, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch season',
      });
    }
  },

  /**
   * Fetch today's workout
   */
  fetchTodayWorkout: async (userId: string) => {
    try {
      const todayWorkout = await seasonApi.getTodayWorkout(userId);
      set({ todayWorkout });
    } catch (error) {
      console.error('Failed to fetch today workout:', error);
    }
  },

  /**
   * Fetch current week's workouts
   */
  fetchWeekWorkouts: async (userId: string) => {
    try {
      const weekWorkouts = await seasonApi.getCurrentWeekWorkouts(userId);
      set({ weekWorkouts });
    } catch (error) {
      console.error('Failed to fetch week workouts:', error);
    }
  },

  /**
   * Fetch all season data at once
   */
  fetchAll: async (userId: string) => {
    set({ isLoading: true, error: null });

    try {
      const [activeSeason, todayWorkout, weekWorkouts] = await Promise.all([
        seasonApi.getActiveSeason(userId),
        seasonApi.getTodayWorkout(userId),
        seasonApi.getCurrentWeekWorkouts(userId),
      ]);

      set({
        activeSeason,
        todayWorkout,
        weekWorkouts,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch season data',
      });
    }
  },

  /**
   * Reset store state
   */
  reset: () => set(initialState),
}));

// Selector hooks
export const useActiveSeason = () => useSeasonStore((s) => s.activeSeason);
export const useTodayWorkout = () => useSeasonStore((s) => s.todayWorkout);
export const useWeekWorkouts = () => useSeasonStore((s) => s.weekWorkouts);
export const useSeasonLoading = () => useSeasonStore((s) => s.isLoading);
export const useSeasonError = () => useSeasonStore((s) => s.error);

// Derived selectors
export const useCurrentWeek = () => useSeasonStore((s) => s.activeSeason?.current_week ?? 1);
export const useCurrentPhase = () => useSeasonStore((s) => s.activeSeason?.current_phase ?? 'foundation');
export const useHasTodayWorkout = () => useSeasonStore((s) => s.todayWorkout !== null);
