import { notFound } from "next/navigation";
import { getRoomForEdit } from "@/lib/queries/admin-rooms";
import { RoomForm } from "@/components/admin/room-form";
import { RoomImageManager } from "@/components/admin/room-image-manager";
import { updateRoom } from "../../actions";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ id: string }> };

export default async function EditRoomPage({ params }: Props) {
  const { id } = await params;
  const room = await getRoomForEdit(id);

  if (!room) {
    notFound();
  }

  const supabase = await createClient();
  const { data: images } = await supabase
    .from("room_images")
    .select("id, storage_path, alt_text, display_order")
    .eq("room_id", id)
    .order("display_order");

  const updateRoomWithId = updateRoom.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">Edit {room.name}</h1>
      <RoomForm initialRoom={room} onSubmit={updateRoomWithId} />
      <RoomImageManager roomId={id} roomSlug={room.slug} initialImages={images ?? []} />
    </div>
  );
}