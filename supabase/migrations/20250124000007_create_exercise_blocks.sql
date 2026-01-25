-- Migration: Create exercise_blocks table
-- Individual exercises within a workout

CREATE TABLE public.exercise_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID REFERENCES public.workouts(id) ON DELETE CASCADE,

  order_index INTEGER NOT NULL,
  block_type TEXT CHECK (block_type IN ('warmup', 'main', 'accessory', 'finisher', 'cooldown')),

  -- Exercise details
  exercise_name TEXT NOT NULL,
  exercise_id TEXT, -- Reference to exercise library

  -- Prescription
  sets INTEGER,
  reps TEXT, -- "8-12", "AMRAP", "30s"
  weight_prescription TEXT, -- "RPE 8", "70% 1RM", "bodyweight"
  rest_seconds INTEGER,
  tempo TEXT, -- "3-1-2-0"

  -- Notes
  notes TEXT,
  coaching_cues TEXT[],
  video_url TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.exercise_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own exercises"
  ON public.exercise_blocks FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.workouts
    WHERE workouts.id = exercise_blocks.workout_id
    AND workouts.user_id = auth.uid()
  ));

-- Indexes
CREATE INDEX exercise_blocks_workout_id_idx ON public.exercise_blocks(workout_id);
