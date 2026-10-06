import { getRooms } from "@/lib/queries/rooms";
import { RoomStorySection } from "@/components/rooms/room-story-section";
import { ParallaxImage } from "@/components/parallax-image";
import { HeroReveal } from "@/components/hero-reveal";

export default async function CottagesPage() {
  const cottages = await getRooms("cottage");

  return (
    <div>
      <section className="relative overflow-hidden">
        <HeroReveal storageKey="cottages">
          <div className="relative min-h-[70vh] flex items-end">
            <ParallaxImage src="/images/cottages-hero.jpg" alt="Cottages at the resort" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-tide)] via-[var(--color-tide)]/30 to-transparent" />

            <div className="relative max-w-6xl mx-auto px-6 pb-20 text-[var(--color-foam)] w-full">
              <p className="text-[var(--color-brass)] text-sm mb-4">
                {cottages.length} cottage{cottages.length !== 1 ? "s" : ""} to choose from
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-6xl leading-[1.05] max-w-2xl">
                Set apart, closer to the trees.
              </h1>
            </div>
          </div>
        </HeroReveal>
      </section>

      {cottages.length === 0 ? (
        <div className="max-w-6xl mx-auto px-6 py-20 text-center text-[var(--color-ink)]/60">
          No cottages available right now. Check back soon.
        </div>
      ) : (
        cottages.map((cottage, i) => <RoomStorySection key={cottage.id} room={cottage} index={i} />)
      )}
    </div>
  );
}