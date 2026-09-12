"use client";

import { motion } from "motion/react";

export function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      // once: true means this only ever plays the first time it scrolls
      // into view — it won't re-trigger if the user scrolls back up and
      // down again. Re-triggering on every scroll pass reads as
      // distracting/gimmicky rather than polished.
      viewport={{ once: false, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}