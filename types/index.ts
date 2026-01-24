/**
 * NGX GENESIS Type Definitions
 */

import type { User, Session } from '@supabase/supabase-js';

// Re-export Supabase types
export type { User, Session };

// Auth types
export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isHydrated: boolean;
}

// User profile
export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

// Onboarding data
export interface OnboardingData {
  fitness_goal: 'lose_weight' | 'build_muscle' | 'improve_endurance' | 'general_fitness';
  experience_level: 'beginner' | 'intermediate' | 'advanced';
  workout_frequency: number; // days per week
  available_equipment: string[];
  injuries_limitations: string[];
  preferred_workout_time: 'morning' | 'afternoon' | 'evening' | 'flexible';
}

// Season (training phase)
export interface Season {
  id: string;
  user_id: string;
  name: string;
  start_date: string;
  end_date: string | null;
  goal: string;
  is_active: boolean;
  created_at: string;
}

// Workout types
export interface Workout {
  id: string;
  user_id: string;
  season_id: string;
  name: string;
  description: string | null;
  scheduled_date: string;
  completed_at: string | null;
  duration_minutes: number | null;
  exercises: WorkoutExercise[];
  notes: string | null;
  created_at: string;
}

export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  exercise_name: string;
  order_index: number;
  sets: ExerciseSet[];
}

export interface ExerciseSet {
  id: string;
  set_number: number;
  target_reps: number;
  actual_reps: number | null;
  target_weight: number | null;
  actual_weight: number | null;
  is_completed: boolean;
  rpe: number | null; // Rate of Perceived Exertion (1-10)
}

// Chat types
export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant' | 'coach';
  content: string;
  created_at: string;
}

// Progress types
export interface ProgressEntry {
  id: string;
  user_id: string;
  date: string;
  weight_kg: number | null;
  body_fat_percentage: number | null;
  notes: string | null;
  photos: string[];
  created_at: string;
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
