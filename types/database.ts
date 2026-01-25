export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      badges: {
        Row: {
          badge_type: string
          description: string | null
          earned_at: string | null
          icon: string | null
          id: string
          title: string
          user_id: string | null
        }
        Insert: {
          badge_type: string
          description?: string | null
          earned_at?: string | null
          icon?: string | null
          id?: string
          title: string
          user_id?: string | null
        }
        Update: {
          badge_type?: string
          description?: string | null
          earned_at?: string | null
          icon?: string | null
          id?: string
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      checkins: {
        Row: {
          body_measurements: Json | null
          challenges: string[] | null
          created_at: string | null
          date: string
          energy_level: number | null
          genesis_feedback: string | null
          hydration_liters: number | null
          id: string
          notes: string | null
          progress_photos: string[] | null
          sleep_hours: number | null
          sleep_quality: number | null
          soreness_level: number | null
          stress_level: number | null
          type: string
          user_id: string | null
          weight_kg: number | null
          wins: string[] | null
        }
        Insert: {
          body_measurements?: Json | null
          challenges?: string[] | null
          created_at?: string | null
          date: string
          energy_level?: number | null
          genesis_feedback?: string | null
          hydration_liters?: number | null
          id?: string
          notes?: string | null
          progress_photos?: string[] | null
          sleep_hours?: number | null
          sleep_quality?: number | null
          soreness_level?: number | null
          stress_level?: number | null
          type: string
          user_id?: string | null
          weight_kg?: number | null
          wins?: string[] | null
        }
        Update: {
          body_measurements?: Json | null
          challenges?: string[] | null
          created_at?: string | null
          date?: string
          energy_level?: number | null
          genesis_feedback?: string | null
          hydration_liters?: number | null
          id?: string
          notes?: string | null
          progress_photos?: string[] | null
          sleep_hours?: number | null
          sleep_quality?: number | null
          soreness_level?: number | null
          stress_level?: number | null
          type?: string
          user_id?: string | null
          weight_kg?: number | null
          wins?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "checkins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_assignments: {
        Row: {
          assigned_at: string | null
          coach_bio: string | null
          coach_id: string | null
          coach_specialty: string[] | null
          ended_at: string | null
          id: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          coach_bio?: string | null
          coach_id?: string | null
          coach_specialty?: string[] | null
          ended_at?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          coach_bio?: string | null
          coach_id?: string | null
          coach_specialty?: string[] | null
          ended_at?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coach_assignments_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coach_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_notes: {
        Row: {
          coach_id: string | null
          content: string
          created_at: string | null
          cta_action: string | null
          cta_payload: string | null
          cta_text: string | null
          dismissed_at: string | null
          display_location: string[] | null
          id: string
          is_active: boolean | null
          priority: string | null
          show_until: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          coach_id?: string | null
          content: string
          created_at?: string | null
          cta_action?: string | null
          cta_payload?: string | null
          cta_text?: string | null
          dismissed_at?: string | null
          display_location?: string[] | null
          id?: string
          is_active?: boolean | null
          priority?: string | null
          show_until?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          coach_id?: string | null
          content?: string
          created_at?: string | null
          cta_action?: string | null
          cta_payload?: string | null
          cta_text?: string | null
          dismissed_at?: string | null
          display_location?: string[] | null
          id?: string
          is_active?: boolean | null
          priority?: string | null
          show_until?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coach_notes_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coach_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_blocks: {
        Row: {
          block_type: string | null
          coaching_cues: string[] | null
          created_at: string | null
          exercise_id: string | null
          exercise_name: string
          id: string
          notes: string | null
          order_index: number
          reps: string | null
          rest_seconds: number | null
          sets: number | null
          tempo: string | null
          video_url: string | null
          weight_prescription: string | null
          workout_id: string | null
        }
        Insert: {
          block_type?: string | null
          coaching_cues?: string[] | null
          created_at?: string | null
          exercise_id?: string | null
          exercise_name: string
          id?: string
          notes?: string | null
          order_index: number
          reps?: string | null
          rest_seconds?: number | null
          sets?: number | null
          tempo?: string | null
          video_url?: string | null
          weight_prescription?: string | null
          workout_id?: string | null
        }
        Update: {
          block_type?: string | null
          coaching_cues?: string[] | null
          created_at?: string | null
          exercise_id?: string | null
          exercise_name?: string
          id?: string
          notes?: string | null
          order_index?: number
          reps?: string | null
          rest_seconds?: number | null
          sets?: number | null
          tempo?: string | null
          video_url?: string | null
          weight_prescription?: string | null
          workout_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_blocks_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachments: Json | null
          coach_note_expires_at: string | null
          coach_note_priority: string | null
          content: string
          created_at: string | null
          id: string
          is_coach_note: boolean | null
          message_type: string | null
          read_at: string | null
          role: string
          user_id: string | null
        }
        Insert: {
          attachments?: Json | null
          coach_note_expires_at?: string | null
          coach_note_priority?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_coach_note?: boolean | null
          message_type?: string | null
          read_at?: string | null
          role: string
          user_id?: string | null
        }
        Update: {
          attachments?: Json | null
          coach_note_expires_at?: string | null
          coach_note_priority?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_coach_note?: boolean | null
          message_type?: string | null
          read_at?: string | null
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          available_equipment: string[] | null
          avatar_url: string | null
          birth_date: string | null
          body_fat_percentage: number | null
          created_at: string | null
          email: string
          fitness_level: string | null
          full_name: string | null
          gender: string | null
          height_cm: number | null
          id: string
          injuries_limitations: string | null
          notification_preferences: Json | null
          onboarding_completed: boolean | null
          onboarding_step: number | null
          phone: string | null
          preferred_language: string | null
          primary_goal: string | null
          secondary_goals: string[] | null
          session_duration_minutes: number | null
          timezone: string | null
          training_days_per_week: number | null
          updated_at: string | null
          weight_kg: number | null
        }
        Insert: {
          available_equipment?: string[] | null
          avatar_url?: string | null
          birth_date?: string | null
          body_fat_percentage?: number | null
          created_at?: string | null
          email: string
          fitness_level?: string | null
          full_name?: string | null
          gender?: string | null
          height_cm?: number | null
          id: string
          injuries_limitations?: string | null
          notification_preferences?: Json | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          phone?: string | null
          preferred_language?: string | null
          primary_goal?: string | null
          secondary_goals?: string[] | null
          session_duration_minutes?: number | null
          timezone?: string | null
          training_days_per_week?: number | null
          updated_at?: string | null
          weight_kg?: number | null
        }
        Update: {
          available_equipment?: string[] | null
          avatar_url?: string | null
          birth_date?: string | null
          body_fat_percentage?: number | null
          created_at?: string | null
          email?: string
          fitness_level?: string | null
          full_name?: string | null
          gender?: string | null
          height_cm?: number | null
          id?: string
          injuries_limitations?: string | null
          notification_preferences?: Json | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          phone?: string | null
          preferred_language?: string | null
          primary_goal?: string | null
          secondary_goals?: string[] | null
          session_duration_minutes?: number | null
          timezone?: string | null
          training_days_per_week?: number | null
          updated_at?: string | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      seasons: {
        Row: {
          actual_end_date: string | null
          created_at: string | null
          current_phase: string | null
          current_week: number | null
          focus_areas: string[] | null
          generated_plan: Json | null
          goal: string
          id: string
          name: string
          number: number
          start_date: string
          status: string | null
          target_end_date: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          actual_end_date?: string | null
          created_at?: string | null
          current_phase?: string | null
          current_week?: number | null
          focus_areas?: string[] | null
          generated_plan?: Json | null
          goal: string
          id?: string
          name: string
          number: number
          start_date: string
          status?: string | null
          target_end_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          actual_end_date?: string | null
          created_at?: string | null
          current_phase?: string | null
          current_week?: number | null
          focus_areas?: string[] | null
          generated_plan?: Json | null
          goal?: string
          id?: string
          name?: string
          number?: number
          start_date?: string
          status?: string | null
          target_end_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seasons_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      set_logs: {
        Row: {
          completed: boolean | null
          exercise_block_id: string | null
          id: string
          logged_at: string | null
          notes: string | null
          reps_completed: number | null
          rpe: number | null
          set_number: number
          weight_kg: number | null
          workout_log_id: string | null
        }
        Insert: {
          completed?: boolean | null
          exercise_block_id?: string | null
          id?: string
          logged_at?: string | null
          notes?: string | null
          reps_completed?: number | null
          rpe?: number | null
          set_number: number
          weight_kg?: number | null
          workout_log_id?: string | null
        }
        Update: {
          completed?: boolean | null
          exercise_block_id?: string | null
          id?: string
          logged_at?: string | null
          notes?: string | null
          reps_completed?: number | null
          rpe?: number | null
          set_number?: number
          weight_kg?: number | null
          workout_log_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "set_logs_exercise_block_id_fkey"
            columns: ["exercise_block_id"]
            isOneToOne: false
            referencedRelation: "exercise_blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "set_logs_workout_log_id_fkey"
            columns: ["workout_log_id"]
            isOneToOne: false
            referencedRelation: "workout_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      streaks: {
        Row: {
          current_count: number | null
          id: string
          last_activity_date: string | null
          longest_count: number | null
          streak_started_at: string | null
          streak_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          current_count?: number | null
          id?: string
          last_activity_date?: string | null
          longest_count?: number | null
          streak_started_at?: string | null
          streak_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          current_count?: number | null
          id?: string
          last_activity_date?: string | null
          longest_count?: number | null
          streak_started_at?: string | null
          streak_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "streaks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancelled_at: string | null
          created_at: string | null
          currency: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan: string
          price_monthly: number
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_ends_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cancelled_at?: string | null
          created_at?: string | null
          currency?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan: string
          price_monthly: number
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cancelled_at?: string | null
          created_at?: string | null
          currency?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: string
          price_monthly?: number
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_logs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          duration_minutes: number | null
          energy_level: number | null
          id: string
          mood_after: number | null
          mood_before: number | null
          notes: string | null
          pain_points: string[] | null
          perceived_effort: number | null
          started_at: string
          user_id: string | null
          workout_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          energy_level?: number | null
          id?: string
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          pain_points?: string[] | null
          perceived_effort?: number | null
          started_at: string
          user_id?: string | null
          workout_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          energy_level?: number | null
          id?: string
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          pain_points?: string[] | null
          perceived_effort?: number | null
          started_at?: string
          user_id?: string | null
          workout_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_logs_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workouts: {
        Row: {
          coach_modified: boolean | null
          coach_notes: string | null
          created_at: string | null
          day_of_week: number
          difficulty: number | null
          estimated_duration_minutes: number | null
          focus_muscles: string[] | null
          id: string
          scheduled_date: string | null
          season_id: string | null
          status: string | null
          title: string
          type: string | null
          updated_at: string | null
          user_id: string | null
          week_number: number
        }
        Insert: {
          coach_modified?: boolean | null
          coach_notes?: string | null
          created_at?: string | null
          day_of_week: number
          difficulty?: number | null
          estimated_duration_minutes?: number | null
          focus_muscles?: string[] | null
          id?: string
          scheduled_date?: string | null
          season_id?: string | null
          status?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
          week_number: number
        }
        Update: {
          coach_modified?: boolean | null
          coach_notes?: string | null
          created_at?: string | null
          day_of_week?: number
          difficulty?: number | null
          estimated_duration_minutes?: number | null
          focus_muscles?: string[] | null
          id?: string
          scheduled_date?: string | null
          season_id?: string | null
          status?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "workouts_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workouts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
