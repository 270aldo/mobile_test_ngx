-- Migration: Create checkins table
-- Daily and weekly check-ins with subjective metrics

CREATE TABLE public.checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  type TEXT CHECK (type IN ('daily', 'weekly')) NOT NULL,
  date DATE NOT NULL,

  -- Daily checkin data
  sleep_hours NUMERIC,
  sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 5),
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 5),
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
  soreness_level INTEGER CHECK (soreness_level BETWEEN 1 AND 5),
  hydration_liters NUMERIC,

  -- Weekly checkin additions
  weight_kg NUMERIC,
  body_measurements JSONB, -- {"chest": 100, "waist": 80, "hips": 95}
  progress_photos TEXT[], -- Storage URLs

  -- Free text
  notes TEXT,
  wins TEXT[],
  challenges TEXT[],

  -- GENESIS response
  genesis_feedback TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, type, date)
);

-- RLS Policies
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own checkins"
  ON public.checkins FOR ALL
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX checkins_user_id_idx ON public.checkins(user_id);
CREATE INDEX checkins_date_idx ON public.checkins(date);
CREATE INDEX checkins_type_idx ON public.checkins(type);
