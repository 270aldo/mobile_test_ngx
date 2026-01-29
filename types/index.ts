/**
 * NGX GENESIS Type Definitions
 *
 * Primary types are generated from Supabase schema in database.ts
 * This file re-exports those types and defines additional app-specific types
 */

import type { User, Session } from '@supabase/supabase-js';
import type { Tables } from './database';

// Re-export Supabase auth types
export type { User, Session };

// Re-export all database types
export type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
  Json,
} from './database';

// Convenience type aliases for table rows
// These use the generated types from Supabase
export type Profile = Tables<'profiles'>;
export type Subscription = Tables<'subscriptions'>;
export type CoachAssignment = Tables<'coach_assignments'>;
export type Season = Tables<'seasons'>;
export type Workout = Tables<'workouts'>;
export type ExerciseBlock = Tables<'exercise_blocks'>;
export type WorkoutLog = Tables<'workout_logs'>;
export type SetLog = Tables<'set_logs'>;
export type Checkin = Tables<'checkins'>;
export type Message = Tables<'messages'>;
export type CoachNote = Tables<'coach_notes'>;
export type Badge = Tables<'badges'>;
export type Streak = Tables<'streaks'>;
export type FoodLog = Tables<'food_logs'>;
export type NutritionTarget = Tables<'nutrition_targets'>;
export type MindfulnessSession = Tables<'mindfulness_sessions'>;

// Extended types with relationships
export type WorkoutWithExercises = Workout & {
  exercise_blocks: ExerciseBlock[];
};

export type WorkoutWithLogs = Workout & {
  exercise_blocks: ExerciseBlock[];
  workout_logs: WorkoutLog[];
};

export type SeasonWithWorkouts = Season & {
  workouts: WorkoutWithExercises[];
};

// Auth state type
export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isHydrated: boolean;
}

// Onboarding data collected during registration
export interface OnboardingData {
  fitness_goal: 'fat_loss' | 'muscle_gain' | 'performance' | 'longevity' | 'general_health';
  experience_level: 'beginner' | 'intermediate' | 'advanced';
  workout_frequency: number; // days per week
  available_equipment: string[];
  injuries_limitations: string[];
  preferred_workout_time: 'morning' | 'afternoon' | 'evening' | 'flexible';
}

// Navigation types for expo-router
export type RootStackParamList = {
  '(auth)/login': undefined;
  '(auth)/register': undefined;
  '(tabs)': undefined;
  '(onboarding)': undefined;
};

export type TabParamList = {
  index: undefined;
  'train/index': undefined;
  'chat/index': undefined;
  'progress/index': undefined;
  'profile/index': undefined;
};

// Coach note priority type for UI display
export type CoachNotePriority = 'info' | 'action' | 'celebration';

// Streak type for consistency tracking
export type StreakType = 'workout' | 'checkin' | 'hydration' | 'mindfulness';

// Message role type
export type MessageRole = 'user' | 'genesis' | 'coach';

// Workout status type
export type WorkoutStatus = 'scheduled' | 'in_progress' | 'completed' | 'skipped';

// Season phase type
export type SeasonPhase = 'foundation' | 'construction' | 'optimization';

// Subscription plan type
export type SubscriptionPlan = 'ascend' | 'hybrid_basic' | 'hybrid_pro' | 'hybrid_elite';

// Subscription status type
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'past_due';
