import { getAllBookings } from "@/lib/queries/admin-bookings";
import { confirmBooking, cancelBookingAsStaff, markCompleted } from "./actions";
import { BookingRow } from "@/components/admin/booking-row";

export default async function AdminBookingsPage() {
  const bookings = await getAllBookings();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Bookings</h1>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-2">Reference</th>
              <th className="px-4 py-2">Guest</th>
              <th className="px-4 py-2">Room</th>
              <th className="px-4 py-2">Dates</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <BookingRow
                key={booking.id}
                booking={booking}
                onConfirm={confirmBooking}
                onCancel={cancelBookingAsStaff}
                onComplete={markCompleted}
              />
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <p className="text-center text-slate-500 py-8">No bookings yet.</p>
        )}
      </div>
    </div>
  );
}