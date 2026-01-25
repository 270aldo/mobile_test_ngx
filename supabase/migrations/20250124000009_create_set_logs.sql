-- Migration: Create set_logs table
-- Individual set records within a workout log

CREATE TABLE public.set_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_log_id UUID REFERENCES public.workout_logs(id) ON DELETE CASCADE,
  exercise_block_id UUID REFERENCES public.exercise_blocks(id),

  set_number INTEGER NOT NULL,
  reps_completed INTEGER,
  weight_kg NUMERIC,

  -- Performance
  rpe INTEGER CHECK (rpe BETWEEN 1 AND 10),
  completed BOOLEAN DEFAULT TRUE,
  notes TEXT,

  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.set_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own set logs"
  ON public.set_logs FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.workout_logs
    WHERE workout_logs.id = set_logs.workout_log_id
    AND workout_logs.user_id = auth.uid()
  ));

-- Indexes
CREATE INDEX set_logs_workout_log_id_idx ON public.set_logs(workout_log_id);
CREATE INDEX set_logs_exercise_block_id_idx ON public.set_logs(exercise_block_id);
