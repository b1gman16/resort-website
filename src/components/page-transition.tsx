"use client";

import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    // key={pathname} forces a fresh DOM node on every route change, which
    // makes the CSS animation below replay automatically each time —
    // CSS keyframe animations apply their `from` state at the very first
    // paint, reliably, with no JS-timing gap for a flash to occur (unlike
    // the AnimatePresence approach, which needs to intercept an unmount
    // that Next.js's own routing has usually already completed by the
    // time the animation library reacts).
    <div key={pathname} className="animate-[page-fade-in_0.35s_ease-out]">
      {children}
    </div>
  );
}