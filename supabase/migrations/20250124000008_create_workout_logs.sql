-- Migration: Create workout_logs table
-- Records of completed workout sessions

CREATE TABLE public.workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID REFERENCES public.workouts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Timing
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  duration_minutes INTEGER,

  -- Subjective metrics
  perceived_effort INTEGER CHECK (perceived_effort BETWEEN 1 AND 10), -- RPE
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
  mood_before INTEGER CHECK (mood_before BETWEEN 1 AND 5),
  mood_after INTEGER CHECK (mood_after BETWEEN 1 AND 5),

  -- Notes
  notes TEXT,
  pain_points TEXT[],

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own logs"
  ON public.workout_logs FOR ALL
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX workout_logs_user_id_idx ON public.workout_logs(user_id);
CREATE INDEX workout_logs_workout_id_idx ON public.workout_logs(workout_id);
CREATE INDEX workout_logs_started_at_idx ON public.workout_logs(started_at);
