import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";
import { createAdminClient } from "@/lib/supabase/admin";

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

// Fetches a single room by its UUID — used by the booking form, which
// receives ?room=<id> from the "Book This Room" link rather than a slug.
// Same null-not-throw reasoning as getRoomBySlug: a bad/stale room ID in
// the URL is a normal case to handle gracefully, not a system error.
export async function getRoomById(id: string): Promise<Room | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch room: ${error.message}`);
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
  checkIn: string,
  checkOut: string
): Promise<boolean> {
  // Uses the admin client, not the regular server client — bookings has no
  // public RLS SELECT policy (see Part 1), so a guest-context query here
  // would silently return zero rows and always report "available,"
  // regardless of real conflicts. This is a narrow, deliberate exception:
  // we only ever return a boolean to the caller, never actual booking
  // rows/guest data, so bypassing RLS here doesn't leak anything.
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("bookings")
    .select("id")
    .eq("room_id", roomId)
    .eq("status", "confirmed")
    .lt("check_in", checkOut)
    .gt("check_out", checkIn)
    .limit(1);

  if (error) {
    throw new Error(`Failed to check availability: ${error.message}`);
  }

  return (data?.length ?? 0) === 0;
}