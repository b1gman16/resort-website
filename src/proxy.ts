// Refreshes the Supabase auth session on every request and protects /admin routes.
//
// Why this exists: Server Components can't write cookies (see server.ts above).
// Without this middleware, a staff member's session would silently expire
// mid-visit because nothing would ever refresh the auth token.
//
// Scope: guests never authenticate in this app (see architecture decision:
// booking lookup uses reference + email, not accounts) — so this only needs
// to guard /admin routes, not the whole site.

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isAdminLoginRoute = request.nextUrl.pathname === "/admin/login";

  // Redirect unauthenticated users away from protected admin pages
  if (isAdminRoute && !isAdminLoginRoute && !user) {
    const redirectUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect already-logged-in staff away from the login page
  if (isAdminLoginRoute && user) {
    const redirectUrl = new URL("/admin", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

// Only run this middleware on admin routes — skip it for marketing/booking
// pages entirely, since those don't need session checks and we don't want
// the extra Supabase round-trip slowing down public page loads.
export const config = {
  matcher: ["/admin/:path*"],
};