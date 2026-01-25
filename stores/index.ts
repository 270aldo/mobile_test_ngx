/**
 * Stores Index
 *
 * Re-exports all Zustand stores and their selector hooks
 */

// Auth store
export {
  useAuthStore,
  useUser,
  useSession,
  useIsAuthenticated,
  useIsHydrated,
  useAuthLoading,
} from './auth';

// Profile store
export {
  useProfileStore,
  useProfile,
  useSubscription,
  useProfileLoading,
  useProfileError,
  useIsHybridPlan,
  useOnboardingCompleted,
} from './profile';

// Season store
export {
  useSeasonStore,
  useActiveSeason,
  useTodayWorkout,
  useWeekWorkouts,
  useSeasonLoading,
  useSeasonError,
  useCurrentWeek,
  useCurrentPhase,
  useHasTodayWorkout,
} from './season';

// Workout store
export {
  useWorkoutStore,
  useCurrentWorkout,
  useCurrentWorkoutLog,
  useSetLogs,
  useWorkoutLoading,
  useWorkoutInProgress,
  useWorkoutError,
  useExerciseBlocks,
  useCompletedSetsCount,
} from './workout';

// Chat store
export {
  useChatStore,
  useMessages,
  useUnreadCount,
  useChatLoading,
  useChatSending,
  useChatError,
  useLastMessage,
  useHasUnread,
} from './chat';

// Progress store
export {
  useProgressStore,
  useTodayCheckin,
  useWeeklyCheckin,
  useStreaks,
  useBadges,
  useCoachNotes,
  useWeightHistory,
  useProgressLoading,
  useProgressError,
  useWorkoutStreak,
  useCheckinStreak,
  useHasTodayCheckin,
  useActiveCoachNote,
} from './progress';
