"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createBookingSchema, type CreateBookingInput } from "@/lib/validations/booking";
import { generateBookingReference } from "@/lib/utils/booking-reference";

export type CreateBookingResult =
  | { success: true; bookingReference: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createBooking(
  input: CreateBookingInput
): Promise<CreateBookingResult> {
  // 1. Re-validate on the server. Never trust that client-side Zod
  //    validation was actually run — a request could hit this action
  //    directly, bypassing the form entirely.
  const parsed = createBookingSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const {
    roomId,
    guestName,
    guestEmail,
    guestPhone,
    checkIn,
    checkOut,
    guestsCount,
    specialRequests,
  } = parsed.data;

  // Uses the service_role client because guests never authenticate
  // (see architecture decision: no guest accounts) — this Server Action
  // runs entirely server-side, and WE are the ones deciding what's allowed
  // to be written, based on the validation above. This is exactly the kind
  // of controlled, reviewable server-side logic the RLS policy comment in
  // Part 1 pointed to instead of a public "insert" RLS policy.
  const supabase = createAdminClient();

  // 2. Look up current room price — never trust a price sent from the client.
  //    A malicious request could otherwise submit any total_price it wants.
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("base_price, capacity")
    .eq("id", roomId)
    .maybeSingle();

  if (roomError || !room) {
    return { success: false, error: "Selected room could not be found." };
  }

  if (guestsCount > room.capacity) {
    return {
      success: false,
      error: `This room fits up to ${room.capacity} guests.`,
      fieldErrors: { guestsCount: [`Max ${room.capacity} guests for this room.`] },
    };
  }

  // 3. Calculate total server-side (snapshot logic from Part 1's schema design).
  const nights = Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
  );
  const pricePerNight = room.base_price;
  const totalPrice = pricePerNight * nights;

  // 4. Attempt the insert, with one retry on reference collision.
  //    (Extremely unlikely given the alphabet size — see Step 1 — but a
  //    single retry costs nothing and makes the tiny risk a non-issue.)
  for (let attempt = 0; attempt < 2; attempt++) {
    const bookingReference = generateBookingReference();

    const { error: insertError } = await supabase.from("bookings").insert({
      booking_reference: bookingReference,
      room_id: roomId,
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone || null,
      check_in: checkIn.toISOString().split("T")[0], // date-only, matches `date` column
      check_out: checkOut.toISOString().split("T")[0],
      guests_count: guestsCount,
      status: "pending", // v1: book now, pay at resort — staff confirms manually
      price_per_night: pricePerNight,
      total_price: totalPrice,
      currency: "PHP",
      special_requests: specialRequests || null,
    });

    if (!insertError) {
      return { success: true, bookingReference };
    }

    // Postgres unique_violation error code — only retry if it was the
    // reference that collided, not some other constraint.
    if (insertError.code === "23505" && insertError.message.includes("booking_reference")) {
      continue; // loop again with a freshly generated reference
    }

    console.error("Booking insert failed:", insertError);
    return {
      success: false,
      error: "Something went wrong while creating your booking. Please try again.",
    };
  }

  return {
    success: false,
    error: "Could not generate a unique booking reference. Please try again.",
  };
}