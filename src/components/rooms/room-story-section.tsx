import { Link } from "next-view-transitions";
import type { RoomWithImages } from "@/lib/queries/rooms";
import { getRoomImageUrl } from "@/lib/utils/storage";
import { Reveal } from "@/components/ui/reveal";
import { ParallaxImage } from "@/components/parallax-image";

export function RoomStorySection({
  room,
  index,
}: {
  room: RoomWithImages;
  index: number;
}) {
  const primaryImage = room.room_images[0];
  const imageUrl = primaryImage ? getRoomImageUrl(primaryImage.storage_path) : null;
  const reversed = index % 2 === 1; // alternate layout direction per room

  return (
    <section
      className={`relative min-h-[90vh] flex items-center ${
        index % 2 === 0 ? "bg-[var(--color-foam)]" : "bg-[var(--color-sand)]"
      }`}
    >
      <div
        className={`max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full ${
          reversed ? "md:[direction:rtl]" : ""
        }`}
      >
        {/* Photo — full height within its column, parallax matching the homepage hero's treatment */}
        <Reveal>
          <div
            className={`relative aspect-[4/5] md:aspect-auto md:h-[70vh] rounded-lg overflow-hidden ${
              reversed ? "md:[direction:ltr]" : ""
            }`}
          >
            {imageUrl ? (
              <ParallaxImage src={imageUrl} alt={primaryImage?.alt_text ?? room.name} />
            ) : (
              <div className="w-full h-full bg-[var(--color-sand)] flex items-center justify-center text-[var(--color-ink)]/40 text-sm">
                Photo coming soon
              </div>
            )}
          </div>
        </Reveal>

        {/* Text block */}
        <Reveal delay={0.1}>
          <div className={reversed ? "md:[direction:ltr]" : ""}>
            <p className="text-[var(--color-brass)] text-sm mb-3">
              Room {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-[var(--color-tide)] leading-tight">
              {room.name}
            </h2>
            <p className="mt-6 text-[var(--color-ink)]/70 whitespace-pre-line">
              {room.description}
            </p>

            <div className="mt-8 flex items-center gap-6">
              <div>
                <p className="text-2xl font-[family-name:var(--font-display)] text-[var(--color-tide)]">
                  ₱{room.base_price.toLocaleString()}
                  <span className="text-sm font-sans text-[var(--color-ink)]/60"> / night</span>
                </p>
                <p className="text-sm text-[var(--color-ink)]/50 mt-1">
                  Up to {room.capacity} guests
                </p>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <Link
                href={`/rooms/${room.slug}`}
                className="inline-block px-6 py-3 rounded-sm border border-[var(--color-tide)] text-[var(--color-tide)] text-sm font-medium hover:bg-[var(--color-tide)] hover:text-[var(--color-foam)] transition-colors"
              >
                View Details
              </Link>
              <Link
                href={`/book?room=${room.id}`}
                className="inline-block px-6 py-3 rounded-sm bg-[var(--color-tide)] text-[var(--color-foam)] text-sm font-medium hover:bg-[var(--color-ink)] transition-colors"
              >
                Book This Room
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}