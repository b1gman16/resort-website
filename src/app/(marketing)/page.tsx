import Link from "next/link";
import { getRooms } from "@/lib/queries/rooms";
import { getAmenities } from "@/lib/queries/amenities";
import { getGalleryImages } from "@/lib/queries/gallery";
import { getRoomImageUrl } from "@/lib/utils/storage";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/ui/reveal";
import { HeroReveal } from "@/components/hero-reveal";
import { StorySection } from "@/components/story-section";
import { AmenitiesVisual } from "@/components/amenities-visual";
import { GalleryMosaicTeaser } from "@/components/gallery-mosaic-teaser";
import { ParallaxImage } from "@/components/parallax-image";

export default async function HomePage() {
  const [rooms, amenities, galleryImages] = await Promise.all([
    getRooms(),
    getAmenities(),
    getGalleryImages(),
  ]);

  const featuredRoom = rooms[0];
  const featuredRoomImage = featuredRoom?.room_images[0]
    ? getRoomImageUrl(featuredRoom.room_images[0].storage_path)
    : null;

  return (
    <div>
      {/* Hero — back to a single parallax image, no slideshow */}
      <section className="relative overflow-hidden">
        <HeroReveal storageKey="home">
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

      {/* Editorial statement */}
      <section className="max-w-4xl mx-auto px-6 py-28 md:py-36 text-center">
        <Reveal>
          <p className="font-[family-name:var(--font-display)] text-3xl md:text-4xl text-[var(--color-tide)] leading-snug">
            {siteConfig.name} is built around one idea — that a resort should feel like an
            extension of the water it sits beside, not a building dropped onto it.
          </p>
        </Reveal>
      </section>

      {/* Accommodations teaser */}
      <StorySection
        eyebrow="Accommodations"
        title="Where to stay"
        body="From ocean-view suites to private garden villas, every room opens toward the water in its own way."
        ctaLabel="Explore Rooms"
        ctaHref="/rooms"
        visual={
          featuredRoomImage ? (
            <ParallaxImage src={featuredRoomImage} alt={featuredRoom?.name ?? "A room at the resort"} />
          ) : (
            <div className="w-full h-full bg-[var(--color-sand)] flex items-center justify-center text-[var(--color-ink)]/40 text-sm">
              Photos coming soon
            </div>
          )
        }
      />

      {/* Amenities teaser */}
      <StorySection
        eyebrow="On the property"
        title="Everything within reach"
        body="A pool that never feels crowded, a kitchen that follows the season, and quiet corners for doing nothing at all."
        ctaLabel="See Amenities"
        ctaHref="/amenities"
        reversed
        tint="sand"
        visual={<AmenitiesVisual amenities={amenities} />}
      />

      {/* Gallery mosaic teaser */}
      <GalleryMosaicTeaser images={galleryImages} />

      {/* Closing CTA */}
      <section className="relative py-28 md:py-36 bg-gradient-to-br from-[var(--color-tide)] to-[var(--color-ink)] text-[var(--color-foam)] text-center">
        <Reveal>
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl leading-tight">
              Ready for slower days?
            </h2>
            <p className="mt-4 opacity-80">
              Pick a room, choose your dates. No payment until you arrive.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3 text-xs opacity-70">
              <span>Beachfront</span>
              <span>·</span>
              <span>Pay at the resort</span>
              <span>·</span>
              <span>Free cancellation</span>
            </div>
            <Link
              href="/rooms"
              className="inline-block mt-8 bg-[var(--color-foam)] text-[var(--color-tide)] px-7 py-3.5 rounded-sm font-medium hover:bg-[var(--color-sand)] transition-colors"
            >
              Browse Rooms
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}