import { getRooms } from "@/lib/queries/rooms";
import { RoomStorySection } from "@/components/rooms/room-story-section";
import { ParallaxImage } from "@/components/parallax-image";
import { HeroReveal } from "@/components/hero-reveal";

export default async function RoomsPage() {
  const rooms = await getRooms();

  return (
    <div>
      <section className="relative overflow-hidden">
        <HeroReveal storageKey="rooms">
          <div className="relative min-h-[70vh] flex items-end">
            <ParallaxImage src="/images/rooms-hero.jpg" alt="Rooms at the resort" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-tide)] via-[var(--color-tide)]/30 to-transparent" />

            <div className="relative max-w-6xl mx-auto px-6 pb-20 text-[var(--color-foam)] w-full">
              <p className="text-[var(--color-brass)] text-sm mb-4">
                {rooms.length} room{rooms.length !== 1 ? "s" : ""} to choose from
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-6xl leading-[1.05] max-w-2xl">
                Every room has its own way of facing the water.
              </h1>
            </div>
          </div>
        </HeroReveal>
      </section>

      {rooms.length === 0 ? (
        <div className="max-w-6xl mx-auto px-6 py-20 text-center text-[var(--color-ink)]/60">
          No rooms available right now. Check back soon.
        </div>
      ) : (
        rooms.map((room, i) => <RoomStorySection key={room.id} room={room} index={i} />)
      )}
    </div>
  );
}