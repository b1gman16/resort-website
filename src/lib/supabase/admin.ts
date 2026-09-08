// Admin client using the service_role key — bypasses Row Level Security.
//
// ⚠️ IMPORTANT: Only ever import this file from server-side code
// (Route Handlers, Server Actions). NEVER import it in a Client Component —
// bundling this key into browser JS would give every visitor full database access.
//
// Use case: the guest booking-lookup flow (ref + email, no session) needs to
// query bookings without an authenticated user context, since the guest never logs in.

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}