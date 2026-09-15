import Image from "next/image";
import { Link } from "next-view-transitions";
import { Reveal } from "@/components/ui/reveal";
import { getRoomImageUrl } from "@/lib/utils/storage";
import type { GalleryImage } from "@/lib/queries/gallery";

const LAYOUT = [
  { top: "0%", left: "4%", width: "38%", height: "62%", rotate: -3 },
  { top: "6%", left: "44%", width: "30%", height: "42%", rotate: 2 },
  { top: "0%", left: "76%", width: "22%", height: "36%", rotate: -2 },
  { top: "50%", left: "46%", width: "26%", height: "46%", rotate: 4 },
  { top: "40%", left: "74%", width: "24%", height: "56%", rotate: -4 },
] as const;

export function GalleryMosaicTeaser({ images }: { images: GalleryImage[] }) {
  const shown = images.slice(0, LAYOUT.length);

  return (
    <section className="py-24 md:py-32 bg-[var(--color-sand)] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal once>
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-[var(--color-brass)] text-sm mb-3 tracking-wide">
                Around the resort
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-[var(--color-tide)]">
                A few favorite views
              </h2>
            </div>
            <Link
              href="/gallery"
              className="hidden md:block text-sm text-[var(--color-tide)] hover:underline whitespace-nowrap"
            >
              View Gallery
            </Link>
          </div>
        </Reveal>

        {shown.length > 0 && (
          <div className="relative h-[500px] md:h-[720px]">
            {shown.map((image, i) => {
              const layout = LAYOUT[i];
              return (
                // This outer div is now the real, explicitly-sized,
                // absolutely-positioned tile — it's what actually occupies
                // real space in the canvas, and what the hover effect
                // (rotate/scale/z-index) applies to.
                <div
                  key={image.id}
                  className="group absolute rounded-lg overflow-hidden shadow-xl transition-transform duration-500 hover:z-20 hover:!rotate-0 hover:scale-105"
                  style={{
                    top: layout.top,
                    left: layout.left,
                    width: layout.width,
                    height: layout.height,
                    transform: `rotate(${layout.rotate}deg)`,
                    zIndex: i,
                  }}
                >
                  {/* Reveal now sits INSIDE the sized box, filling it
                      completely (w-full h-full) — it has a real, non-zero
                      size to animate and to detect scroll-into-view
                      against, instead of collapsing. */}
                  <Reveal delay={i * 0.1} once className="w-full h-full">
                    <Link href="/gallery" className="relative block w-full h-full">
                      <Image
                        src={getRoomImageUrl(image.storage_path)}
                        alt={image.alt_text ?? image.room_name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, 30vw"
                      />
                    </Link>
                  </Reveal>
                </div>
              );
            })}
          </div>
        )}

        <Reveal once>
          <Link
            href="/gallery"
            className="md:hidden inline-block mt-6 text-sm text-[var(--color-tide)] hover:underline"
          >
            View Gallery
          </Link>
        </Reveal>
      </div>
    </section>
  );
}