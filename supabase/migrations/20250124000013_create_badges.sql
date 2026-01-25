-- Migration: Create badges table
-- Gamification achievements

CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  badge_type TEXT NOT NULL, -- 'first_workout', 'week_streak_4', 'season_complete', etc.
  earned_at TIMESTAMPTZ DEFAULT NOW(),

  -- Badge metadata
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- emoji or icon name

  UNIQUE(user_id, badge_type)
);

-- RLS Policies
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own badges"
  ON public.badges FOR SELECT
  USING (auth.uid() = user_id);

-- Index
CREATE INDEX badges_user_id_idx ON public.badges(user_id);
