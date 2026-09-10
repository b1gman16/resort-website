import { createClient } from "@/lib/supabase/server";

export type GalleryImage = {
  id: string;
  storage_path: string;
  alt_text: string | null;
  room_name: string;
};

// Pulls every room_images row across all rooms, with the room's name
// attached — needed so the gallery can caption each photo with which
// room it belongs to, without a separate lookup per image.
export async function getGalleryImages(): Promise<GalleryImage[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("room_images")
    .select("id, storage_path, alt_text, room:rooms(name)")
    .order("display_order");

  if (error) {
    throw new Error(`Failed to fetch gallery images: ${error.message}`);
  }

  // Supabase's nested select returns `room` as an object (or null if the
  // FK somehow didn't resolve) — flattened here so the page component
  // doesn't need to know about that shape, just a plain room_name string.
  return (data ?? []).map((img) => ({
    id: img.id,
    storage_path: img.storage_path,
    alt_text: img.alt_text,
    room_name: (img.room as { name: string } | null)?.name ?? "Resort",
  }));
}