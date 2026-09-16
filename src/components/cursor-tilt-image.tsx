"use client";

import { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import Image from "next/image";

export function CursorTiltImage({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Softer, slower spring than the magnetic button uses — a large hero
  // image reacting as snappily as a small button would feel jittery and
  // cheap rather than smooth and physical.
  const springConfig = { stiffness: 60, damping: 20, mass: 0.6 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      // Only track the cursor while it's actually within the hero's own
      // bounds — unlike the magnetic button (which deliberately reacts
      // from 100px away), a full-viewport image should only respond to
      // cursor movement that's genuinely over it.
      const withinBounds =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!withinBounds) {
        rotateX.set(0);
        rotateY.set(0);
        x.set(0);
        y.set(0);
        return;
      }

      // Normalize cursor position within the element to a -0.5 to 0.5
      // range, so the effect scales correctly regardless of the hero's
      // actual pixel dimensions.
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      rotateY.set(relX * 6); // deliberately small — 6deg max, not the button's 18deg
      rotateX.set(-relY * 6);
      x.set(relX * -20); // slight shift OPPOSITE the cursor, like a parallax window
      y.set(relY * -20);
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [rotateX, rotateY, x, y]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden" style={{ perspective: 1000 }}>
      <motion.div
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          x: springX,
          y: springY,
          scale: 1.1, // slightly oversized so the shift/tilt never reveals empty space at the edges
        }}
        className="absolute inset-0"
      >
        <Image src={src} alt={alt} fill priority quality={90} sizes="100vw" className="object-cover" />
      </motion.div>
    </div>
  );
}