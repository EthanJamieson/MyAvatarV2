const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SENDGRID_API_URL = "https://api.sendgrid.com/v3/mail/send";
const FROM_EMAIL = "studio@myavatar.co.za";
const FROM_NAME = "MyAvatar Studio";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
    if (!SENDGRID_API_KEY) {
      throw new Error("SENDGRID_API_KEY is not configured");
    }

    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validate inputs
    if (!name || typeof name !== "string" || name.trim().length === 0 || name.length > 100) {
      return new Response(JSON.stringify({ error: "Invalid name" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!subject || typeof subject !== "string" || subject.length > 200) {
      return new Response(JSON.stringify({ error: "Invalid subject" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!message || typeof message !== "string" || message.trim().length === 0 || message.length > 1000) {
      return new Response(JSON.stringify({ error: "Invalid message" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sanitize = (str: string) =>
      str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

    const safeName = sanitize(name.trim());
    const safeEmail = sanitize(email.trim());
    const safeSubject = sanitize(subject.trim());
    const safeMessage = sanitize(message.trim());

    // 1. Send notification to studio
    const notificationPayload = {
      personalizations: [{ to: [{ email: FROM_EMAIL }] }],
      from: { email: FROM_EMAIL, name: FROM_NAME },
      reply_to: { email: email.trim(), name: name.trim() },
      subject: `New Contact: ${safeSubject}`,
      content: [
        {
          type: "text/html",
          value: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
              <h2 style="color:#0ea5e9;margin-bottom:20px;">New Contact Form Submission</h2>
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:8px 12px;font-weight:bold;color:#333;border-bottom:1px solid #eee;">Name</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${safeName}</td></tr>
                <tr><td style="padding:8px 12px;font-weight:bold;color:#333;border-bottom:1px solid #eee;">Email</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${safeEmail}</td></tr>
                <tr><td style="padding:8px 12px;font-weight:bold;color:#333;border-bottom:1px solid #eee;">Subject</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${safeSubject}</td></tr>
              </table>
              <div style="margin-top:20px;padding:16px;background:#f8fafc;border-radius:8px;">
                <p style="margin:0;color:#333;white-space:pre-wrap;">${safeMessage}</p>
              </div>
            </div>
          `,
        },
      ],
    };

    // 2. Send confirmation to the customer
    const confirmationPayload = {
      personalizations: [{ to: [{ email: email.trim() }] }],
      from: { email: FROM_EMAIL, name: FROM_NAME },
      subject: "Thanks for reaching out – MyAvatar Studio",
      content: [
        {
          type: "text/html",
          value: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
              <h2 style="color:#0ea5e9;">Hi ${safeName},</h2>
              <p style="color:#333;line-height:1.6;">Thank you for contacting MyAvatar Studio! We've received your message and will get back to you within 24 hours.</p>
              <div style="margin:20px 0;padding:16px;background:#f0f9ff;border-left:4px solid #0ea5e9;border-radius:4px;">
                <p style="margin:0 0 4px;font-weight:bold;color:#333;">Your message:</p>
                <p style="margin:0;color:#555;white-space:pre-wrap;">${safeMessage}</p>
              </div>
              <p style="color:#333;line-height:1.6;">Best regards,<br/><strong>The MyAvatar Studio Team</strong></p>
              <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
              <p style="color:#999;font-size:12px;">This is an automated response. Please do not reply to this email.</p>
            </div>
          `,
        },
      ],
    };

    // Send both emails
    const [notifRes, confirmRes] = await Promise.all([
      fetch(SENDGRID_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notificationPayload),
      }),
      fetch(SENDGRID_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(confirmationPayload),
      }),
    ]);

    if (!notifRes.ok || !confirmRes.ok) {
      const errText = !notifRes.ok ? await notifRes.text() : await confirmRes.text();
      console.error("SendGrid error:", errText);
      throw new Error("Failed to send email");
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-contact-email error:", err);
    return new Response(JSON.stringify({ error: "Failed to send email" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
