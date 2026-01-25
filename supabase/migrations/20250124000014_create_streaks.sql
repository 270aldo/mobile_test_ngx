-- Migration: Create streaks table
-- Consistency tracking for various activities

CREATE TABLE public.streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  streak_type TEXT CHECK (streak_type IN ('workout', 'checkin', 'hydration')) NOT NULL,

  current_count INTEGER DEFAULT 0,
  longest_count INTEGER DEFAULT 0,

  last_activity_date DATE,
  streak_started_at TIMESTAMPTZ,

  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, streak_type)
);

-- RLS Policies
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own streaks"
  ON public.streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks"
  ON public.streaks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streaks"
  ON public.streaks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Index
CREATE INDEX streaks_user_id_idx ON public.streaks(user_id);

-- Trigger for updated_at
CREATE TRIGGER streaks_updated_at
  BEFORE UPDATE ON public.streaks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
