"use client";

import { m, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { CSSProperties, PointerEvent, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

/** The most the card leans towards the pointer, in degrees. */
const MAX_TILT = 6;

interface TiltCardProps {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * A card that leans towards the pointer on a spring, with a soft light following it
 * (DESIGN.md §7.3.4). Fine pointers only; touch and reduced motion get a still card.
 */
export function TiltCard({ className, style, children }: Readonly<TiltCardProps>) {
  const reduce = useReducedMotion();
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const lightX = useMotionValue(50);
  const lightY = useMotionValue(50);
  const rotateX = useSpring(tiltX, { duration: 0.5, bounce: 0.15 });
  const rotateY = useSpring(tiltY, { duration: 0.5, bounce: 0.15 });
  const light = useMotionTemplate`radial-gradient(420px circle at ${lightX}% ${lightY}%, rgb(255 255 255 / 0.10), transparent 60%)`;

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduce || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width;
    const py = (event.clientY - box.top) / box.height;
    tiltX.set((0.5 - py) * 2 * MAX_TILT);
    tiltY.set((px - 0.5) * 2 * MAX_TILT);
    lightX.set(px * 100);
    lightY.set(py * 100);
  }

  function onPointerLeave() {
    tiltX.set(0);
    tiltY.set(0);
  }

  return (
    <div className={cn("[perspective:1400px]", className)} style={style}>
      <m.div
        className="group/tilt relative h-full preserve-3d"
        style={{ rotateX, rotateY }}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        {children}
        <m.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-200 group-hover/tilt:opacity-100"
          style={{ background: light }}
        />
      </m.div>
    </div>
  );
}
