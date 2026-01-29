-- Migration: Create mindfulness_sessions table + extend streaks

-- 1. Extend streaks to support 'mindfulness' type
ALTER TABLE public.streaks
  DROP CONSTRAINT IF EXISTS streaks_streak_type_check;

ALTER TABLE public.streaks
  ADD CONSTRAINT streaks_streak_type_check
  CHECK (streak_type IN ('workout', 'checkin', 'hydration', 'mindfulness'));

-- 2. Create mindfulness_sessions table
CREATE TABLE public.mindfulness_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  session_id TEXT NOT NULL,
  session_title TEXT NOT NULL,
  category TEXT,

  date DATE NOT NULL,
  duration_seconds INTEGER NOT NULL,
  target_duration_seconds INTEGER,
  completed BOOLEAN DEFAULT FALSE,

  -- Engagement data
  phases_completed INTEGER,
  total_phases INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.mindfulness_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own mindfulness_sessions"
  ON public.mindfulness_sessions FOR ALL
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX mindfulness_sessions_user_id_idx ON public.mindfulness_sessions(user_id);
CREATE INDEX mindfulness_sessions_date_idx ON public.mindfulness_sessions(date);
CREATE INDEX mindfulness_sessions_user_date_idx ON public.mindfulness_sessions(user_id, date);

-- Trigger for updated_at
CREATE TRIGGER mindfulness_sessions_updated_at
  BEFORE UPDATE ON public.mindfulness_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
