import { createClient } from "@/lib/supabase/client";

// Converts a storage_path (e.g. "ocean-view-suite/photo1.jpg") into a
// full public URL the browser can actually load in an <img> tag.
//
// This is a plain function, not async — getPublicUrl() doesn't hit the
// network, it just constructs the URL string based on your project's
// known Storage domain. Safe to call from both Server and Client
// Components without needing to await anything.
export function getRoomImageUrl(storagePath: string): string {
  const supabase = createClient();
  const { data } = supabase.storage.from("room-images").getPublicUrl(storagePath);
  return data.publicUrl;
}