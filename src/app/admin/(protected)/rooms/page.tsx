import Link from "next/link";
import { getAllRoomsAdmin } from "@/lib/queries/admin-rooms";
import { RoomActiveToggle } from "@/components/admin/room-active-toggle";

export default async function AdminRoomsPage() {
  const rooms = await getAllRoomsAdmin();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Rooms</h1>
        <Link
          href="/admin/rooms/new"
          className="text-sm bg-slate-900 text-white px-4 py-2 rounded"
        >
          + Add Room
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Price / Night</th>
              <th className="px-4 py-2">Capacity</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="border-t">
                <td className="px-4 py-3">{room.name}</td>
                <td className="px-4 py-3">₱{room.base_price.toLocaleString()}</td>
                <td className="px-4 py-3">{room.capacity}</td>
                <td className="px-4 py-3">
                  <RoomActiveToggle roomId={room.id} isActive={room.is_active} />
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/rooms/${room.id}/edit`}
                    className="text-slate-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rooms.length === 0 && (
          <p className="text-center text-slate-500 py-8">No rooms yet.</p>
        )}
      </div>
    </div>
  );
}