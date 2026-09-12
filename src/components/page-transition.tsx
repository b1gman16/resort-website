"use client";

import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    // mode="wait" means the outgoing page fully finishes its exit
    // animation before the incoming page starts entering — a clean
    // hand-off rather than both overlapping mid-transition.
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname} // changing key on route change is what triggers exit+enter
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}