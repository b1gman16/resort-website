import { RoomForm } from "@/components/admin/room-form";
import { createRoom } from "../actions";

export default function NewRoomPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">Add Room</h1>
      <RoomForm onSubmit={createRoom} />
    </div>
  );
}