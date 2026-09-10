import { notFound } from "next/navigation";
import { getRoomForEdit } from "@/lib/queries/admin-rooms";
import { RoomForm } from "@/components/admin/room-form";
import { updateRoom } from "../../actions";

type Props = { params: Promise<{ id: string }> };

export default async function EditRoomPage({ params }: Props) {
  const { id } = await params;
  const room = await getRoomForEdit(id);

  if (!room) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">Edit {room.name}</h1>
      <RoomForm
        initialRoom={room}
        onSubmit={(data) => updateRoom(id, data)}
      />
    </div>
  );
}