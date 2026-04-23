import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const CRON_SECRET = Deno.env.get("EXPIRE_DISCOUNTS_CRON_SECRET");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return json({ error: "Function is not configured" }, 500);
    }

    const authHeader = req.headers.get("authorization");
    if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
      return json({ error: "Unauthorized" }, 401);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await supabase.rpc("expire_discounts_now");
    if (error) {
      console.error("expire_discounts_now rpc error:", error);
      return json({ error: "Failed to expire discounts" }, 500);
    }

    await supabase.from("admin_audit_events").insert({
      event_type: "discounts_expired_job_run",
      details: { expired_count: data ?? 0 },
    });

    return json({ success: true, expiredCount: data ?? 0 });
  } catch (err) {
    console.error("expire-discounts error:", err);
    return json({ error: "Unexpected error" }, 500);
  }
});
