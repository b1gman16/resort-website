"use client";

import { useState, useTransition } from "react";
import { bookingLookupSchema } from "@/lib/validations/booking";
import { lookup, cancel } from "./actions";
import type { BookingDetails } from "@/lib/queries/bookings";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending confirmation",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
  no_show: "No-show",
};

export default function ManageBookingPage() {
  const [isPending, startTransition] = useTransition();

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Kept separately from the lookup form fields — needed again to
  // authorize the cancel action, since cancelBooking re-checks ref+email
  // itself rather than trusting that a lookup already happened (see
  // Part 2's comment on cancelBooking for why).
  const [savedEmail, setSavedEmail] = useState("");

  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  function handleLookup(formData: FormData) {
    setLookupError(null);
    setFieldErrors({});
    setCancelSuccess(false);
    setCancelError(null);

    const raw = {
      bookingReference: formData.get("bookingReference"),
      guestEmail: formData.get("guestEmail"),
    };

    const parsed = bookingLookupSchema.safeParse(raw);
    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    startTransition(async () => {
      const result = await lookup(parsed.data);
      if (!result.success) {
        setLookupError(result.error);
        setBooking(null);
        return;
      }
      setBooking(result.booking);
      setSavedEmail(parsed.data.guestEmail);
    });
  }

  function handleCancel() {
    if (!booking) return;
    setCancelError(null);

    startTransition(async () => {
      const result = await cancel(booking.booking_reference, savedEmail);
      if (!result.success) {
        setCancelError(result.error);
        return;
      }
      setCancelSuccess(true);
      // Reflect the new status immediately without a fresh lookup round-trip.
      setBooking({ ...booking, status: "cancelled" });
    });
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold text-slate-900">Manage Your Booking</h1>
      <p className="text-slate-500 mt-1 text-sm">
        Enter your booking reference and the email you used to book.
      </p>

      {!booking && (
        <form action={handleLookup} className="mt-6 space-y-4">
          {lookupError && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{lookupError}</p>
          )}

          <div>
            <label className="text-sm text-slate-700 block mb-1">Booking Reference</label>
            <input
              name="bookingReference"
              placeholder="RST-XXXXX"
              required
              className="w-full border rounded px-3 py-2 text-sm font-mono uppercase"
            />
            {fieldErrors.bookingReference && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.bookingReference[0]}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-slate-700 block mb-1">Email</label>
            <input
              type="email"
              name="guestEmail"
              required
              className="w-full border rounded px-3 py-2 text-sm"
            />
            {fieldErrors.guestEmail && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.guestEmail[0]}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-slate-900 text-white rounded py-2.5 text-sm font-medium disabled:opacity-50"
          >
            {isPending ? "Looking up..." : "Find My Booking"}
          </button>
        </form>
      )}

      {booking && (
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm text-slate-500">
              {booking.booking_reference}
            </span>
            <span className="text-xs font-medium px-2 py-1 rounded bg-slate-100 text-slate-700">
              {STATUS_LABELS[booking.status] ?? booking.status}
            </span>
          </div>

          <h2 className="text-lg font-semibold text-slate-900">
            {booking.room?.name ?? "Room"}
          </h2>

          <dl className="text-sm text-slate-600 space-y-1">
            <div className="flex justify-between">
              <dt>Check-in</dt>
              <dd>{booking.check_in}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Check-out</dt>
              <dd>{booking.check_out}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Guests</dt>
              <dd>{booking.guests_count}</dd>
            </div>
            <div className="flex justify-between font-medium text-slate-900">
              <dt>Total</dt>
              <dd>
                {booking.currency} {booking.total_price.toLocaleString()}
              </dd>
            </div>
          </dl>

          {booking.special_requests && (
            <p className="text-xs text-slate-500 border-t pt-3">
              <span className="font-medium">Special requests:</span> {booking.special_requests}
            </p>
          )}

          {cancelSuccess && (
            <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded">
              Your booking has been cancelled.
            </p>
          )}

          {cancelError && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{cancelError}</p>
          )}

          {/* Only offer cancellation for states where it's actually
              meaningful — mirrors the same guard already enforced
              server-side in cancelBooking (Part 2), so the button simply
              doesn't appear rather than appearing and then failing. */}
          {!cancelSuccess && ["pending", "confirmed"].includes(booking.status) && (
            <button
              onClick={handleCancel}
              disabled={isPending}
              className="w-full border border-red-300 text-red-700 rounded py-2 text-sm font-medium hover:bg-red-50 disabled:opacity-50"
            >
              {isPending ? "Cancelling..." : "Cancel This Booking"}
            </button>
          )}

          <button
            onClick={() => {
              setBooking(null);
              setCancelSuccess(false);
            }}
            className="w-full text-sm text-slate-500 hover:underline pt-2"
          >
            Look up a different booking
          </button>
        </div>
      )}
    </div>
  );
}