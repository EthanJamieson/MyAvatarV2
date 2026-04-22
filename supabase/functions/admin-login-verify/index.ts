import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.2";

const encoder = new TextEncoder();
const SESSION_COOKIE = "myavatar_admin_session";

const buildCorsHeaders = (req: Request) => {
  const configuredOrigin = Deno.env.get("ADMIN_ALLOWED_ORIGIN")?.trim();
  const reqOrigin = req.headers.get("origin") || "";
  const allowOrigin = configuredOrigin || reqOrigin || "*";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
    "Vary": "Origin",
  };
};

const hashText = async (value: string): Promise<string> => {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const json = (body: unknown, status = 200, req?: Request, extraHeaders: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...buildCorsHeaders(req ?? new Request("https://example.com")),
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });

const readIp = (req: Request) =>
  req.headers.get("cf-connecting-ip") ||
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  "unknown";

const toBase64UrlBytes = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");

const createSessionSecret = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return toBase64UrlBytes(bytes);
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: buildCorsHeaders(req) });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, req);

  try {
    const OTP_HASH_SECRET = Deno.env.get("OTP_HASH_SECRET");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const SESSION_TTL_SECONDS = Number(Deno.env.get("ADMIN_SESSION_TTL_SECONDS") || "3600");

    if (!OTP_HASH_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return json({ error: "Admin verification function is not configured" }, 500, req);
    }

    const body = await req.json();
    const username = typeof body?.username === "string" ? body.username.trim() : "";
    const code = typeof body?.code === "string" ? body.code.trim() : "";
    if (!username || !/^\d{6}$/.test(code)) return json({ error: "Valid username and 6-digit code are required" }, 400, req);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const nowIso = new Date().toISOString();
    const ipHash = await hashText(`${readIp(req)}:${OTP_HASH_SECRET}`);
    const userAgentHash = await hashText(`${req.headers.get("user-agent") || "unknown"}:${OTP_HASH_SECRET}`);

    const { data: challenge, error: challengeError } = await supabase
      .from("admin_otp_challenges")
      .select("id, otp_hash, expires_at, attempts, consumed_at, ip_hash")
      .eq("username", username)
      .is("consumed_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (challengeError || !challenge) return json({ error: "No active verification challenge found" }, 401, req);
    if (challenge.expires_at < nowIso) return json({ error: "Verification code has expired" }, 401, req);
    if (challenge.attempts >= 5) return json({ error: "Too many invalid attempts" }, 429, req);
    if (challenge.ip_hash && challenge.ip_hash !== ipHash) return json({ error: "Verification context mismatch" }, 401, req);

    const suppliedHash = await hashText(`${code}:${OTP_HASH_SECRET}`);
    if (suppliedHash !== challenge.otp_hash) {
      await supabase
        .from("admin_otp_challenges")
        .update({ attempts: challenge.attempts + 1 })
        .eq("id", challenge.id);
      await supabase.from("admin_audit_events").insert({
        event_type: "login_failed",
        username,
        ip_hash: ipHash,
        user_agent_hash: userAgentHash,
        details: { stage: "otp" },
      });
      return json({ error: "Invalid verification code" }, 401, req);
    }

    await supabase
      .from("admin_otp_challenges")
      .update({ consumed_at: nowIso, attempts: challenge.attempts + 1 })
      .eq("id", challenge.id);

    const expiresAtMs = Date.now() + SESSION_TTL_SECONDS * 1000;
    const sessionSecret = createSessionSecret();
    const sessionHash = await hashText(`${sessionSecret}:${OTP_HASH_SECRET}`);

    await supabase
      .from("admin_sessions")
      .update({ revoked_at: nowIso })
      .eq("username", username)
      .is("revoked_at", null);

    const { data: sessionRow, error: sessionError } = await supabase
      .from("admin_sessions")
      .insert({
        username,
        session_hash: sessionHash,
        expires_at: new Date(expiresAtMs).toISOString(),
        ip_hash: ipHash,
        user_agent_hash: userAgentHash,
        last_seen_at: nowIso,
      })
      .select("id")
      .single();

    if (sessionError) return json({ error: "Failed to create admin session" }, 500, req);

    await supabase.from("admin_audit_events").insert({
      event_type: "login_success",
      username,
      session_id: sessionRow.id,
      ip_hash: ipHash,
      user_agent_hash: userAgentHash,
      details: { expiresAt: new Date(expiresAtMs).toISOString() },
    });

    const setCookie = `${SESSION_COOKIE}=${sessionSecret}; Path=/; HttpOnly; Secure; SameSite=None; Partitioned; Max-Age=${SESSION_TTL_SECONDS}`;

    return json(
      { success: true, expiresAt: new Date(expiresAtMs).toISOString() },
      200,
      req,
      { "Set-Cookie": setCookie },
    );
  } catch (err) {
    console.error("admin-login-verify error:", err);
    return json({ error: "Unexpected error" }, 500, req);
  }
});
