import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, PUT, OPTIONS",
};

const encoder = new TextEncoder();
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

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const fromBase64Url = (value: string): string => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
  return atob(padded);
};

const verifyToken = async (authorization: string | null, secret: string) => {
  if (!authorization?.startsWith("Bearer ")) return null;
  const token = authorization.slice("Bearer ".length).trim();
  const [payloadPart, signaturePart] = token.split(".");
  if (!payloadPart || !signaturePart) return null;

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadPart));
  const expectedSignature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  if (expectedSignature !== signaturePart) return null;

  const payload = JSON.parse(fromBase64Url(payloadPart));
  if (!payload?.exp || Math.floor(Date.now() / 1000) >= payload.exp) return null;
  return payload;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const ADMIN_TOKEN_SECRET = Deno.env.get("ADMIN_TOKEN_SECRET");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!ADMIN_TOKEN_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return json({ error: "Admin pricing function is not configured" }, 500);
    }

    const tokenPayload = await verifyToken(req.headers.get("Authorization"), ADMIN_TOKEN_SECRET);
    if (!tokenPayload) return json({ error: "Unauthorized" }, 401);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = req.method === "POST" || req.method === "PUT" ? await req.json().catch(() => ({})) : {};
    const action = typeof body?.action === "string" ? body.action : null;
    const listRequested = req.method === "GET" || action === "list";
    const updateRequested = req.method === "PUT" || action === "update";
    const createRequested = action === "create";

    if (listRequested) {
      const { data, error } = await supabase
        .from("pricing_plans")
        .select("id, plan_key, category, name, description, amount_in_rands, discount_percent, features, is_active, sort_order, created_at, updated_at")
        .order("sort_order", { ascending: true });

      if (error) return json({ error: "Failed to load pricing plans" }, 500);
      return json({ plans: data ?? [] });
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
          return json({ error: "Discount percent must be between 0 and less than 100" }, 400);
        }
        discountPercent = parsedDiscount;
      }

      if (!id || !name || !description || !Number.isFinite(amountInRands) || amountInRands < 0) {
        return json({ error: "Invalid plan input" }, 400);
      }

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

      if (error) return json({ error: "Failed to update plan" }, 500);
      return json({ plan: data });
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
          return json({ error: "Discount percent must be between 0 and less than 100" }, 400);
        }
        discountPercent = parsedDiscount;
      }

      if (!category || !name || !description || !Number.isFinite(amountInRands) || amountInRands < 0) {
        return json({ error: "Invalid plan input" }, 400);
      }

      const baseKey = slugify(name);
      if (!baseKey) return json({ error: "Plan name is invalid" }, 400);

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
          return json({ error: "Failed to create plan" }, 500);
        }
      }

      if (!insertedPlan) return json({ error: `Could not create unique plan key from '${planKey}'` }, 500);
      return json({ plan: insertedPlan });
    }

    return json({ error: "Method not allowed" }, 405);
  } catch (err) {
    console.error("admin-pricing error:", err);
    return json({ error: "Unexpected error" }, 500);
  }
});
