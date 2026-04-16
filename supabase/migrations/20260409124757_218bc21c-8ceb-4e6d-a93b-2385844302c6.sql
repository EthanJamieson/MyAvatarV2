
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  customer_name TEXT,
  product TEXT NOT NULL,
  amount_in_rands NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'ZAR',
  paystack_reference TEXT UNIQUE NOT NULL,
  paystack_status TEXT NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- No public access policies - only service role can access this table
