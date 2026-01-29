-- Migration: Create nutrition_targets table
-- Per-user macro targets (one active row per user)

CREATE TABLE public.nutrition_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  calories NUMERIC NOT NULL DEFAULT 2400,
  protein NUMERIC NOT NULL DEFAULT 180,
  carbs NUMERIC NOT NULL DEFAULT 250,
  fat NUMERIC NOT NULL DEFAULT 70,

  -- Metadata
  set_by TEXT CHECK (set_by IN ('user', 'coach', 'genesis')) DEFAULT 'user',
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id)
);

-- RLS Policies
ALTER TABLE public.nutrition_targets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own nutrition_targets"
  ON public.nutrition_targets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own nutrition_targets"
  ON public.nutrition_targets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nutrition_targets"
  ON public.nutrition_targets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Index
CREATE INDEX nutrition_targets_user_id_idx ON public.nutrition_targets(user_id);

-- Trigger for updated_at
CREATE TRIGGER nutrition_targets_updated_at
  BEFORE UPDATE ON public.nutrition_targets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
