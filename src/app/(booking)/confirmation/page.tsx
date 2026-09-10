import Link from "next/link";
import { getBookingByReference } from "@/lib/queries/bookings";

type Props = {
  searchParams: Promise<{ ref?: string }>;
};

export default async function ConfirmationPage({ searchParams }: Props) {
  const { ref } = await searchParams;
  const booking = ref ? await getBookingByReference(ref) : null;

  return (
    <div className="max-w-lg mx-auto px-6 py-16 text-center">
      <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto text-2xl">
        ✓
      </div>

      <h1 className="text-2xl font-semibold text-slate-900 mt-4">Booking Requested</h1>
      <p className="text-slate-600 mt-2">
        We've received your request. Our staff will review and confirm it shortly — you'll
        pay at the resort, no payment needed now.
      </p>

      {booking ? (
        <div className="mt-6 bg-slate-50 rounded-lg p-5 text-left space-y-2">
          <div className="flex items-center justify-between border-b pb-2 mb-1">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Reference</p>
            <p className="font-mono font-semibold text-slate-900">
              {booking.booking_reference}
            </p>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Room</span>
            <span className="text-slate-900">{booking.room?.name ?? "—"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Check-in</span>
            <span className="text-slate-900">{booking.check_in}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Check-out</span>
            <span className="text-slate-900">{booking.check_out}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Guests</span>
            <span className="text-slate-900">{booking.guests_count}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold pt-2 border-t">
            <span className="text-slate-900">Total (pay at resort)</span>
            <span className="text-slate-900">
              {booking.currency} {booking.total_price.toLocaleString()}
            </span>
          </div>
        </div>
      ) : (
        ref && (
          <div className="mt-6 bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide">
              Your Booking Reference
            </p>
            <p className="text-2xl font-mono font-semibold text-slate-900 mt-1">{ref}</p>
          </div>
        )
      )}

      <p className="text-xs text-slate-500 mt-4">
        Save your reference — you'll need it along with your email to manage this booking
        later.
      </p>

      <div className="mt-8 flex gap-3 justify-center">
        <Link
          href="/"
          className="text-sm px-4 py-2 rounded border border-slate-300 hover:bg-slate-50"
        >
          Back to Home
        </Link>
        <Link
          href="/manage"
          className="text-sm px-4 py-2 rounded bg-slate-900 text-white hover:bg-slate-800"
        >
          Manage Booking
        </Link>
      </div>
    </div>
  );
}