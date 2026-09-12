"use client";

import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  // Respects the OS-level "reduce motion" accessibility setting — for
  // people who've explicitly opted out of animated effects, lerp: 1
  // makes scrolling effectively instant/native instead of smoothed,
  // rather than forcing the effect on everyone regardless of preference.
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <ReactLenis
      root
      options={{
        lerp: prefersReducedMotion ? 1 : 0.1, // interpolation smoothness — lower = smoother/slower catch-up
        duration: 1.2,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}