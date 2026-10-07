"use client";

import { type CSSProperties, type PointerEvent, type ReactNode, useRef } from "react";

import type { SpringConfig } from "@/lib/motion/spring";
import { cn } from "@/lib/utils/cn";

import { Animated } from "./Animated";
import { usePrefersReducedMotion } from "./useSceneProgress";
import { useMotionValue, useSpring } from "./values";

/** The most the card leans towards the pointer, in degrees. */
const MAX_TILT = 6;

/** Settles in about 0.5s with a slight give, like a card resting on a fingertip. */
const LEAN: SpringConfig = { stiffness: 264, damping: 27.6 };

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
  const reduce = usePrefersReducedMotion();
  const light = useRef<HTMLDivElement>(null);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, LEAN);
  const rotateY = useSpring(tiltY, LEAN);

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduce || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width;
    const py = (event.clientY - box.top) / box.height;
    tiltX.set((0.5 - py) * 2 * MAX_TILT);
    tiltY.set((px - 0.5) * 2 * MAX_TILT);
    light.current?.style.setProperty("--light-x", `${String(px * 100)}%`);
    light.current?.style.setProperty("--light-y", `${String(py * 100)}%`);
  }

  function onPointerLeave() {
    tiltX.set(0);
    tiltY.set(0);
  }

  return (
    <div className={cn("[perspective:1400px]", className)} style={style}>
      <Animated.div
        className="group/tilt relative h-full preserve-3d"
        style={{ rotateX, rotateY }}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        {children}
        <div
          ref={light}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-lg bg-[radial-gradient(420px_circle_at_var(--light-x,50%)_var(--light-y,50%),rgb(255_255_255/0.10),transparent_60%)] opacity-0 transition-opacity duration-200 group-hover/tilt:opacity-100"
        />
      </Animated.div>
    </div>
  );
}
