import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_FROM = process.env.CONTACT_FROM ?? "Custom Business Hats <onboarding@resend.dev>";
const CONTACT_TO = "sales@meanmuleapparel.com";
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file
const MAX_FILES = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"];

async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!RECAPTCHA_SECRET) {
    console.warn("RECAPTCHA_SECRET_KEY not set; skipping verification");
    return true;
  }
  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${RECAPTCHA_SECRET}&response=${encodeURIComponent(token)}`,
  });
  const data = (await res.json()) as { success?: boolean };
  return !!data.success;
}

export async function POST(request: NextRequest) {
  try {
    if (!RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Contact form is not configured. Missing RESEND_API_KEY." },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const phone = (formData.get("phone") as string)?.trim() || "(not provided)";
    const message = (formData.get("message") as string)?.trim();
    const recaptchaToken = (formData.get("recaptchaToken") as string)?.trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!validEmail) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (RECAPTCHA_SECRET && !recaptchaToken) {
      return NextResponse.json(
        { error: "Please complete the captcha verification." },
        { status: 400 }
      );
    }

    const verified = await verifyRecaptcha(recaptchaToken || "");
    if (!verified) {
      return NextResponse.json(
        { error: "Captcha verification failed. Please try again." },
        { status: 400 }
      );
    }

    const attachments: { filename: string; content: Buffer }[] = [];
    const files = formData.getAll("attachments") as File[];
    for (const file of files) {
      if (!file?.size) continue;
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File "${file.name}" is too large. Maximum 5MB per file.` },
          { status: 400 }
        );
      }
      const type = (file.type || "").toLowerCase();
      const allowed = ALLOWED_TYPES.includes(type) || /^image\//.test(type);
      if (!allowed) {
        return NextResponse.json(
          { error: `File type not allowed: ${file.name}. Use images (JPEG, PNG, GIF, WebP) or PDF.` },
          { status: 400 }
        );
      }
      const buf = Buffer.from(await file.arrayBuffer());
      attachments.push({ filename: file.name, content: buf });
    }
    if (attachments.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_FILES} files allowed.` },
        { status: 400 }
      );
    }

    const resend = new Resend(RESEND_API_KEY);
    const html = `
      <h2>Contact form submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Message:</strong></p>
      <pre style="white-space:pre-wrap;font-family:inherit;">${escapeHtml(message)}</pre>
      ${attachments.length ? `<p><strong>Attachments:</strong> ${attachments.map((a) => escapeHtml(a.filename)).join(", ")}</p>` : ""}
    `;

    const { data, error } = await resend.emails.send({
      from: CONTACT_FROM,
      to: [CONTACT_TO],
      replyTo: email,
      subject: `Contact form: ${name} – Custom Business Hats`,
      html,
      attachments: attachments.length ? attachments : undefined,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again or email us directly." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (e) {
    console.error("Contact API error:", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
