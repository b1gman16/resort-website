"use client";

import { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const MAGNETIC_RADIUS = 100; // px — how far from the button's center the pull starts engaging

export function MagneticWrap({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // Springs smooth out the raw mouse-position values — without this,
  // the button would snap directly to each mouse position instead of
  // easing toward it, which feels mechanical rather than magnetic.
  const springConfig = { stiffness: 150, damping: 15, mass: 0.4 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  useEffect(() => {
    // Listens on the whole window, not just the button itself — this is
    // what lets the effect engage BEFORE the cursor is actually over the
    // button (the "close to it" part of the ask). A listener scoped to
    // the button's own bounds would only ever fire once the cursor is
    // already on top of it, same as a normal :hover.
    function handleMouseMove(e: MouseEvent) {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.hypot(distX, distY);

      if (distance < MAGNETIC_RADIUS) {
        // pull strengthens the closer the cursor gets — 1 at dead center, 0 at the radius edge
        const pull = 1 - distance / MAGNETIC_RADIUS;
        x.set(distX * 0.35 * pull);
        y.set(distY * 0.35 * pull);
        rotateY.set((distX / rect.width) * 18 * pull);
        rotateX.set(-(distY / rect.height) * 18 * pull);
      } else {
        x.set(0);
        y.set(0);
        rotateX.set(0);
        rotateY.set(0);
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y, rotateX, rotateY]);

  return (
    <motion.div
      ref={ref}
      style={{
        x: springX,
        y: springY,
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 500,
      }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}