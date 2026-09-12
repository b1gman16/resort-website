"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";

export function HeroReveal({ children }: { children: React.ReactNode }) {
  // Defaults to `true` (panel shown) on every render, matching what the
  // server rendered — this avoids a hydration mismatch. The check below
  // then flips it off, without animating, for anyone who's already seen
  // it this session.
  const [showPanel, setShowPanel] = useState(true);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("hero-reveal-seen");
    if (seen) {
      setSkip(true); // instantly render as already-revealed, no animation
    } else {
      sessionStorage.setItem("hero-reveal-seen", "true");
    }
  }, []);

  return (
    <div className="relative overflow-hidden">
      {children}

      {!skip && showPanel && (
        <motion.div
          className="absolute inset-0 bg-[var(--color-ink)] pointer-events-none"
          style={{ transformOrigin: "right center" }}
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={() => setShowPanel(false)}
        />
      )}
    </div>
  );
}