import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const encoder = new TextEncoder();

const hashText = async (value: string): Promise<string> => {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const toBase64Url = (value: string): string =>
  btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");

const signToken = async (payload: Record<string, unknown>, secret: string) => {
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(encodedPayload));
  const signature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  return `${encodedPayload}.${signature}`;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const OTP_HASH_SECRET = Deno.env.get("OTP_HASH_SECRET");
    const ADMIN_TOKEN_SECRET = Deno.env.get("ADMIN_TOKEN_SECRET");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!OTP_HASH_SECRET || !ADMIN_TOKEN_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return json({ error: "Admin verification function is not configured" }, 500);
    }

    const body = await req.json();
    const username = typeof body?.username === "string" ? body.username.trim() : "";
    const code = typeof body?.code === "string" ? body.code.trim() : "";
    if (!username || !/^\d{6}$/.test(code)) return json({ error: "Valid username and 6-digit code are required" }, 400);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const nowIso = new Date().toISOString();

    const { data: challenge, error: challengeError } = await supabase
      .from("admin_otp_challenges")
      .select("id, otp_hash, expires_at, attempts, consumed_at")
      .eq("username", username)
      .is("consumed_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (challengeError || !challenge) return json({ error: "No active verification challenge found" }, 401);
    if (challenge.expires_at < nowIso) return json({ error: "Verification code has expired" }, 401);
    if (challenge.attempts >= 5) return json({ error: "Too many invalid attempts" }, 429);

    const suppliedHash = await hashText(`${code}:${OTP_HASH_SECRET}`);
    if (suppliedHash !== challenge.otp_hash) {
      await supabase
        .from("admin_otp_challenges")
        .update({ attempts: challenge.attempts + 1 })
        .eq("id", challenge.id);
      return json({ error: "Invalid verification code" }, 401);
    }

    await supabase
      .from("admin_otp_challenges")
      .update({ consumed_at: nowIso, attempts: challenge.attempts + 1 })
      .eq("id", challenge.id);

    const expiresAtMs = Date.now() + 60 * 60 * 1000;
    const token = await signToken(
      { sub: username, exp: Math.floor(expiresAtMs / 1000), iat: Math.floor(Date.now() / 1000) },
      ADMIN_TOKEN_SECRET,
    );

    return json({ token, expiresAt: new Date(expiresAtMs).toISOString() });
  } catch (err) {
    console.error("admin-login-verify error:", err);
    return json({ error: "Unexpected error" }, 500);
  }
});
