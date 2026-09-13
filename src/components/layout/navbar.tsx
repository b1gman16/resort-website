"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Link } from "next-view-transitions";
import { siteConfig } from "@/config/site";
import { NavLink } from "@/components/ui/nav-link";
import { MagneticWrap } from "@/components/magnetic-wrap";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const transparent = isHome && !scrolled;

  const leftLinks = siteConfig.nav.slice(0, 3);
  const rightLinks = siteConfig.nav.slice(3);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        transparent ? "bg-transparent" : "bg-[var(--color-foam)] shadow-md"
      }`}
    >
      <div
        className={`max-w-6xl mx-auto px-6 grid grid-cols-[1fr_auto_1fr] items-center transition-all duration-300 ${
          scrolled ? "py-3" : "py-5"
        } ${transparent ? "text-[var(--color-foam)]" : "text-[var(--color-tide)]"}`}
      >
        <nav className="hidden md:flex items-center gap-6 text-sm justify-self-start">
          {leftLinks.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-lg md:text-xl justify-self-center whitespace-nowrap"
        >
          {siteConfig.name}
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm justify-self-end">
          {rightLinks.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
          <NavLink href="/manage">Manage Booking</NavLink>

          <MagneticWrap>
            <Link
              href="/rooms"
              className={`inline-block px-5 py-2.5 rounded-sm text-sm font-medium backdrop-blur-md border transition-all ${
                transparent
                  ? "bg-[var(--color-foam)]/15 border-[var(--color-foam)]/30 text-[var(--color-foam)] hover:bg-[var(--color-foam)]/25"
                  : "bg-[var(--color-tide)]/10 border-[var(--color-tide)]/20 text-[var(--color-tide)] hover:bg-[var(--color-tide)]/20"
              }`}
            >
              Book Now
            </Link>
          </MagneticWrap>
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden justify-self-end"
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden bg-[var(--color-foam)] text-[var(--color-ink)] px-6 py-4 flex flex-col gap-3 text-sm border-t border-[var(--color-sand)]">
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