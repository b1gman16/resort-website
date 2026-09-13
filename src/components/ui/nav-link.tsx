import { Link } from "next-view-transitions";

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    // group: lets the underline span react to hover on this whole link,
    // not just itself. bg-current: the underline automatically matches
    // whatever text color is active (Foam over the hero, Tide once
    // scrolled/on other pages) — no separate color prop needed.
    <Link href={href} className="relative group">
      {children}
      <span className="absolute left-0 -bottom-1 w-full h-px bg-current scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
    </Link>
  );
}