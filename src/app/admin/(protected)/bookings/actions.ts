"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type StaffActionResult = { success: true } | { success: false; error: string };

export async function confirmBooking(bookingId: string): Promise<StaffActionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("bookings")
    .update({ status: "confirmed" })
    .eq("id", bookingId)
    .eq("status", "pending"); // guard: only confirm from a pending state

  if (error) {
    // 23P01 = Postgres exclusion_violation. This is the exact case the
    // Part 1 EXCLUDE constraint exists to catch: this booking's room+dates
    // overlap with a booking that's already confirmed. We catch it here
    // and turn it into a message a staff member can actually act on,
    // instead of surfacing a raw Postgres error.
    if (error.code === "23P01") {
      return {
        success: false,
        error:
          "Can't confirm — this room is already booked for overlapping dates. Check for a conflicting confirmed booking before proceeding.",
      };
    }

    console.error("Confirm booking failed:", error);
    return { success: false, error: "Something went wrong confirming this booking." };
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
  return { success: true };
}

export async function cancelBookingAsStaff(bookingId: string): Promise<StaffActionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
    .eq("id", bookingId)
    .in("status", ["pending", "confirmed"]);

  if (error) {
    console.error("Cancel booking failed:", error);
    return { success: false, error: "Something went wrong cancelling this booking." };
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
  return { success: true };
}

export async function markCompleted(bookingId: string): Promise<StaffActionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("bookings")
    .update({ status: "completed" })
    .eq("id", bookingId)
    .eq("status", "confirmed"); // can only complete a stay that was confirmed

  if (error) {
    console.error("Mark completed failed:", error);
    return { success: false, error: "Something went wrong updating this booking." };
  }

  revalidatePath("/admin/bookings");
  return { success: true };
}