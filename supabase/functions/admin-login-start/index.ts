import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SENDGRID_API_URL = "https://api.sendgrid.com/v3/mail/send";
const FROM_EMAIL = "studio@myavatar.co.za";
const FROM_NAME = "MyAvatar Studio";

const encoder = new TextEncoder();

const hashText = async (value: string): Promise<string> => {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
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
    const ADMIN_USERNAME = Deno.env.get("ADMIN_USERNAME");
    const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD");
    const OTP_HASH_SECRET = Deno.env.get("OTP_HASH_SECRET");
    const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !OTP_HASH_SECRET || !SENDGRID_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return json({ error: "Admin auth function is not configured" }, 500);
    }

    const body = await req.json();
    const username = typeof body?.username === "string" ? body.username.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!username || !password) return json({ error: "Username and password are required" }, 400);
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) return json({ error: "Invalid credentials" }, 401);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();

    const { count, error: countError } = await supabase
      .from("admin_otp_challenges")
      .select("id", { count: "exact", head: true })
      .eq("username", username)
      .gte("created_at", fifteenMinutesAgo);

    if (countError) return json({ error: "Failed to prepare login challenge" }, 500);
    if ((count ?? 0) >= 5) return json({ error: "Too many attempts, please wait 15 minutes" }, 429);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await hashText(`${otp}:${OTP_HASH_SECRET}`);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error: insertError } = await supabase.from("admin_otp_challenges").insert({
      username,
      otp_hash: otpHash,
      expires_at: expiresAt,
    });
    if (insertError) return json({ error: "Failed to create verification challenge" }, 500);

    const payload = {
      personalizations: [{ to: [{ email: FROM_EMAIL }] }],
      from: { email: FROM_EMAIL, name: FROM_NAME },
      subject: "MyAvatar Admin login verification code",
      content: [
        {
          type: "text/html",
          value: `
            <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:20px;">
              <h2 style="margin:0 0 12px;color:#0ea5e9;">Admin Login Verification</h2>
              <p style="margin:0 0 12px;color:#333;">Use this 6-digit code to continue admin login:</p>
              <div style="font-size:32px;font-weight:bold;letter-spacing:6px;color:#111;padding:12px 16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;display:inline-block;">
                ${otp}
              </div>
              <p style="margin:14px 0 0;color:#666;">Code expires in 10 minutes.</p>
            </div>
          `,
        },
      ],
    };

    const emailRes = await fetch(SENDGRID_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!emailRes.ok) {
      const message = await emailRes.text();
      console.error("SendGrid OTP error:", message);
      return json({ error: "Failed to send verification code" }, 500);
    }

    return json({ success: true, message: "Verification code sent" });
  } catch (err) {
    console.error("admin-login-start error:", err);
    return json({ error: "Unexpected error" }, 500);
  }
});
