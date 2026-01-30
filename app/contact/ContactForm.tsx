"use client";

import { useState, useRef, useCallback } from "react";
import Script from "next/script";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";
const HAS_CAPTCHA = !!RECAPTCHA_SITE_KEY;

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      getResponse: () => string;
      reset: (widgetId?: number) => void;
      render: (element: string | HTMLElement, options: { sitekey: string; theme?: "light" | "dark" }) => number;
    };
  }
}

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  const getRecaptchaResponse = useCallback((): Promise<string> => {
    if (!HAS_CAPTCHA || !window.grecaptcha) return Promise.resolve("");
    return new Promise((resolve) => {
      window.grecaptcha!.ready(() => {
        const token = window.grecaptcha!.getResponse();
        resolve(token || "");
      });
    });
  }, []);

  const resetRecaptcha = useCallback(() => {
    if (HAS_CAPTCHA && window.grecaptcha && widgetIdRef.current != null) {
      window.grecaptcha.reset(widgetIdRef.current);
    }
  }, []);

  const onRecaptchaLoad = useCallback(() => {
    if (!HAS_CAPTCHA || !recaptchaRef.current || !window.grecaptcha) return;
    try {
      widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
        sitekey: RECAPTCHA_SITE_KEY,
        theme: "dark",
      });
    } catch (e) {
      console.warn("reCAPTCHA render error:", e);
    }
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const max = 5;
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"];
    const valid: File[] = [];
    for (const f of selected) {
      if (valid.length >= max) break;
      if (f.size > maxSize) continue;
      const t = (f.type || "").toLowerCase();
      if (!allowed.includes(t) && !/^image\//.test(t)) continue;
      valid.push(f);
    }
    setFiles(valid);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in name, email, and message.");
      return;
    }
    if (HAS_CAPTCHA && !window.grecaptcha) {
      setError("Security check is loading. Please wait and try again.");
      return;
    }

    setLoading(true);
    try {
      const token = await getRecaptchaResponse();
      if (HAS_CAPTCHA && !token) {
        setError("Please complete the captcha verification.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.set("name", name.trim());
      formData.set("email", email.trim());
      formData.set("phone", phone.trim());
      formData.set("message", message.trim());
      formData.set("recaptchaToken", token);
      files.forEach((f) => formData.append("attachments", f));

      const res = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });
      const json = (await res.json()) as { error?: string; success?: boolean };

      if (!res.ok) {
        setError(json.error || "Something went wrong. Please try again.");
        resetRecaptcha();
        return;
      }

      setSubmittedEmail(email.trim());
      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setFiles([]);
      resetRecaptcha();
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      resetRecaptcha();
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-xl border border-white/20 bg-white/5 p-8 text-center">
        <h2 className="text-xl font-semibold text-accent mb-2">Message sent</h2>
        <p className="text-text mb-6">
          Thanks for reaching out. We&apos;ll get back to you at <strong>{submittedEmail}</strong> as soon as we can.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="px-4 py-2 rounded-lg bg-accent text-black hover:bg-accent-dark font-medium transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <>
      {HAS_CAPTCHA && (
        <Script
          src="https://www.google.com/recaptcha/api.js?render=explicit"
          strategy="lazyOnload"
          onLoad={() => {
            if (window.grecaptcha) window.grecaptcha.ready(onRecaptchaLoad);
          }}
        />
      )}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
        {error && (
          <div className="rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text mb-1">
            Name <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-text placeholder-white/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
            Email <span className="text-accent">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-text placeholder-white/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-text mb-1">
            Phone number
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-text placeholder-white/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="(555) 123-4567"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-text mb-1">
            Message <span className="text-accent">*</span>
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
            className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-text placeholder-white/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-y"
            placeholder="How can we help?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1">
            File attachment <span className="text-white/50">(optional, images or PDF, max 5MB each, up to 5 files)</span>
          </label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,image/*,application/pdf"
            multiple
            onChange={onFileChange}
            className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-text file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-accent file:text-black file:font-medium file:cursor-pointer"
          />
          {files.length > 0 && (
            <p className="mt-2 text-sm text-white/70">
              {files.length} file(s) selected: {files.map((f) => f.name).join(", ")}
            </p>
          )}
        </div>

        {HAS_CAPTCHA && (
          <div>
            <label className="block text-sm font-medium text-text mb-2">Security verification</label>
            <div ref={recaptchaRef} className="flex justify-start" />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-8 py-3 rounded-lg bg-accent text-black font-semibold hover:bg-accent-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Sending…" : "Submit"}
        </button>
      </form>
    </>
  );
}
