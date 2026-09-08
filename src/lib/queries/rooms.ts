import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

// Re-exporting the generated row type keeps components from having to
// reach into Database["public"]["Tables"]["rooms"]["Row"] directly.
export type Room = Database["public"]["Tables"]["rooms"]["Row"];
export type RoomWithImages = Room & {
  room_images: Database["public"]["Tables"]["room_images"]["Row"][];
};

// Fetches all rooms for the public rooms listing page.
// Ordered by base_price so cheaper rooms show first — a reasonable default
// for a marketing page; can add sort options later without changing this fn's shape.
export async function getRooms(): Promise<RoomWithImages[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rooms")
    .select("*, room_images(*)")
    .order("base_price", { ascending: true });

  if (error) {
    // Thrown, not swallowed — Next.js will surface this to the nearest
    // error.tsx boundary. Silently returning [] would make an outage look
    // like "we just have no rooms," which is misleading to a real visitor.
    throw new Error(`Failed to fetch rooms: ${error.message}`);
  }

  return data ?? [];
}

// Fetches a single room by its slug (used on /rooms/[slug] detail pages).
// Returns null (not throw) when not found — a missing room is a normal
// "show a 404" case, not an application error.
export async function getRoomBySlug(slug: string): Promise<RoomWithImages | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rooms")
    .select("*, room_images(*)")
    .eq("slug", slug)
    .maybeSingle(); // maybeSingle (not single) returns null instead of throwing on 0 rows

  if (error) {
    throw new Error(`Failed to fetch room "${slug}": ${error.message}`);
  }

  return data;
}

// Checks whether a room has any CONFIRMED booking overlapping the given
// date range. Used by the booking form to show real-time availability
// before the guest submits — this is a UX convenience check, NOT the
// source of truth. The database exclusion constraint (Part 1) is the real
// guarantee; this just avoids letting a guest fill out a whole form only
// to be rejected at the end.
export async function isRoomAvailable(
  roomId: string,
  checkIn: string, // ISO date string, e.g. "2026-10-01"
  checkOut: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bookings")
    .select("id")
    .eq("room_id", roomId)
    .eq("status", "confirmed")
    .lt("check_in", checkOut)   // existing booking starts before new one ends
    .gt("check_out", checkIn)   // existing booking ends after new one starts
    .limit(1);

  if (error) {
    throw new Error(`Failed to check availability: ${error.message}`);
  }

  return (data?.length ?? 0) === 0;
}