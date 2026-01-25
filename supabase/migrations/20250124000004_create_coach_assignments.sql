-- Migration: Create coach_assignments table
-- Links HYBRID plan users to their assigned coaches

CREATE TABLE public.coach_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  coach_id UUID REFERENCES public.profiles(id),

  status TEXT CHECK (status IN ('active', 'paused', 'ended')) DEFAULT 'active',
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,

  -- Coach info visible to user
  coach_bio TEXT,
  coach_specialty TEXT[],

  UNIQUE(user_id, coach_id)
);

-- RLS Policies
ALTER TABLE public.coach_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own coach"
  ON public.coach_assignments FOR SELECT
  USING (auth.uid() = user_id);

-- Index for faster lookups
CREATE INDEX coach_assignments_user_id_idx ON public.coach_assignments(user_id);
CREATE INDEX coach_assignments_coach_id_idx ON public.coach_assignments(coach_id);
