"use server";

import { lookupBooking, cancelBooking } from "@/lib/queries/bookings";
import { bookingLookupSchema, type BookingLookupInput } from "@/lib/validations/booking";

// Thin re-export as a Server Action — same reasoning as Part 5's
// checkAvailability wrapper. Re-validates here too, since a Server Action
// endpoint can technically be called directly, bypassing whatever the
// client form did.
export async function lookup(input: BookingLookupInput) {
  const parsed = bookingLookupSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: "Please enter a valid reference and email." };
  }
  return lookupBooking(parsed.data);
}

export async function cancel(bookingReference: string, guestEmail: string) {
  return cancelBooking(bookingReference, guestEmail);
}