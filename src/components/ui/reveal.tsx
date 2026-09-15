"use client";

import { motion } from "motion/react";

export function Reveal({
  children,
  delay = 0,
  once = false,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  once?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}