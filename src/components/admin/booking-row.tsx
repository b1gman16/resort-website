"use client";

import { useState, useTransition } from "react";
import type { AdminBooking } from "@/lib/queries/admin-bookings";
import type { StaffActionResult } from "@/app/admin/(protected)/bookings/actions";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-slate-200 text-slate-600",
  completed: "bg-blue-100 text-blue-800",
  no_show: "bg-red-100 text-red-800",
};

export function BookingRow({
  booking,
  onConfirm,
  onCancel,
  onComplete,
}: {
  booking: AdminBooking;
  onConfirm: (id: string) => Promise<StaffActionResult>;
  onCancel: (id: string) => Promise<StaffActionResult>;
  onComplete: (id: string) => Promise<StaffActionResult>;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function runAction(action: (id: string) => Promise<StaffActionResult>) {
    setError(null);
    startTransition(async () => {
      const result = await action(booking.id);
      // This is exactly where the 23P01 message from actions.ts surfaces
      // to the person who needs to see it — a staff member deciding
      // whether to confirm a booking.
      if (!result.success) {
        setError(result.error);
      }
    });
  }

  return (
    <tr className="border-t">
      <td className="px-4 py-3 font-mono text-xs">{booking.booking_reference}</td>
      <td className="px-4 py-3">
        <div>{booking.guest_name}</div>
        <div className="text-slate-500 text-xs">{booking.guest_email}</div>
      </td>
      <td className="px-4 py-3">{booking.room?.name ?? "—"}</td>
      <td className="px-4 py-3 text-xs">
        {booking.check_in} → {booking.check_out}
      </td>
      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${STATUS_STYLES[booking.status]}`}
        >
          {booking.status}
        </span>
        {error && <p className="text-red-600 text-xs mt-1 max-w-xs">{error}</p>}
      </td>
      <td className="px-4 py-3 space-x-2">
        {booking.status === "pending" && (
          <>
            <button
              disabled={isPending}
              onClick={() => runAction(onConfirm)}
              className="text-xs bg-green-600 text-white px-2 py-1 rounded disabled:opacity-50"
            >
              Confirm
            </button>
            <button
              disabled={isPending}
              onClick={() => runAction(onCancel)}
              className="text-xs bg-slate-200 px-2 py-1 rounded disabled:opacity-50"
            >
              Cancel
            </button>
          </>
        )}
        {booking.status === "confirmed" && (
          <>
            <button
              disabled={isPending}
              onClick={() => runAction(onComplete)}
              className="text-xs bg-blue-600 text-white px-2 py-1 rounded disabled:opacity-50"
            >
              Mark Completed
            </button>
            <button
              disabled={isPending}
              onClick={() => runAction(onCancel)}
              className="text-xs bg-slate-200 px-2 py-1 rounded disabled:opacity-50"
            >
              Cancel
            </button>
          </>
        )}
      </td>
    </tr>
  );
}