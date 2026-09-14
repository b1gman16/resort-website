"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";

export function HeroReveal({
  children,
  storageKey = "home",
}: {
  children: React.ReactNode;
  storageKey?: string;
}) {
  const [showPanel, setShowPanel] = useState(true);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    const key = `hero-reveal-seen-${storageKey}`;
    const seen = sessionStorage.getItem(key);
    if (seen) {
      setSkip(true);
    } else {
      sessionStorage.setItem(key, "true");
    }
  }, [storageKey]);

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