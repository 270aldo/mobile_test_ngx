-- Migration: Create subscriptions table
-- Tracks user subscription plans and Stripe integration

CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  plan TEXT NOT NULL CHECK (plan IN ('ascend', 'hybrid_basic', 'hybrid_pro', 'hybrid_elite')),
  status TEXT NOT NULL CHECK (status IN ('active', 'paused', 'cancelled', 'past_due')) DEFAULT 'active',

  -- Pricing
  price_monthly NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',

  -- Stripe integration
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,

  -- Dates
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  trial_ends_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Index for faster lookups
CREATE INDEX subscriptions_user_id_idx ON public.subscriptions(user_id);
