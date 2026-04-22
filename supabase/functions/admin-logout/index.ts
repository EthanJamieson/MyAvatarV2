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

const hashText = async (value: string): Promise<string> => {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const parseCookies = (cookieHeader: string | null) => {
  const parsed: Record<string, string> = {};
  if (!cookieHeader) return parsed;
  cookieHeader.split(";").forEach((part) => {
    const [name, ...rest] = part.split("=");
    if (!name || rest.length === 0) return;
    parsed[name.trim()] = rest.join("=").trim();
  });
  return parsed;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: buildCorsHeaders(req) });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, req);

  try {
    const OTP_HASH_SECRET = Deno.env.get("OTP_HASH_SECRET");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!OTP_HASH_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return json({ error: "Admin logout function is not configured" }, 500, req);
    }

    const cookies = parseCookies(req.headers.get("cookie"));
    const secret = cookies[SESSION_COOKIE];
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    if (secret) {
      const sessionHash = await hashText(`${secret}:${OTP_HASH_SECRET}`);
      await supabase
        .from("admin_sessions")
        .update({ revoked_at: new Date().toISOString() })
        .eq("session_hash", sessionHash)
        .is("revoked_at", null);
    }

    return json(
      { success: true },
      200,
      req,
      {
        "Set-Cookie": `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=None; Partitioned; Max-Age=0`,
      },
    );
  } catch (err) {
    console.error("admin-logout error:", err);
    return json({ error: "Unexpected error" }, 500, req);
  }
});
