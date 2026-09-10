import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t bg-slate-50 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="font-semibold text-slate-900">{siteConfig.name}</p>
          <p className="text-sm text-slate-500 mt-2">{siteConfig.description}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-900 mb-2">Explore</p>
          <ul className="space-y-1 text-sm text-slate-500">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-slate-900">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-900 mb-2">Contact</p>
          <ul className="space-y-1 text-sm text-slate-500">
            <li>{siteConfig.contact.address}</li>
            <li>
              <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-slate-900">
                {siteConfig.contact.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="hover:text-slate-900"
              >
                {siteConfig.contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t text-center text-xs text-slate-400 py-4">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}