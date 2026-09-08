import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

export type AdminBooking = Database["public"]["Tables"]["bookings"]["Row"] & {
  room: { name: string } | null;
};

// Uses the regular server client (NOT admin) — this runs in an authenticated
// staff context, so the RLS policy "Staff can view all bookings" from Part 1
// (auth.role() = 'authenticated') is what actually authorizes this read.
// Using the admin client here would bypass RLS unnecessarily — better to
// let the database enforce staff-only access itself.
export async function getAllBookings(
  statusFilter?: Database["public"]["Enums"]["booking_status"]
): Promise<AdminBooking[]> {
  const supabase = await createClient();

  let query = supabase
    .from("bookings")
    .select("*, room:rooms(name)")
    .order("created_at", { ascending: false });

  if (statusFilter) {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch bookings: ${error.message}`);
  }

  return data ?? [];
}

// Quick counts for the dashboard overview cards.
export async function getBookingStats() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("bookings").select("status");

  if (error) {
    throw new Error(`Failed to fetch booking stats: ${error.message}`);
  }

  const counts = { pending: 0, confirmed: 0, cancelled: 0, completed: 0, no_show: 0 };
  for (const row of data ?? []) {
    counts[row.status as keyof typeof counts]++;
  }
  return counts;
}