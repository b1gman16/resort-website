"use client";

import { usePathname } from "next/navigation";

export function NavSpacer() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // On the homepage, the hero is DESIGNED to sit behind the transparent
  // navbar — no spacer needed, or wanted. Every other page needs its
  // content pushed down by the navbar's (unscrolled) height so nothing
  // starts out hidden underneath it.
  if (isHome) return null;

  return <div className="h-[84px]" />;
}