import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.2";

const SENDGRID_API_URL = "https://api.sendgrid.com/v3/mail/send";
const FROM_EMAIL = "studio@myavatar.co.za";
const FROM_NAME = "MyAvatar Studio";

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

    const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
    const customerEmail = data.customer?.email || data.email;
    if (SENDGRID_API_KEY && customerEmail) {
      const customerName = metadata.customer_name || "there";
      const productName = metadata.product || "your selected package";
      const formattedAmount = `R${amountInRands.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      const reference = data.reference || "N/A";

      const emailPayload = {
        personalizations: [{ to: [{ email: customerEmail }] }],
        from: { email: FROM_EMAIL, name: FROM_NAME },
        subject: "Payment received - MyAvatar Studio",
        content: [
          {
            type: "text/html",
            value: `
              <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
                <h2 style="color:#0ea5e9;margin-bottom:12px;">Thank you for choosing MyAvatar Studio</h2>
                <p style="color:#333;line-height:1.6;">Hi ${customerName},</p>
                <p style="color:#333;line-height:1.6;">
                  We have received your payment and your order is now in our production queue.
                  Our team will be in touch shortly with the next steps.
                </p>
                <div style="margin:20px 0;padding:14px;background:#f8fafc;border-radius:8px;border:1px solid #e5e7eb;">
                  <p style="margin:0 0 8px;color:#111;font-weight:bold;">Payment details</p>
                  <p style="margin:0;color:#333;">Product: ${productName}</p>
                  <p style="margin:6px 0 0;color:#333;">Amount: ${formattedAmount}</p>
                  <p style="margin:6px 0 0;color:#333;">Reference: ${reference}</p>
                </div>
                <p style="color:#333;line-height:1.6;">Regards,<br/><strong>The MyAvatar Studio Team</strong></p>
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
        body: JSON.stringify(emailPayload),
      });

      if (!emailRes.ok) {
        const errText = await emailRes.text();
        console.error("Failed to send payment confirmation email:", errText);
      }
    } else {
      console.warn("Skipping customer payment email: missing SENDGRID_API_KEY or customer email");
    }

    console.log("Order recorded for reference:", data.reference);
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err: unknown) {
    console.error("Webhook error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
});
