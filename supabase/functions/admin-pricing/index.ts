import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.2";

const encoder = new TextEncoder();
const SESSION_COOKIE = "myavatar_admin_session";
const SENDGRID_API_URL = "https://api.sendgrid.com/v3/mail/send";
const FROM_EMAIL = "studio@myavatar.co.za";
const FROM_NAME = "MyAvatar Studio";

const buildCorsHeaders = (req: Request) => {
  const configuredOrigin = Deno.env.get("ADMIN_ALLOWED_ORIGIN")?.trim();
  const reqOrigin = req.headers.get("origin") || "";
  const allowOrigin = configuredOrigin || reqOrigin || "*";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, GET, PUT, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
    "Vary": "Origin",
  };
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
const parseFeatures = (raw: unknown): string[] => {
  if (Array.isArray(raw)) {
    return raw
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter((item) => item.length > 0);
  }
  if (typeof raw === "string") {
    return raw
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }
  return [];
};

const json = (body: unknown, status = 200, req?: Request) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...buildCorsHeaders(req ?? new Request("https://example.com")),
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
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

const readIp = (req: Request) =>
  req.headers.get("cf-connecting-ip") ||
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  "unknown";

const sendPricingChangeEmail = async ({
  sendGridApiKey,
  action,
  username,
  category,
  name,
  changes,
}: {
  sendGridApiKey: string;
  action: "created" | "updated";
  username: string;
  category: string;
  name: string;
  changes: string[];
}) => {
  const changeRows = changes.length
    ? changes.map((change) => `<li style="margin:0 0 8px;color:#333;">${change}</li>`).join("")
    : "<li style='margin:0 0 8px;color:#333;'>No detailed field diff provided.</li>";

  const payload = {
    personalizations: [{ to: [{ email: FROM_EMAIL }] }],
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject: `Pricing plan ${action}: ${name}`,
    content: [
      {
        type: "text/html",
        value: `
          <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;padding:20px;">
            <h2 style="margin:0 0 12px;color:#0ea5e9;">Pricing Plan ${action === "created" ? "Created" : "Updated"}</h2>
            <p style="margin:0 0 8px;color:#333;"><strong>Admin:</strong> ${username}</p>
            <p style="margin:0 0 8px;color:#333;"><strong>Plan:</strong> ${name}</p>
            <p style="margin:0 0 14px;color:#333;"><strong>Category:</strong> ${category}</p>
            <div style="padding:14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
              <p style="margin:0 0 10px;color:#111;font-weight:bold;">Changes</p>
              <ul style="margin:0;padding-left:20px;">
                ${changeRows}
              </ul>
            </div>
          </div>
        `,
      },
    ],
  };

  const response = await fetch(SENDGRID_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sendGridApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to send pricing change email");
  }
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: buildCorsHeaders(req) });

  try {
    const OTP_HASH_SECRET = Deno.env.get("OTP_HASH_SECRET");
    const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!OTP_HASH_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return json({ error: "Admin pricing function is not configured" }, 500, req);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const ipHash = await hashText(`${readIp(req)}:${OTP_HASH_SECRET}`);
    const userAgentHash = await hashText(`${req.headers.get("user-agent") || "unknown"}:${OTP_HASH_SECRET}`);
    const cookies = parseCookies(req.headers.get("cookie"));
    const sessionSecret = cookies[SESSION_COOKIE];
    if (!sessionSecret) return json({ error: "Unauthorized" }, 401, req);

    const sessionHash = await hashText(`${sessionSecret}:${OTP_HASH_SECRET}`);
    const { data: session } = await supabase
      .from("admin_sessions")
      .select("id, username, expires_at, revoked_at, ip_hash, user_agent_hash, last_seen_at")
      .eq("session_hash", sessionHash)
      .maybeSingle();
    if (!session) return json({ error: "Unauthorized" }, 401, req);
    if (session.revoked_at || session.expires_at < new Date().toISOString()) return json({ error: "Session expired" }, 401, req);
    if (session.ip_hash && session.ip_hash !== ipHash) return json({ error: "Unauthorized session context" }, 401, req);
    if (session.user_agent_hash && session.user_agent_hash !== userAgentHash) return json({ error: "Unauthorized session context" }, 401, req);

    const lastSeenMs = new Date(session.last_seen_at).getTime();
    if (!Number.isNaN(lastSeenMs) && Date.now() - lastSeenMs > 5 * 60 * 1000) {
      await supabase.from("admin_sessions").update({ last_seen_at: new Date().toISOString() }).eq("id", session.id);
    }

    const body = req.method === "POST" || req.method === "PUT" ? await req.json().catch(() => ({})) : {};
    const action = typeof body?.action === "string" ? body.action : null;
    const listRequested = req.method === "GET" || action === "list";
    const updateRequested = req.method === "PUT" || action === "update";
    const createRequested = action === "create";
    const sessionRequested = action === "session";

    if (sessionRequested) {
      return json({ authenticated: true, username: session.username, expiresAt: session.expires_at }, 200, req);
    }

    if (listRequested) {
      const { data, error } = await supabase
        .from("pricing_plans")
        .select("id, plan_key, category, name, description, amount_in_rands, discount_percent, features, is_active, sort_order, created_at, updated_at")
        .order("sort_order", { ascending: true });

      if (error) return json({ error: "Failed to load pricing plans" }, 500, req);
      return json({ plans: data ?? [] }, 200, req);
    }

    if (updateRequested) {
      const id = typeof body?.id === "string" ? body.id : "";
      const name = typeof body?.name === "string" ? body.name.trim() : "";
      const description = typeof body?.description === "string" ? body.description.trim() : "";
      const amountInRands = Number(body?.amountInRands);
      const discountPercentRaw = body?.discountPercent;
      const isActive = Boolean(body?.isActive);
      const features = parseFeatures(body?.features);

      let discountPercent: number | null = null;
      if (discountPercentRaw !== null && discountPercentRaw !== undefined && discountPercentRaw !== "") {
        const parsedDiscount = Number(discountPercentRaw);
        if (!Number.isFinite(parsedDiscount) || parsedDiscount < 0 || parsedDiscount >= 100) {
          return json({ error: "Discount percent must be between 0 and less than 100" }, 400, req);
        }
        discountPercent = parsedDiscount;
      }

      if (!id || !name || !description || !Number.isFinite(amountInRands) || amountInRands < 0) {
        return json({ error: "Invalid plan input" }, 400, req);
      }

      const { data: existingPlan } = await supabase
        .from("pricing_plans")
        .select("name, category, description, amount_in_rands, discount_percent, is_active, features")
        .eq("id", id)
        .maybeSingle();

      const { data, error } = await supabase
        .from("pricing_plans")
        .update({
          name,
          description,
          amount_in_rands: amountInRands,
          discount_percent: discountPercent && discountPercent > 0 ? discountPercent : null,
          features,
          is_active: isActive,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select("id, plan_key, category, name, description, amount_in_rands, discount_percent, features, is_active, sort_order, created_at, updated_at")
        .single();

      if (error) return json({ error: "Failed to update plan" }, 500, req);

      const changes: string[] = [];
      if (existingPlan) {
        if (existingPlan.name !== data.name) changes.push(`name: '${existingPlan.name}' -> '${data.name}'`);
        if (existingPlan.description !== data.description) changes.push("description changed");
        if (Number(existingPlan.amount_in_rands) !== Number(data.amount_in_rands)) changes.push(`amount_in_rands: ${existingPlan.amount_in_rands} -> ${data.amount_in_rands}`);
        if (Number(existingPlan.discount_percent ?? 0) !== Number(data.discount_percent ?? 0)) changes.push(`discount_percent: ${existingPlan.discount_percent ?? 0} -> ${data.discount_percent ?? 0}`);
        if (existingPlan.is_active !== data.is_active) changes.push(`is_active: ${existingPlan.is_active} -> ${data.is_active}`);
        if (JSON.stringify(existingPlan.features ?? []) !== JSON.stringify(data.features ?? [])) changes.push("features updated");
      }

      await supabase.from("admin_audit_events").insert({
        event_type: "plan_updated",
        username: session.username,
        session_id: session.id,
        ip_hash: ipHash,
        user_agent_hash: userAgentHash,
        details: { plan_id: data.id, changes },
      });

      if (SENDGRID_API_KEY) {
        try {
          await sendPricingChangeEmail({
            sendGridApiKey: SENDGRID_API_KEY,
            action: "updated",
            username: session.username,
            category: data.category,
            name: data.name,
            changes,
          });
        } catch (emailErr) {
          await supabase.from("admin_audit_events").insert({
            event_type: "plan_email_failed",
            username: session.username,
            session_id: session.id,
            ip_hash: ipHash,
            user_agent_hash: userAgentHash,
            details: { action: "update", plan_id: data.id, error: String(emailErr) },
          });
        }
      }

      return json({ plan: data }, 200, req);
    }

    if (createRequested) {
      const category = body?.category === "video" || body?.category === "tutorial" ? body.category : "";
      const name = typeof body?.name === "string" ? body.name.trim() : "";
      const description = typeof body?.description === "string" ? body.description.trim() : "";
      const amountInRands = Number(body?.amountInRands);
      const discountPercentRaw = body?.discountPercent;
      const isActive = body?.isActive === false ? false : true;
      const features = parseFeatures(body?.features);

      let discountPercent: number | null = null;
      if (discountPercentRaw !== null && discountPercentRaw !== undefined && discountPercentRaw !== "") {
        const parsedDiscount = Number(discountPercentRaw);
        if (!Number.isFinite(parsedDiscount) || parsedDiscount < 0 || parsedDiscount >= 100) {
          return json({ error: "Discount percent must be between 0 and less than 100" }, 400, req);
        }
        discountPercent = parsedDiscount;
      }

      if (!category || !name || !description || !Number.isFinite(amountInRands) || amountInRands < 0) {
        return json({ error: "Invalid plan input" }, 400, req);
      }

      const baseKey = slugify(name);
      if (!baseKey) return json({ error: "Plan name is invalid" }, 400, req);

      const { data: maxOrderData } = await supabase
        .from("pricing_plans")
        .select("sort_order")
        .eq("category", category)
        .order("sort_order", { ascending: false })
        .limit(1)
        .maybeSingle();

      const nextSortOrder = (maxOrderData?.sort_order ?? (category === "video" ? 0 : 100)) + 1;

      let planKey = baseKey;
      let insertedPlan: Record<string, unknown> | null = null;
      for (let suffix = 0; suffix < 25; suffix += 1) {
        const candidate = suffix === 0 ? baseKey : `${baseKey}-${suffix + 1}`;
        const { data, error } = await supabase
          .from("pricing_plans")
          .insert({
            plan_key: candidate,
            category,
            name,
            description,
            amount_in_rands: amountInRands,
            discount_percent: discountPercent && discountPercent > 0 ? discountPercent : null,
            features,
            is_active: isActive,
            sort_order: nextSortOrder,
            updated_at: new Date().toISOString(),
          })
          .select("id, plan_key, category, name, description, amount_in_rands, discount_percent, features, is_active, sort_order, created_at, updated_at")
          .single();

        if (!error) {
          planKey = candidate;
          insertedPlan = data;
          break;
        }

        if (!String(error.message).toLowerCase().includes("duplicate key")) {
          return json({ error: "Failed to create plan" }, 500, req);
        }
      }

      if (!insertedPlan) return json({ error: `Could not create unique plan key from '${planKey}'` }, 500, req);

      const createdPlan = insertedPlan as {
        id: string;
        name: string;
        category: string;
        amount_in_rands: number;
        discount_percent: number | null;
        is_active: boolean;
        features: string[];
      };

      await supabase.from("admin_audit_events").insert({
        event_type: "plan_created",
        username: session.username,
        session_id: session.id,
        ip_hash: ipHash,
        user_agent_hash: userAgentHash,
        details: { plan_id: createdPlan.id },
      });

      if (SENDGRID_API_KEY) {
        try {
          await sendPricingChangeEmail({
            sendGridApiKey: SENDGRID_API_KEY,
            action: "created",
            username: session.username,
            category: createdPlan.category,
            name: createdPlan.name,
            changes: [
              `amount_in_rands: ${createdPlan.amount_in_rands}`,
              `discount_percent: ${createdPlan.discount_percent ?? 0}`,
              `is_active: ${createdPlan.is_active}`,
              `features_count: ${createdPlan.features?.length ?? 0}`,
            ],
          });
        } catch (emailErr) {
          await supabase.from("admin_audit_events").insert({
            event_type: "plan_email_failed",
            username: session.username,
            session_id: session.id,
            ip_hash: ipHash,
            user_agent_hash: userAgentHash,
            details: { action: "create", plan_id: createdPlan.id, error: String(emailErr) },
          });
        }
      }

      return json({ plan: insertedPlan }, 200, req);
    }

    return json({ error: "Method not allowed" }, 405, req);
  } catch (err) {
    console.error("admin-pricing error:", err);
    return json({ error: "Unexpected error" }, 500, req);
  }
});
