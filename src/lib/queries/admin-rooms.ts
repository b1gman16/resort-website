import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

export type AdminRoom = Database["public"]["Tables"]["rooms"]["Row"];

// Unlike the public getRooms(), this deliberately has NO is_active filter
// — staff need to see and manage hidden rooms too, not just active ones.
export async function getAllRoomsAdmin(): Promise<AdminRoom[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .order("name");

  if (error) {
    throw new Error(`Failed to fetch rooms: ${error.message}`);
  }

  return data ?? [];
}

export async function getRoomForEdit(id: string): Promise<AdminRoom | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch room: ${error.message}`);
  }

  return data;
}