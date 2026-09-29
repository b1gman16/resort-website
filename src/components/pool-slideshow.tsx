"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Reveal } from "@/components/ui/reveal";

type Slide = { src: string; alt: string };

const SLIDE_MS = 6000; // time each slide stays before auto-advancing
const EASE = [0.76, 0, 0.24, 1] as const; // same ease in/out curve used across the site

// direction: 1 = next (new slide enters from the right), -1 = previous
const variants = {
  enter: (direction: number) => ({ x: direction > 0 ? "100%" : "-100%" }),
  center: { x: "0%" },
  exit: (direction: number) => ({ x: direction > 0 ? "-100%" : "100%" }),
};

export function PoolSlideshow({
  slides,
  eyebrow,
  title,
  body,
}: {
  slides: Slide[];
  eyebrow: string;
  title: string;
  body: string;
}) {
  const [[index, direction], setPage] = useState<[number, number]>([0, 1]);

  function paginate(newDirection: number) {
    setPage(([prev]) => [(prev + newDirection + slides.length) % slides.length, newDirection]);
  }

  useEffect(() => {
    if (slides.length <= 1) return;

    // Respect the OS-level "reduce motion" setting: no autoplay.
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    // Depends on `index`, so any manual change (arrow or dot click)
    // restarts the timer and a slide never gets cut short.
    const timer = setTimeout(() => paginate(1), SLIDE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, slides.length]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[var(--color-ink)]">
      {/* Preloader: renders every slide's optimized image invisibly, so
          each one is already cached by the time it slides in (only the
          current slide is actually mounted below). Same `sizes` as the
          visible image, so the browser reuses the identical request. */}
      <div className="absolute w-px h-px overflow-hidden opacity-0 pointer-events-none" aria-hidden>
        {slides.map((slide) => (
          <div key={slide.src} className="relative w-px h-px">
            <Image src={slide.src} alt="" fill quality={85} sizes="100vw" loading="eager" />
          </div>
        ))}
      </div>

      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: EASE }}
          className="absolute inset-0"
        >
          <Image
            src={slides[index].src}
            alt={slides[index].alt}
            fill
            priority={index === 0}
            quality={85}
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Legibility layers. Adjust these numbers to taste:
          - the flat wash (/30) darkens the whole photo evenly
          - the gradient (/85 at the bottom) is where the text sits */}
      <div className="absolute inset-0 z-20 bg-[var(--color-ink)]/30 pointer-events-none" />
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-[var(--color-ink)]/85 via-[var(--color-ink)]/30 to-transparent pointer-events-none" />

      {/* Text */}
      <div className="relative z-30 min-h-screen flex items-end">
        <div className="max-w-6xl mx-auto px-6 pb-24 md:pb-28 w-full text-[var(--color-foam)]">
          <Reveal>
            <p className="text-[var(--color-brass)] text-sm mb-3 tracking-wide drop-shadow-lg">
              {eyebrow}
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl leading-[1.05] max-w-2xl drop-shadow-lg">
              {title}
            </h2>
            <p className="mt-5 text-lg opacity-90 max-w-md drop-shadow-lg">{body}</p>
          </Reveal>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          {/* Arrows — frosted glass, same treatment as the navbar's Book Now button */}
          <button
            onClick={() => paginate(-1)}
            aria-label="Previous photo"
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full backdrop-blur-md bg-[var(--color-foam)]/15 border border-[var(--color-foam)]/30 text-[var(--color-foam)] hover:bg-[var(--color-foam)]/25 transition-colors flex items-center justify-center text-xl"
          >
            ‹
          </button>
          <button
            onClick={() => paginate(1)}
            aria-label="Next photo"
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full backdrop-blur-md bg-[var(--color-foam)]/15 border border-[var(--color-foam)]/30 text-[var(--color-foam)] hover:bg-[var(--color-foam)]/25 transition-colors flex items-center justify-center text-xl"
          >
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-8 right-6 md:right-10 z-30 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => i !== index && setPage([i, i > index ? 1 : -1])}
                aria-label={`Show pool photo ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === index
                    ? "w-6 bg-[var(--color-foam)]"
                    : "w-1.5 bg-[var(--color-foam)]/40 hover:bg-[var(--color-foam)]/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}