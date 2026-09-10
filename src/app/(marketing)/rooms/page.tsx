import Link from "next/link";
import { getRooms } from "@/lib/queries/rooms";
import { RoomCard } from "@/components/rooms/room-card";

// Server Component — fetches at request time. Marketing content like this
// is a good candidate for static generation/revalidation later (rooms
// don't change every minute), but we're keeping it simple and always-fresh
// for now; caching is an optimization to layer in once the site is stable,
// not a day-one concern.
export default async function RoomsPage() {
  const rooms = await getRooms();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold text-slate-900 mb-2">Our Rooms</h1>
      <p className="text-slate-600 mb-8">
        Find the space that fits your stay, from ocean-view suites to private villas.
      </p>

      {rooms.length === 0 ? (
        <p className="text-slate-500">No rooms available right now. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}