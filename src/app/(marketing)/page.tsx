import Link from "next/link";
import { getRooms } from "@/lib/queries/rooms";
import { RoomCard } from "@/components/rooms/room-card";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/ui/reveal";

export default async function HomePage() {
  const rooms = await getRooms();
  const featuredRooms = rooms.slice(0, 3);

  return (
    <div>
      <section className="bg-[var(--color-tide)] text-[var(--color-foam)]">
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <p className="text-[var(--color-brass)] text-sm mb-4">{siteConfig.heroLocation}</p>
          <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-6xl leading-[1.05] max-w-2xl">
            Slow mornings, ocean air, and nowhere to be.
          </h1>
          <p className="mt-6 text-lg opacity-80 max-w-md">{siteConfig.description}</p>
          <Link
            href="/rooms"
            className="inline-block mt-10 bg-[var(--color-foam)] text-[var(--color-tide)] px-7 py-3.5 rounded-sm font-medium hover:bg-[var(--color-sand)] transition-colors"
          >
            View Rooms
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <Reveal>
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-tide)]">
              Where to stay
            </h2>
            <Link href="/rooms" className="text-sm text-[var(--color-tide)] hover:underline">
              View all
            </Link>
          </div>
        </Reveal>

        {featuredRooms.length === 0 ? (
          <p className="text-[var(--color-ink)]/60">Rooms coming soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredRooms.map((room, i) => (
              // Staggered delay per card — each one reveals slightly after
              // the previous, left to right, instead of all three popping
              // in simultaneously.
              <Reveal key={room.id} delay={i * 0.1}>
                <RoomCard room={room} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <section className="bg-[var(--color-sand)] py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              title: "Beachfront, every room",
              body: "No room here is more than a two-minute walk from the water.",
            },
            {
              title: "Book now, pay later",
              body: "Reserve online, settle the bill when you arrive.",
            },
            {
              title: "Change your mind anytime",
              body: "Manage or cancel your booking yourself, no calls needed.",
            },
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