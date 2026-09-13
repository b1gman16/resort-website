import Link from "next/link";
import { getRooms } from "@/lib/queries/rooms";
import { RoomCard } from "@/components/rooms/room-card";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/ui/reveal";
import { HeroReveal } from "@/components/hero-reveal";
import { ParallaxImage } from "@/components/parallax-image";

export default async function HomePage() {
  const rooms = await getRooms();
  const featuredRooms = rooms.slice(0, 3);

  return (
    <div>
      <section className="relative overflow-hidden">
        <HeroReveal>
          <div className="relative min-h-[85vh] flex items-end">
            <ParallaxImage src="/images/hero.jpg" alt="Ocean view at the resort" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-tide)] via-[var(--color-tide)]/40 to-transparent" />

            <div className="relative max-w-6xl mx-auto px-6 pb-32 md:pb-40 pt-40 text-[var(--color-foam)] w-full">
              <p className="text-[var(--color-brass)] text-sm mb-4">{siteConfig.heroLocation}</p>
              <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl leading-[1.02] max-w-2xl">
                Slow mornings, ocean air, and nowhere to be.
              </h1>
              <p className="mt-6 text-lg opacity-90 max-w-md">{siteConfig.description}</p>
              <Link
                href="/rooms"
                className="inline-block mt-10 bg-[var(--color-foam)] text-[var(--color-tide)] px-7 py-3.5 rounded-sm font-medium hover:bg-[var(--color-sand)] transition-colors"
              >
                View Rooms
              </Link>
            </div>
          </div>
        </HeroReveal>
      </section>

      <section className="relative z-10 max-w-6xl mx-auto px-6 -mt-24 pb-20">
        <Reveal>
          <div className="bg-[var(--color-foam)] rounded-lg shadow-xl p-8 md:p-12">
            <div className="flex items-end justify-between mb-10">
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-tide)]">
                Where to stay
              </h2>
              <Link href="/rooms" className="text-sm text-[var(--color-tide)] hover:underline">
                View all
              </Link>
            </div>

            {featuredRooms.length === 0 ? (
              <p className="text-[var(--color-ink)]/60">Rooms coming soon.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {featuredRooms.map((room, i) => (
                  <Reveal key={room.id} delay={i * 0.1}>
                    <RoomCard room={room} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </section>

      <section className="bg-[var(--color-sand)] py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { title: "Beachfront, every room", body: "No room here is more than a two-minute walk from the water." },
            { title: "Book now, pay later", body: "Reserve online, settle the bill when you arrive." },
            { title: "Change your mind anytime", body: "Manage or cancel your booking yourself, no calls needed." },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <div>
                <p className="font-[family-name:var(--font-display)] text-xl text-[var(--color-tide)]">
                  {item.title}
                </p>
                <p className="text-sm text-[var(--color-ink)]/70 mt-2">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}