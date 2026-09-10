"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { contactFormSchema, type ContactFormInput } from "@/lib/validations/booking";

export type ContactResult = { success: true } | { success: false; error: string };

export async function submitContactForm(input: ContactFormInput): Promise<ContactResult> {
  const parsed = contactFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Please check the form for errors." };
  }

  // Admin client, same reasoning as bookings: no public insert policy,
  // this server-side action is the only sanctioned way in.
  const supabase = createAdminClient();

  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
  });

  if (error) {
    console.error("Contact form submission failed:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  return { success: true };
}