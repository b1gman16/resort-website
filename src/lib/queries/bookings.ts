import { createAdminClient } from "@/lib/supabase/admin";
import { bookingLookupSchema, type BookingLookupInput } from "@/lib/validations/booking";

export type BookingDetails = {
  booking_reference: string;
  status: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  total_price: number;
  currency: string;
  special_requests: string | null;
  room: { name: string; slug: string } | null;
};

export type BookingLookupResult =
  | { success: true; booking: BookingDetails }
  | { success: false; error: string };

// Guest-facing lookup: reference + email acts as the "credential" in place
// of an account (see the no-guest-auth decision earlier in this project).
// Uses the admin client because there's no authenticated session to check
// against RLS — WE enforce the two-factor match (ref AND email) in the
// query itself, which is what makes this safe without exposing all bookings.
export async function lookupBooking(
  input: BookingLookupInput
): Promise<BookingLookupResult> {
  const parsed = bookingLookupSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Please enter a valid reference and email." };
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("bookings")
    .select(
      `booking_reference, status, check_in, check_out, guests_count,
       total_price, currency, special_requests,
       room:rooms(name, slug)`
    )
    // BOTH conditions must match — this is the actual security boundary.
    // Reference alone isn't enough (it's short and could theoretically be
    // guessed/brute-forced); pairing it with the email the guest provided
    // at booking time is what makes this safe to expose without accounts.
    .eq("booking_reference", parsed.data.bookingReference)
    .eq("guest_email", parsed.data.guestEmail)
    .maybeSingle();

  if (error) {
    console.error("Booking lookup failed:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  if (!data) {
    // Deliberately vague — same message whether the reference doesn't
    // exist OR the email doesn't match. Being specific ("wrong email" vs
    // "reference not found") would let someone enumerate valid booking
    // references by trial and error.
    return { success: false, error: "No booking found with that reference and email." };
  }

  return { success: true, booking: data as unknown as BookingDetails };
}

export type CancelBookingResult = { success: true } | { success: false; error: string };

export async function cancelBooking(
  bookingReference: string,
  guestEmail: string
): Promise<CancelBookingResult> {
  const supabase = createAdminClient();

  // Re-verify ownership with the same two-factor check before allowing
  // the cancellation — never trust that a prior lookup happened in the
  // same session; this function has to be safe to call on its own.
  const { data, error } = await supabase
    .from("bookings")
    .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
    .eq("booking_reference", bookingReference)
    .eq("guest_email", guestEmail)
    .in("status", ["pending", "confirmed"]) // can't cancel an already-cancelled/completed booking
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Cancellation failed:", error);
    return { success: false, error: "Could not cancel your booking. Please try again." };
  }

  if (!data) {
    return {
      success: false,
      error: "Booking not found, already cancelled, or no longer cancellable.",
    };
  }

  return { success: true };
}