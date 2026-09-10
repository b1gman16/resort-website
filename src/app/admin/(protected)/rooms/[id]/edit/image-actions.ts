"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ImageActionResult = { success: true } | { success: false; error: string };

// Accepts FormData directly (not a Zod-parsed object) because it contains
// an actual File — Zod's job here is limited to the alt text; the file
// itself is handled separately, since "validate a file upload" isn't
// really a schema-shape problem the same way form text fields are.
export async function uploadRoomImage(
  roomId: string,
  roomSlug: string,
  formData: FormData
): Promise<ImageActionResult> {
  const file = formData.get("file") as File | null;
  const altText = (formData.get("altText") as string) || null;

  if (!file || file.size === 0) {
    return { success: false, error: "Please choose an image file." };
  }

  if (!file.type.startsWith("image/")) {
    return { success: false, error: "Please upload an image file." };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: "Image must be under 5MB." };
  }

  const supabase = await createClient();

  // Path includes a timestamp so re-uploading a file with the same name
  // never collides with (or silently overwrites) a previous one.
  const path = `${roomSlug}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("room-images")
    .upload(path, file);

  if (uploadError) {
    console.error("Image upload failed:", uploadError);
    return { success: false, error: "Failed to upload image." };
  }

  // Insert the row AFTER the file upload succeeds, not before — if the
  // insert happened first and the upload then failed, room_images would
  // reference a file that doesn't exist in Storage, rendering as a broken
  // image on the site. This ordering guarantees a row only ever points at
  // something that's genuinely there.
  const { error: insertError } = await supabase.from("room_images").insert({
    room_id: roomId,
    storage_path: path,
    alt_text: altText,
    display_order: 0,
  });

  if (insertError) {
    // Roll back the upload so we don't leave an orphaned file in Storage
    // with nothing in the database pointing at it.
    await supabase.storage.from("room-images").remove([path]);
    console.error("Image row insert failed:", insertError);
    return { success: false, error: "Failed to save image." };
  }

  revalidatePath(`/admin/rooms/${roomId}/edit`);
  revalidatePath(`/rooms/${roomSlug}`);
  revalidatePath("/gallery");
  return { success: true };
}

export async function deleteRoomImage(
  imageId: string,
  storagePath: string,
  roomId: string,
  roomSlug: string
): Promise<ImageActionResult> {
  const supabase = await createClient();

  // Remove the database row first this time — if Storage deletion then
  // fails, the guest-facing site is already clean (no broken reference),
  // and an orphaned file quietly sitting in Storage is a harmless leftover
  // rather than a visibly broken image. Opposite ordering from upload,
  // deliberately, matching which failure mode is worse in each direction.
  const { error: deleteRowError } = await supabase
    .from("room_images")
    .delete()
    .eq("id", imageId);

  if (deleteRowError) {
    console.error("Delete image row failed:", deleteRowError);
    return { success: false, error: "Failed to delete image." };
  }

  const { error: storageError } = await supabase.storage
    .from("room-images")
    .remove([storagePath]);

  if (storageError) {
    // Log but don't fail the whole operation — from the guest's
    // perspective, the image is already gone (the row is deleted). This
    // is a cleanup-only failure, worth knowing about but not worth
    // blocking staff over.
    console.error("Storage file removal failed (row already deleted):", storageError);
  }

  revalidatePath(`/admin/rooms/${roomId}/edit`);
  revalidatePath(`/rooms/${roomSlug}`);
  revalidatePath("/gallery");
  return { success: true };
}

// Simple reorder: swap display_order between two adjacent images.
export async function moveImage(
  imageId: string,
  direction: "up" | "down",
  currentOrder: number,
  siblingImageId: string,
  siblingOrder: number,
  roomId: string
): Promise<ImageActionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("room_images")
    .update({ display_order: siblingOrder })
    .eq("id", imageId);

  if (error) {
    return { success: false, error: "Failed to reorder." };
  }

  await supabase.from("room_images").update({ display_order: currentOrder }).eq("id", siblingImageId);

  revalidatePath(`/admin/rooms/${roomId}/edit`);
  return { success: true };
}