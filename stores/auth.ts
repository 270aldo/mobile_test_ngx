import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { User, Session, Subscription } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isHydrated: boolean;
  _authSubscription: Subscription | null;
}

export type ProfileUpdate = {
  goal?: 'muscle' | 'fat_loss' | 'performance' | 'longevity' | 'hybrid';
  experience_level?: 'beginner' | 'intermediate' | 'advanced';
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height_cm?: number;
  weight_kg?: number;
  activity_level?: 'sedentary' | 'light' | 'moderate' | 'active';
  limitations?: string[];
  training_days_per_week?: number;
  session_duration_minutes?: number;
  equipment_access?: 'home' | 'gym' | 'both';
  onboarding_completed?: boolean;
};

export type UserMetadataUpdate = {
  nutrition_preference?: string;
  sleep_schedule?: string;
};

interface AuthActions {
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  hydrate: () => Promise<void>;
  setSession: (session: Session | null) => void;
  completeOnboarding: (
    updates?: ProfileUpdate,
    metadata?: UserMetadataUpdate
  ) => Promise<{ error: Error | null }>;
}

type AuthStore = AuthState & AuthActions;

/**
 * Auth store using Zustand
 *
 * IMPORTANT: Always use selectors to access state to prevent unnecessary re-renders
 *
 * @example
 * // ✅ Correct - uses selector
 * const isLoading = useAuthStore((s) => s.isLoading);
 *
 * // ❌ Wrong - causes re-renders on every state change
 * const { isLoading } = useAuthStore();
 */
export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  session: null,
  isLoading: false,
  isHydrated: false,
  _authSubscription: null,

  /**
   * Sign in with email and password
   */
  signIn: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        set({ isLoading: false });
        return { error };
      }

      set({
        user: data.user,
        session: data.session,
        isLoading: false,
      });

      return { error: null };
    } catch (error) {
      set({ isLoading: false });
      return { error: error as Error };
    }
  },

  /**
   * Sign up with email and password
   * Optionally creates a profile with full name
   */
  signUp: async (email: string, password: string, fullName?: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            onboarding_completed: false,
          },
        },
      });

      if (error) {
        set({ isLoading: false });
        return { error };
      }

      set({
        user: data.user,
        session: data.session,
        isLoading: false,
      });

      return { error: null };
    } catch (error) {
      set({ isLoading: false });
      return { error: error as Error };
    }
  },

  /**
   * Sign out and clear session
   */
  signOut: async () => {
    set({ isLoading: true });
    try {
      // Unsubscribe auth listener
      const sub = get()._authSubscription;
      if (sub) sub.unsubscribe();

      await supabase.auth.signOut();

      // Reset all dependent stores to prevent data leaks
      const { useProfileStore } = await import('./profile');
      const { useSeasonStore } = await import('./season');
      const { useChatStore } = await import('./chat');
      const { useWorkoutStore } = await import('./workout');
      const { useProgressStore } = await import('./progress');

      useProfileStore.getState().reset();
      useSeasonStore.getState().reset();
      useChatStore.getState().reset();
      useWorkoutStore.getState().reset();
      useProgressStore.getState().reset();

      set({
        user: null,
        session: null,
        isLoading: false,
        _authSubscription: null,
      });
    } catch (error) {
      console.error('Sign out error:', error);
      set({ isLoading: false });
    }
  },

  /**
   * Hydrate auth state from SecureStore on app launch
   * Must be called before rendering protected routes
   */
  hydrate: async () => {
    try {
      // Clean up existing subscription to prevent duplicates
      const existing = get()._authSubscription;
      if (existing) {
        existing.unsubscribe();
      }

      const { data: { session } } = await supabase.auth.getSession();

      // Set up auth state change listener and store reference
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        set({
          user: session?.user ?? null,
          session,
        });
      });

      set({
        user: session?.user ?? null,
        session,
        isHydrated: true,
        _authSubscription: subscription,
      });
    } catch (error) {
      console.error('Hydration error:', error);
      set({ isHydrated: true });
    }
  },

  /**
   * Manually set session (used by auth state change listener)
   */
  setSession: (session: Session | null) => {
    set({
      user: session?.user ?? null,
      session,
    });
  },

  /**
   * Mark onboarding as completed in Supabase user metadata
   */
  completeOnboarding: async (updates = {}, metadata = {}) => {
    set({ isLoading: true });
    try {
      const userId = get().user?.id;
      if (!userId) {
        const error = new Error('No authenticated user.');
        set({ isLoading: false });
        return { error };
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ ...updates, onboarding_completed: true })
        .eq('id', userId);

      if (profileError) {
        set({ isLoading: false });
        return { error: profileError };
      }

      const { data, error } = await supabase.auth.updateUser({
        data: { onboarding_completed: true, ...metadata },
      });

      if (error) {
        set({ isLoading: false });
        return { error };
      }

      set({
        user: data.user ?? null,
        session: get().session,
        isLoading: false,
      });

      return { error: null };
    } catch (error) {
      set({ isLoading: false });
      return { error: error as Error };
    }
  },
}));

/**
 * Selector hooks for common auth state
 * Use these for better performance
 */
export const useUser = () => useAuthStore((s) => s.user);
export const useSession = () => useAuthStore((s) => s.session);
export const useIsAuthenticated = () => useAuthStore((s) => !!s.session);
export const useIsHydrated = () => useAuthStore((s) => s.isHydrated);
export const useAuthLoading = () => useAuthStore((s) => s.isLoading);
