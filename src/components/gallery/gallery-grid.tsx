"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import type { GalleryImage } from "@/lib/queries/gallery";
import { getRoomImageUrl } from "@/lib/utils/storage";

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex !== null ? images[activeIndex] : null;

  function showNext() {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex + 1) % images.length);
  }

  function showPrev() {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex - 1 + images.length) % images.length);
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((image, i) => (
          <button
            key={image.id}
            onClick={() => setActiveIndex(i)}
            className="relative aspect-square rounded-lg overflow-hidden bg-slate-200"
          >
            <Image
              src={getRoomImageUrl(image.storage_path)}
              alt={image.alt_text ?? image.room_name}
              fill
              className="object-cover hover:scale-105 transition-transform"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </button>
        ))}
      </div>

      {/* AnimatePresence lets the backdrop/image play an EXIT animation
          when `active` becomes null — without it, closing the lightbox
          would just instantly vanish, since React would unmount it
          before any exit animation had a chance to run. This works
          reliably here (unlike the earlier page-transition attempt)
          because there's no competing router/unmount race — this
          unmount is purely driven by our own state, which
          AnimatePresence can fully see and control. */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center px-4"
            onClick={() => setActiveIndex(null)}
          >
            <button
              onClick={() => setActiveIndex(null)}
              className="absolute top-4 right-4 text-white text-2xl"
              aria-label="Close"
            >
              ✕
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              className="absolute left-4 text-white text-3xl px-2 z-10"
              aria-label="Previous image"
            >
              ‹
            </button>

            {/* AnimatePresence + mode="wait" HERE too, nested — this
                controls the swap between individual photos as you click
                next/prev, separate from the outer open/close animation.
                key={active.id} is what triggers it: changing the key on
                every image switch makes Motion treat it as a distinct
                element to exit/enter, rather than updating in place. */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-3xl aspect-[4/3]"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={getRoomImageUrl(active.storage_path)}
                  alt={active.alt_text ?? active.room_name}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
                <p className="absolute -bottom-8 left-0 text-white text-sm">
                  {active.room_name}
                </p>
              </motion.div>
            </AnimatePresence>

            <button
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              className="absolute right-4 text-white text-3xl px-2 z-10"
              aria-label="Next image"
            >
              ›
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}