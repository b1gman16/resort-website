import { z } from "zod";

// ------------------------------------------------------------------
// Booking creation — used by the booking form AND the Server Action
// ------------------------------------------------------------------
export const createBookingSchema = z
  .object({
    roomId: z.string().uuid(),
    guestName: z.string().trim().min(2, "Please enter your full name").max(100),
    guestEmail: z.string().trim().email("Please enter a valid email address"),
    guestPhone: z.string().trim().max(20).optional().or(z.literal("")),
    checkIn: z.coerce.date({ message: "Please select a check-in date" }),
    checkOut: z.coerce.date({ message: "Please select a check-out date" }),
    guestsCount: z.coerce.number().int().min(1, "At least 1 guest required").max(20),
    specialRequests: z.string().trim().max(1000).optional().or(z.literal("")),
  })
  // Cross-field validation — can't express "checkOut > checkIn" with a
  // single field rule, so this runs after individual fields pass.
  .refine((data) => data.checkOut > data.checkIn, {
    message: "Check-out date must be after check-in date",
    path: ["checkOut"], // attaches the error to the checkOut field in form UI
  })
  .refine(
    (data) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return data.checkIn >= today;
    },
    {
      message: "Check-in date cannot be in the past",
      path: ["checkIn"],
    }
  );

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

// ------------------------------------------------------------------
// Booking lookup (the "manage my booking" flow — no account, ref + email)
// ------------------------------------------------------------------
export const bookingLookupSchema = z.object({
  bookingReference: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^RST-[A-Z0-9]{5}$/, "That doesn't look like a valid booking reference"),
  guestEmail: z.string().trim().email("Please enter a valid email address"),
});

export type BookingLookupInput = z.infer<typeof bookingLookupSchema>;

// ------------------------------------------------------------------
// Contact form
// ------------------------------------------------------------------
export const contactFormSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  message: z.string().trim().min(10, "Message is too short").max(2000),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;