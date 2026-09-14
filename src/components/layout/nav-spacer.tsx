"use client";

import { usePathname } from "next/navigation";
import { FULL_BLEED_HERO_PATHS } from "@/config/hero-paths";

export function NavSpacer() {
  const pathname = usePathname();

  if (FULL_BLEED_HERO_PATHS.includes(pathname)) return null;

  return <div className="h-[84px]" />;
}