import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defense-in-depth: proxy.ts already redirects unauthenticated requests
  // away from /admin at the routing layer, but this Server Component check
  // is the one that actually matters for security — it runs with direct
  // access to the request's real session, independent of the proxy layer.
  // Exception: /admin/login itself must stay reachable while logged out,
  // which is why that route isn't wrapped by this layout (see folder
  // structure note below).
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <span className="font-semibold text-slate-900">Resort Admin</span>
        <div className="flex gap-4 text-sm text-slate-600">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/bookings">Bookings</Link>
          <Link href="/admin/rooms">Rooms</Link>
          <Link href="/admin/messages">Messages</Link>
        </div>
        <span className="text-sm text-slate-500">{user.email}</span>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}