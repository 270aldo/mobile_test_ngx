-- Migration: Create workouts table
-- Individual training sessions within a season

CREATE TABLE public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID REFERENCES public.seasons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Scheduling
  week_number INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 12),
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7), -- 1=Monday
  scheduled_date DATE,

  -- Workout details
  title TEXT NOT NULL, -- "Upper Body Power", "Lower Hypertrophy"
  type TEXT CHECK (type IN ('strength', 'hypertrophy', 'power', 'conditioning', 'recovery', 'mobility')),
  focus_muscles TEXT[],

  estimated_duration_minutes INTEGER,
  difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 10),

  -- Status
  status TEXT CHECK (status IN ('scheduled', 'in_progress', 'completed', 'skipped')) DEFAULT 'scheduled',

  -- Coach modifications
  coach_modified BOOLEAN DEFAULT FALSE,
  coach_notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workouts"
  ON public.workouts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own workouts"
  ON public.workouts FOR UPDATE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER workouts_updated_at
  BEFORE UPDATE ON public.workouts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Indexes
CREATE INDEX workouts_user_id_idx ON public.workouts(user_id);
CREATE INDEX workouts_season_id_idx ON public.workouts(season_id);
CREATE INDEX workouts_scheduled_date_idx ON public.workouts(scheduled_date);
