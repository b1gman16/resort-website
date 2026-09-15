"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import "lenis/dist/lenis.css";

// Lenis owns scroll position itself and has no built-in awareness of
// Next.js client-side route changes — without this, navigating to a new
// page keeps whatever scroll offset Lenis had on the PREVIOUS page,
// instead of resetting to the top like normal browser navigation would.
function ScrollToTopOnNavigate() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true }); // immediate: true — a jump, not a smooth animated scroll, matching normal navigation behavior
  }, [pathname, lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <ReactLenis
      root
      options={{
        lerp: prefersReducedMotion ? 1 : 0.1,
        duration: 1.2,
        smoothWheel: true,
      }}
    >
      <ScrollToTopOnNavigate />
      {children}
    </ReactLenis>
  );
}