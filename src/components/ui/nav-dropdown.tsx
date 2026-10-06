"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "next-view-transitions";

export function NavDropdown({
  label,
  items,
}: {
  label: string;
  items: { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    // onMouseLeave on the wrapper (not just the trigger) is what lets the
    // dropdown panel stay open while moving the cursor DOWN into it —
    // without this, the gap between trigger and panel would close it
    // prematurely.
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="relative group flex items-center gap-1">
        {label}
        <span
          className={`text-[10px] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
        <span className="absolute left-0 -bottom-1 w-full h-px bg-current scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-1/2 -translate-x-1/2 pt-3"
          >
            <div className="bg-[var(--color-foam)] text-[var(--color-tide)] rounded-sm shadow-xl border border-[var(--color-sand)] py-2 min-w-[160px]">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2 text-sm hover:bg-[var(--color-sand)] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}