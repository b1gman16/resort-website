import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="bg-[var(--color-tide)] text-[var(--color-foam)] mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <p className="font-[family-name:var(--font-display)] text-xl">{siteConfig.name}</p>
          <p className="text-sm mt-3 opacity-75 max-w-xs">{siteConfig.description}</p>
        </div>

        <div>
          <p className="text-sm font-medium mb-3">Explore</p>
          <ul className="space-y-2 text-sm opacity-75">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:opacity-100">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium mb-3">Contact</p>
          <ul className="space-y-2 text-sm opacity-75">
            <li>{siteConfig.contact.address}</li>
            <li>
              <a href={`tel:${siteConfig.contact.phone}`} className="hover:opacity-100">
                {siteConfig.contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.contact.email}`} className="hover:opacity-100">
                {siteConfig.contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 text-center text-xs opacity-60 py-5">
        © {new Date().getFullYear()} {siteConfig.name}
      </div>
    </footer>
  );
}