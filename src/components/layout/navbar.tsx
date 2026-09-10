"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[var(--color-foam)] sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-xl text-[var(--color-tide)]"
        >
          {siteConfig.name}
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-[var(--color-ink)]">
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-[var(--color-tide)]">
              {item.label}
            </Link>
          ))}
          <Link href="/manage" className="hover:text-[var(--color-tide)]">
            Manage Booking
          </Link>
        </nav>

        <Link
          href="/rooms"
          className="hidden md:block bg-[var(--color-tide)] text-[var(--color-foam)] text-sm px-5 py-2.5 rounded-sm hover:bg-[var(--color-ink)] transition-colors"
        >
          Book Now
        </Link>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden text-[var(--color-tide)]"
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden px-6 py-4 flex flex-col gap-3 text-sm text-[var(--color-ink)] border-t border-[var(--color-sand)]">
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link href="/manage" onClick={() => setMenuOpen(false)}>
            Manage Booking
          </Link>
          <Link
            href="/rooms"
            onClick={() => setMenuOpen(false)}
            className="bg-[var(--color-tide)] text-[var(--color-foam)] text-center px-4 py-2.5 rounded-sm"
          >
            Book Now
          </Link>
        </nav>
      )}
    </header>
  );
}