-- Migration: Create food_logs table
-- Daily food intake entries, one row per food item per meal

CREATE TABLE public.food_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  date DATE NOT NULL,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snacks')) NOT NULL,

  name TEXT NOT NULL,
  calories NUMERIC NOT NULL DEFAULT 0,
  protein NUMERIC NOT NULL DEFAULT 0,
  carbs NUMERIC NOT NULL DEFAULT 0,
  fat NUMERIC NOT NULL DEFAULT 0,

  -- Optional metadata
  serving_size TEXT,
  source TEXT CHECK (source IS NULL OR source IN ('manual', 'barcode', 'camera', 'search')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own food_logs"
  ON public.food_logs FOR ALL
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX food_logs_user_id_idx ON public.food_logs(user_id);
CREATE INDEX food_logs_date_idx ON public.food_logs(date);
CREATE INDEX food_logs_user_date_idx ON public.food_logs(user_id, date);

-- Trigger for updated_at
CREATE TRIGGER food_logs_updated_at
  BEFORE UPDATE ON public.food_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
