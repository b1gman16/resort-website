// Browser-side Supabase client.
// Use this ONLY inside Client Components (files with "use client" at the top).
// It reads/writes the session via browser cookies automatically.

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}