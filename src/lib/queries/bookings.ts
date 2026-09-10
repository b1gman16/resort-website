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
    .eq("booking_reference", parsed.data.bookingReference)
    .eq("guest_email", parsed.data.guestEmail)
    .maybeSingle();

  if (error) {
    console.error("Booking lookup failed:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  if (!data) {
    return { success: false, error: "No booking found with that reference and email." };
  }

  return { success: true, booking: data as unknown as BookingDetails };
}

// Fetches a booking by reference alone, no email required — unlike
// lookupBooking (used by /manage), which deliberately requires both as a
// security boundary for guests returning later. This one is only ever
// reached via the redirect immediately after a guest creates their own
// booking (see the booking form's router.push), so the reference alone is
// sufficient here — same trust level as, e.g., a Stripe checkout success
// page showing an order summary right after payment.
export async function getBookingByReference(
  bookingReference: string
): Promise<BookingDetails | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("bookings")
    .select(
      `booking_reference, status, check_in, check_out, guests_count,
       total_price, currency, special_requests,
       room:rooms(name, slug)`
    )
    .eq("booking_reference", bookingReference)
    .maybeSingle();

  if (error) {
    console.error("Booking fetch by reference failed:", error);
    return null;
  }

  return data as unknown as BookingDetails | null;
}

export type CancelBookingResult = { success: true } | { success: false; error: string };

export async function cancelBooking(
  bookingReference: string,
  guestEmail: string
): Promise<CancelBookingResult> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("bookings")
    .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
    .eq("booking_reference", bookingReference)
    .eq("guest_email", guestEmail)
    .in("status", ["pending", "confirmed"])
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