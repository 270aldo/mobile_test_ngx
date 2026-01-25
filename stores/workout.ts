/**
 * Workout Store
 *
 * Manages current workout session and logging
 *
 * IMPORTANT: Always use selectors to access state to prevent unnecessary re-renders
 */

import { create } from 'zustand';
import { workoutApi } from '@/services/api';
import type { Workout, ExerciseBlock, WorkoutLog, SetLog, WorkoutWithLogs } from '@/types';

interface WorkoutState {
  currentWorkout: WorkoutWithLogs | null;
  currentWorkoutLog: WorkoutLog | null;
  setLogs: SetLog[];
  isLoading: boolean;
  isInProgress: boolean;
  error: string | null;
}

interface WorkoutActions {
  loadWorkout: (workoutId: string) => Promise<void>;
  startWorkout: (workoutId: string, userId: string) => Promise<void>;
  logSet: (setData: Omit<SetLog, 'id' | 'logged_at'>) => Promise<void>;
  completeWorkout: (data: {
    perceived_effort?: number;
    energy_level?: number;
    mood_before?: number;
    mood_after?: number;
    notes?: string;
    pain_points?: string[];
  }) => Promise<void>;
  reset: () => void;
}

type WorkoutStore = WorkoutState & WorkoutActions;

const initialState: WorkoutState = {
  currentWorkout: null,
  currentWorkoutLog: null,
  setLogs: [],
  isLoading: false,
  isInProgress: false,
  error: null,
};

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  ...initialState,

  /**
   * Load workout details
   */
  loadWorkout: async (workoutId: string) => {
    set({ isLoading: true, error: null });

    try {
      const workout = await workoutApi.getWorkout(workoutId);
      set({
        currentWorkout: workout,
        isLoading: false,
        isInProgress: workout?.status === 'in_progress',
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load workout',
      });
    }
  },

  /**
   * Start a workout session
   */
  startWorkout: async (workoutId: string, userId: string) => {
    set({ isLoading: true, error: null });

    try {
      const workoutLog = await workoutApi.startWorkout(workoutId, userId);
      set({
        currentWorkoutLog: workoutLog,
        isInProgress: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to start workout',
      });
    }
  },

  /**
   * Log a set during workout
   */
  logSet: async (setData) => {
    const { currentWorkoutLog } = get();
    if (!currentWorkoutLog) return;

    try {
      const setLog = await workoutApi.logSet({
        ...setData,
        workout_log_id: currentWorkoutLog.id,
      });
      set((state) => ({
        setLogs: [...state.setLogs, setLog],
      }));
    } catch (error) {
      console.error('Failed to log set:', error);
    }
  },

  /**
   * Complete workout session
   */
  completeWorkout: async (completionData) => {
    const { currentWorkout, currentWorkoutLog } = get();
    if (!currentWorkout || !currentWorkoutLog) return;

    set({ isLoading: true });

    try {
      const workoutLog = await workoutApi.completeWorkout(
        currentWorkoutLog.id,
        currentWorkout.id,
        completionData
      );
      set({
        currentWorkoutLog: workoutLog,
        isInProgress: false,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to complete workout',
      });
    }
  },

  /**
   * Reset store state
   */
  reset: () => set(initialState),
}));

// Selector hooks
export const useCurrentWorkout = () => useWorkoutStore((s) => s.currentWorkout);
export const useCurrentWorkoutLog = () => useWorkoutStore((s) => s.currentWorkoutLog);
export const useSetLogs = () => useWorkoutStore((s) => s.setLogs);
export const useWorkoutLoading = () => useWorkoutStore((s) => s.isLoading);
export const useWorkoutInProgress = () => useWorkoutStore((s) => s.isInProgress);
export const useWorkoutError = () => useWorkoutStore((s) => s.error);

// Derived selectors
// Empty array constant to avoid creating new reference
const EMPTY_EXERCISE_BLOCKS: never[] = [];
export const useExerciseBlocks = () => {
  const blocks = useWorkoutStore((s) => s.currentWorkout?.exercise_blocks);
  return blocks ?? EMPTY_EXERCISE_BLOCKS;
};
export const useCompletedSetsCount = () => useWorkoutStore((s) => s.setLogs.length);
