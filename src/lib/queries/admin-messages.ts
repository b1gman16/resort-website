import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

export type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"];

// Regular server client, not admin — same reasoning as getAllBookings in
// Part 3: this runs in an authenticated staff context, so RLS itself
// ("Staff can view contact messages") is what authorizes the read. No
// reason to bypass it with the admin client when the policy already
// grants exactly the access needed.
export async function getContactMessages(): Promise<ContactMessage[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch contact messages: ${error.message}`);
  }

  return data ?? [];
}

// Small helper for a dashboard badge/count — kept separate from the full
// fetch above so the dashboard overview page doesn't need to pull every
// message's full text just to show a number.
export async function getUnreadMessageCount(): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("contact_messages")
    .select("*", { count: "exact", head: true })
    .is("read_at", null);

  if (error) {
    throw new Error(`Failed to count unread messages: ${error.message}`);
  }

  return count ?? 0;
}