"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { roomSchema, type RoomInput } from "@/lib/validations/room";

export type RoomActionResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createRoom(input: RoomInput): Promise<RoomActionResult> {
  const parsed = roomSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rooms")
    .insert({
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description,
      base_price: parsed.data.basePrice,
      capacity: parsed.data.capacity,
      total_units: parsed.data.totalUnits,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return {
        success: false,
        error: "That slug is already in use — pick a different one.",
        fieldErrors: { slug: ["This slug is already taken."] },
      };
    }
    console.error("Create room failed:", error);
    return { success: false, error: "Something went wrong creating the room." };
  }

  revalidatePath("/admin/rooms");
  revalidatePath("/rooms");
  redirect(`/admin/rooms/${data.id}/edit`);
}

export async function updateRoom(roomId: string, input: RoomInput): Promise<RoomActionResult> {
  const parsed = roomSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("rooms")
    .update({
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description,
      base_price: parsed.data.basePrice,
      capacity: parsed.data.capacity,
      total_units: parsed.data.totalUnits,
    })
    .eq("id", roomId);

  if (error) {
    if (error.code === "23505") {
      return {
        success: false,
        error: "That slug is already in use — pick a different one.",
        fieldErrors: { slug: ["This slug is already taken."] },
      };
    }
    console.error("Update room failed:", error);
    return { success: false, error: "Something went wrong updating the room." };
  }

  revalidatePath("/admin/rooms");
  revalidatePath("/rooms");
  revalidatePath(`/rooms/${parsed.data.slug}`);
  redirect("/admin/rooms");
}

export async function toggleRoomActive(
  roomId: string,
  currentlyActive: boolean
): Promise<RoomActionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("rooms")
    .update({ is_active: !currentlyActive })
    .eq("id", roomId);

  if (error) {
    console.error("Toggle room active failed:", error);
    return { success: false, error: "Something went wrong." };
  }

  revalidatePath("/admin/rooms");
  revalidatePath("/rooms");
  return { success: true };
}