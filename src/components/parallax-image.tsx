"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";

export function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);

  // Tracks scroll progress specifically across THIS element's own
  // transit through the viewport — "start start" (element's top hits
  // viewport top) through "end start" (element's bottom hits viewport
  // top) — not the whole page's scroll position. This means the effect
  // is tied to the hero scrolling past, not an arbitrary global value.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Image drifts down 20% of its own height as you scroll through the
  // hero — slower than the page itself is scrolling, which is what
  // reads as "parallax" (background moving at a different rate than
  // foreground content).
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      {/* h-[130%] + -top-[15%]: the image is deliberately oversized and
          shifted up beyond its container's actual bounds. Necessary
          because the parallax drift moves it — without this extra
          margin, the drift would eventually reveal empty space at the
          image's edge instead of more photo. */}
      <motion.div style={{ y }} className="absolute inset-x-0 -top-[15%] h-[130%]">
        <Image src={src} alt={alt} fill priority className="object-cover" />
      </motion.div>
    </div>
  );
}