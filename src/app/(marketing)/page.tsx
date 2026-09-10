import Link from "next/link";
import { getRooms } from "@/lib/queries/rooms";
import { RoomCard } from "@/components/rooms/room-card";
import { siteConfig } from "@/config/site";

export default async function HomePage() {
  const rooms = await getRooms();
  const featuredRooms = rooms.slice(0, 3); // top 3 by price, per getRooms' ordering

  return (
    <div>
      {/* Hero */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-semibold">{siteConfig.name}</h1>
          <p className="text-slate-300 mt-4 max-w-xl mx-auto">{siteConfig.description}</p>
          <Link
            href="/rooms"
            className="inline-block mt-8 bg-white text-slate-900 px-6 py-3 rounded font-medium hover:bg-slate-100"
          >
            View Rooms
          </Link>
        </div>
      </section>

      {/* Featured rooms */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-slate-900">Featured Rooms</h2>
          <Link href="/rooms" className="text-sm text-slate-600 hover:underline">
            View all →
          </Link>
        </div>

        {featuredRooms.length === 0 ? (
          <p className="text-slate-500">Rooms coming soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </section>

      {/* Simple value props strip — replace with real amenities once /amenities exists */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="font-semibold text-slate-900">Beachfront Location</p>
            <p className="text-sm text-slate-500 mt-1">Steps from the water, every room.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Book Now, Pay Later</p>
            <p className="text-sm text-slate-500 mt-1">No payment required to reserve.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Flexible Cancellation</p>
            <p className="text-sm text-slate-500 mt-1">Manage or cancel anytime online.</p>
          </div>
        </div>
      </section>
    </div>
  );
}