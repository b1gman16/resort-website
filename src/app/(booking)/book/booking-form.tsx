"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBookingSchema } from "@/lib/validations/booking";
import { createBooking } from "./actions";
import { checkAvailability } from "./availability-action";
import type { Room } from "@/lib/queries/rooms";

type AvailabilityStatus = "idle" | "checking" | "available" | "unavailable";

export function BookingForm({ room }: { room: Room }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [availability, setAvailability] = useState<AvailabilityStatus>("idle");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  // Debounced availability check — runs automatically ~500ms after the
  // guest finishes picking both dates, rather than requiring a separate
  // "Check Availability" button click. This is a UX convenience only (see
  // Part 2's comment on isRoomAvailable) — the guest can still submit even
  // if this shows "unavailable," since v1 allows overlapping pending
  // requests that staff resolve manually.
  useEffect(() => {
    if (!checkIn || !checkOut) {
      setAvailability("idle");
      return;
    }

    setAvailability("checking");
    const timeout = setTimeout(async () => {
      const available = await checkAvailability(room.id, checkIn, checkOut);
      setAvailability(available ? "available" : "unavailable");
    }, 500);

    return () => clearTimeout(timeout);
  }, [checkIn, checkOut, room.id]);

  async function handleSubmit(formData: FormData) {
    setFormError(null);
    setFieldErrors({});

    const raw = {
      roomId: room.id,
      guestName: formData.get("guestName"),
      guestEmail: formData.get("guestEmail"),
      guestPhone: formData.get("guestPhone"),
      checkIn: formData.get("checkIn"),
      checkOut: formData.get("checkOut"),
      guestsCount: formData.get("guestsCount"),
      specialRequests: formData.get("specialRequests"),
    };

    // Client-side validation first — catches obvious issues (empty
    // required fields, malformed email) before even hitting the network.
    // The Server Action re-validates the same schema regardless (Part 2),
    // so this is purely a faster feedback loop, not the actual security
    // boundary.
    const parsed = createBookingSchema.safeParse(raw);
    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      setFormError("Please check the form for errors.");
      return;
    }

    startTransition(async () => {
      const result = await createBooking(parsed.data);

      if (!result.success) {
        setFormError(result.error);
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        return;
      }

      // Success — hand off to the confirmation page with the reference.
      // Not passing guest email in the URL on purpose (would leak it into
      // browser history / shared links) — the confirmation page only
      // needs the reference to display it back to the guest.
      router.push(`/confirmation?ref=${result.bookingReference}`);
    });
  }

  return (
    <form action={handleSubmit} className="mt-8 space-y-4">
      {formError && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{formError}</p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Field label="Check-in" error={fieldErrors.checkIn}>
          <input
            type="date"
            name="checkIn"
            required
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Check-out" error={fieldErrors.checkOut}>
          <input
            type="date"
            name="checkOut"
            required
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </Field>
      </div>

      <AvailabilityBadge status={availability} />

      <Field label="Guests" error={fieldErrors.guestsCount}>
        <input
          type="number"
          name="guestsCount"
          min={1}
          max={room.capacity}
          defaultValue={1}
          required
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </Field>

      <Field label="Full Name" error={fieldErrors.guestName}>
        <input name="guestName" required className="w-full border rounded px-3 py-2 text-sm" />
      </Field>

      <Field label="Email" error={fieldErrors.guestEmail}>
        <input
          type="email"
          name="guestEmail"
          required
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <p className="text-xs text-slate-500 mt-1">
          Used to send your confirmation and to manage your booking later.
        </p>
      </Field>

      <Field label="Phone (optional)" error={fieldErrors.guestPhone}>
        <input name="guestPhone" className="w-full border rounded px-3 py-2 text-sm" />
      </Field>

      <Field label="Special Requests (optional)" error={fieldErrors.specialRequests}>
        <textarea
          name="specialRequests"
          rows={3}
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </Field>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-slate-900 text-white rounded py-2.5 text-sm font-medium disabled:opacity-50"
      >
        {isPending ? "Submitting..." : "Request Booking"}
      </button>

      <p className="text-xs text-slate-500 text-center">
        Pay at the resort — no payment required now. Staff will confirm your booking shortly.
      </p>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string[];
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm text-slate-700 block mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error[0]}</p>}
    </div>
  );
}

function AvailabilityBadge({ status }: { status: AvailabilityStatus }) {
  if (status === "idle") return null;

  const styles: Record<Exclude<AvailabilityStatus, "idle">, string> = {
    checking: "bg-slate-100 text-slate-600",
    available: "bg-green-50 text-green-700",
    unavailable: "bg-amber-50 text-amber-800",
  };

  const text: Record<Exclude<AvailabilityStatus, "idle">, string> = {
    checking: "Checking availability...",
    available: "✓ These dates are available.",
    // Deliberately not blocking — see the useEffect comment above for why
    // this is a heads-up, not a hard stop.
    unavailable:
      "This room already has a confirmed booking for part of this range — you can still submit, but there's a chance it won't be confirmed.",
  };

  return (
    <p className={`text-xs px-3 py-2 rounded ${styles[status as keyof typeof styles]}`}>
      {text[status as keyof typeof text]}
    </p>
  );
}