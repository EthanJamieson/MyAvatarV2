CREATE TABLE public.admin_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  session_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  ip_hash TEXT,
  user_agent_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

CREATE INDEX admin_sessions_active_idx
ON public.admin_sessions (username, expires_at)
WHERE revoked_at IS NULL;

CREATE TABLE public.admin_audit_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  username TEXT,
  session_id UUID REFERENCES public.admin_sessions(id) ON DELETE SET NULL,
  ip_hash TEXT,
  user_agent_hash TEXT,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_audit_events ENABLE ROW LEVEL SECURITY;

CREATE INDEX admin_audit_events_event_time_idx
ON public.admin_audit_events (event_type, created_at DESC);

CREATE INDEX admin_audit_events_username_time_idx
ON public.admin_audit_events (username, created_at DESC);

ALTER TABLE public.admin_otp_challenges
ADD COLUMN ip_hash TEXT,
ADD COLUMN user_agent_hash TEXT;
