ALTER TABLE public.pricing_plans
ADD COLUMN features TEXT[] NOT NULL DEFAULT '{}'::text[];

UPDATE public.pricing_plans
SET features = ARRAY['1 video', '1080p resolution', 'Basic voice cloning', 'Email support']
WHERE plan_key = 'single-video';

UPDATE public.pricing_plans
SET features = ARRAY['10 videos', 'Up to 4K resolution', 'Advanced voice cloning', 'Custom backgrounds', 'Priority support']
WHERE plan_key = '10-pack';

UPDATE public.pricing_plans
SET features = ARRAY['25 videos', 'Up to 4K resolution', 'Advanced voice cloning', 'Custom backgrounds', 'Brand kit included', 'Priority support']
WHERE plan_key = '25-pack';

UPDATE public.pricing_plans
SET features = ARRAY['50 videos', 'Up to 4K resolution', 'Advanced voice cloning', 'Custom backgrounds', 'Brand kit included', 'Dedicated support']
WHERE plan_key = '50-pack';

UPDATE public.pricing_plans
SET features = ARRAY['Getting started guide', 'Voice upload basics', 'Your first avatar video', 'Email support']
WHERE plan_key = 'tutorial-beginner';

UPDATE public.pricing_plans
SET features = ARRAY['All Beginner content', 'Advanced voice techniques', 'Multi-scene workflows', 'Custom background mastery', 'Priority support']
WHERE plan_key = 'tutorial-creator-pro';

UPDATE public.pricing_plans
SET features = ARRAY['All Creator Pro content', 'API integration guide', 'Batch generation workflows', 'Brand consistency training', '1-on-1 onboarding call']
WHERE plan_key = 'tutorial-studio-master';
