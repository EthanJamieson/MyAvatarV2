CREATE TABLE public.pricing_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_key TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('video', 'tutorial')),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  amount_in_rands NUMERIC(10,2) NOT NULL CHECK (amount_in_rands >= 0),
  discount_percent NUMERIC(5,2),
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT discount_percent_valid CHECK (
    discount_percent IS NULL OR (discount_percent >= 0 AND discount_percent < 100)
  )
);

ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active pricing plans"
ON public.pricing_plans
FOR SELECT
TO anon, authenticated
USING (is_active = true);

INSERT INTO public.pricing_plans (
  plan_key, category, name, description, amount_in_rands, discount_percent, is_active, sort_order
)
VALUES
  ('single-video', 'video', 'Single Video', 'Perfect for trying the service', 500, NULL, true, 1),
  ('10-pack', 'video', '10-Pack', 'Great for consistent content', 4000, NULL, true, 2),
  ('25-pack', 'video', '25-Pack', 'Best balance of value and scale', 8750, NULL, true, 3),
  ('50-pack', 'video', '50-Pack', 'Ideal for high-volume production', 15000, NULL, true, 4),
  ('tutorial-beginner', 'tutorial', 'Beginner', 'Lead magnet / volume play', 2500, NULL, true, 10),
  ('tutorial-creator-pro', 'tutorial', 'Creator Pro', 'Most Popular', 4000, NULL, true, 11),
  ('tutorial-studio-master', 'tutorial', 'Studio Master', 'Full mastery', 8000, NULL, true, 12);

CREATE TABLE public.admin_otp_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  otp_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_otp_challenges ENABLE ROW LEVEL SECURITY;

CREATE INDEX admin_otp_challenges_username_created_at_idx
ON public.admin_otp_challenges (username, created_at DESC);
