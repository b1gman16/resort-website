"use client";

import { useState, useTransition } from "react";
import { contactFormSchema } from "@/lib/validations/booking";
import { submitContactForm } from "./actions";
import { siteConfig } from "@/config/site";
import { MapEmbed } from "@/components/contact/map-embed";

export default function ContactPage() {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  function handleSubmit(formData: FormData) {
    setError(null);
    setFieldErrors({});

    const raw = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    const parsed = contactFormSchema.safeParse(raw);
    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    startTransition(async () => {
      const result = await submitContactForm(parsed.data);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setSubmitted(true);
    });
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold text-slate-900 mb-2">Contact Us</h1>
      <p className="text-slate-600 mb-8">
        Questions before you book? Reach out — we usually reply within a day.
      </p>

      {submitted ? (
        <div className="bg-green-50 text-green-700 rounded-lg p-6 text-center">
          <p className="font-medium">Message sent.</p>
          <p className="text-sm mt-1">We'll get back to you at the email you provided.</p>
        </div>
      ) : (
        <form action={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>
          )}

          <div>
            <label className="text-sm text-slate-700 block mb-1">Name</label>
            <input name="name" required className="w-full border rounded px-3 py-2 text-sm" />
            {fieldErrors.name && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.name[0]}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-slate-700 block mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full border rounded px-3 py-2 text-sm"
            />
            {fieldErrors.email && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.email[0]}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-slate-700 block mb-1">Message</label>
            <textarea
              name="message"
              rows={5}
              required
              className="w-full border rounded px-3 py-2 text-sm"
            />
            {fieldErrors.message && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.message[0]}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-slate-900 text-white rounded py-2.5 text-sm font-medium disabled:opacity-50"
          >
            {isPending ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}

      <div className="mt-10 pt-6 border-t text-sm text-slate-500 space-y-1">
        <p>Or reach us directly:</p>
        <p>{siteConfig.contact.email}</p>
        <p>{siteConfig.contact.phone}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-medium text-slate-700 mb-2">Find us</h2>
        <MapEmbed address={siteConfig.contact.address} />
      </div>
    </div>
  );
}