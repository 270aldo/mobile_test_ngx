-- Migration: Create coach_notes table
-- Highlighted coach notes displayed in UI

CREATE TABLE public.coach_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  coach_id UUID REFERENCES public.profiles(id),

  title TEXT NOT NULL,
  content TEXT NOT NULL,

  -- Display options
  priority TEXT CHECK (priority IN ('info', 'action', 'celebration')) DEFAULT 'info',
  display_location TEXT[] DEFAULT ARRAY['home'], -- 'home', 'workout', 'progress'

  -- CTA button
  cta_text TEXT, -- "Ver Plan", "Responder", "Ver Progreso"
  cta_action TEXT, -- 'open_chat', 'open_workout', 'open_progress', 'external_link'
  cta_payload TEXT, -- workout_id, url, etc.

  -- Visibility
  is_active BOOLEAN DEFAULT TRUE,
  show_until TIMESTAMPTZ,
  dismissed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.coach_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own coach notes"
  ON public.coach_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can dismiss own coach notes"
  ON public.coach_notes FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX coach_notes_user_id_idx ON public.coach_notes(user_id);
CREATE INDEX coach_notes_is_active_idx ON public.coach_notes(is_active);
