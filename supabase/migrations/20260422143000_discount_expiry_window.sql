ALTER TABLE public.pricing_plans
ADD COLUMN discount_mode TEXT NOT NULL DEFAULT 'always' CHECK (discount_mode IN ('always', 'expires')),
ADD COLUMN discount_expires_at TIMESTAMPTZ,
ADD COLUMN discount_duration_unit TEXT CHECK (discount_duration_unit IN ('hours', 'days')),
ADD COLUMN discount_duration_value INTEGER CHECK (discount_duration_value > 0);

ALTER TABLE public.pricing_plans
ADD CONSTRAINT pricing_plans_discount_mode_consistency CHECK (
  (discount_mode = 'always' AND discount_expires_at IS NULL AND discount_duration_unit IS NULL AND discount_duration_value IS NULL)
  OR
  (discount_mode = 'expires' AND discount_percent IS NOT NULL AND discount_percent > 0 AND discount_expires_at IS NOT NULL AND discount_duration_unit IS NOT NULL AND discount_duration_value IS NOT NULL)
);

UPDATE public.pricing_plans
SET
  discount_mode = 'always',
  discount_expires_at = NULL,
  discount_duration_unit = NULL,
  discount_duration_value = NULL
WHERE discount_mode IS DISTINCT FROM 'always';

CREATE OR REPLACE FUNCTION public.expire_discounts_now()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  affected_count INTEGER := 0;
BEGIN
  WITH expired AS (
    UPDATE public.pricing_plans
    SET
      discount_percent = NULL,
      discount_mode = 'always',
      discount_expires_at = NULL,
      discount_duration_unit = NULL,
      discount_duration_value = NULL,
      updated_at = now()
    WHERE discount_mode = 'expires'
      AND discount_expires_at IS NOT NULL
      AND discount_expires_at <= now()
      AND discount_percent IS NOT NULL
    RETURNING id, name, category
  )
  SELECT count(*) INTO affected_count FROM expired;

  RETURN affected_count;
END;
$$;

DO $$
DECLARE
  existing_job RECORD;
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    FOR existing_job IN
      SELECT jobid FROM cron.job WHERE jobname = 'expire_discounts_every_5m'
    LOOP
      PERFORM cron.unschedule(existing_job.jobid);
    END LOOP;

    PERFORM cron.schedule(
      'expire_discounts_every_5m',
      '*/5 * * * *',
      'SELECT public.expire_discounts_now();'
    );
  END IF;
END $$;
