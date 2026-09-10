"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type MarkReadResult = { success: true } | { success: false; error: string };

export async function markAsRead(messageId: string): Promise<MarkReadResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("contact_messages")
    .update({ read_at: new Date().toISOString() })
    .eq("id", messageId)
    .is("read_at", null); // only touch it if it's still actually unread

  if (error) {
    console.error("Mark message read failed:", error);
    return { success: false, error: "Something went wrong." };
  }

  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { success: true };
}