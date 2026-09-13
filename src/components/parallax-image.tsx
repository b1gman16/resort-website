"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";

export function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-x-0 -top-[15%] h-[130%]">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          quality={90} // ADDED — default is 75; a hero image is worth the extra file size for crispness
          sizes="100vw" // ADDED — tells Next this image is always full viewport width, so it serves the appropriately large version at every breakpoint instead of guessing conservatively
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}