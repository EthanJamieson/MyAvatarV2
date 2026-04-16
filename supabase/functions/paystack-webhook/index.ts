import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.2";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!PAYSTACK_SECRET_KEY) {
      throw new Error("PAYSTACK_SECRET_KEY is not configured");
    }

    // Verify Paystack signature
    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    if (!signature) {
      console.error("Missing Paystack signature header");
      return new Response("Missing signature", { status: 400 });
    }

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(PAYSTACK_SECRET_KEY),
      { name: "HMAC", hash: "SHA-512" },
      false,
      ["sign"]
    );
    const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
    const expectedSignature = Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (expectedSignature !== signature) {
      console.error("Invalid Paystack signature");
      return new Response("Invalid signature", { status: 401 });
    }

    const event = JSON.parse(body);
    console.log("Paystack webhook event:", event.event);

    if (event.event !== "charge.success") {
      // Acknowledge but ignore non-success events
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }

    const data = event.data;
    const amountInRands = data.amount / 100;
    const metadata = data.metadata || {};

    // Create Supabase client with service role for direct DB access
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error: upsertError } = await supabase.from("orders").upsert(
      {
        email: data.customer?.email || data.email || "unknown",
        customer_name: metadata.customer_name || null,
        product: metadata.product || "Unknown product",
        amount_in_rands: amountInRands,
        currency: data.currency || "ZAR",
        paystack_reference: data.reference,
        paystack_status: "success",
        paid_at: data.paid_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "paystack_reference" }
    );

    if (upsertError) {
      console.error("Failed to upsert order:", upsertError);
      return new Response(JSON.stringify({ error: "Database error" }), { status: 500 });
    }

    console.log("Order recorded for reference:", data.reference);
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err: unknown) {
    console.error("Webhook error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
});
