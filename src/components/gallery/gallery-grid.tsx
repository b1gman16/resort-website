"use client";

import { useState } from "react";
import Image from "next/image";
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

      {/* Lightbox overlay — only rendered when something's actually
          selected, rather than always in the DOM and toggled with CSS.
          Simpler conditional logic, and avoids loading/rendering a
          full-size image that's never shown. */}
      {active && (
        <div
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
            className="absolute left-4 text-white text-3xl px-2"
            aria-label="Previous image"
          >
            ‹
          </button>

          <div
            className="relative w-full max-w-3xl aspect-[4/3]"
            onClick={(e) => e.stopPropagation()} // don't close when clicking the image itself
          >
            <Image
              src={getRoomImageUrl(active.storage_path)}
              alt={active.alt_text ?? active.room_name}
              fill
              className="object-contain"
              sizes="100vw"
            />
            <p className="absolute -bottom-8 left-0 text-white text-sm">{active.room_name}</p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            className="absolute right-4 text-white text-3xl px-2"
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}