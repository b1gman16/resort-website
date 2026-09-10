"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Navbar() {
  // Mobile menu state lives here since this is the only component that
  // needs it — no reason to lift it higher or reach for a global store
  // for something this contained.
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b bg-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold text-slate-900">
          {siteConfig.name}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-slate-900">
              {item.label}
            </Link>
          ))}
          <Link
            href="/manage"
            className="hover:text-slate-900"
          >
            Manage Booking
          </Link>
        </nav>

        <Link
          href="/rooms"
          className="hidden md:block bg-slate-900 text-white text-sm px-4 py-2 rounded hover:bg-slate-800"
        >
          Book Now
        </Link>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden text-slate-700"
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile nav panel */}
      {menuOpen && (
        <nav className="md:hidden border-t px-6 py-4 flex flex-col gap-3 text-sm text-slate-600">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/manage" onClick={() => setMenuOpen(false)}>
            Manage Booking
          </Link>
          <Link
            href="/rooms"
            onClick={() => setMenuOpen(false)}
            className="bg-slate-900 text-white text-center px-4 py-2 rounded"
          >
            Book Now
          </Link>
        </nav>
      )}
    </header>
  );
}