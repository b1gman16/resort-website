import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

export type Amenity = Database["public"]["Tables"]["amenities"]["Row"];

// Amenities rarely change and there aren't many of them — no filtering or
// pagination needed, just fetch everything.
export async function getAmenities(): Promise<Amenity[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("amenities").select("*").order("name");

  if (error) {
    throw new Error(`Failed to fetch amenities: ${error.message}`);
  }

  return data ?? [];
}