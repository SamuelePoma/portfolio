"use client";

import { m, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils/cn";

import { usePrefersReducedMotion } from "./useSceneProgress";

/** How far the light follows the pointer, in pixels. */
const REACH = 40;

interface GlowProps {
  /**
   * `hero`: the opening, where the horizon sits low and the light leans towards the
   * pointer. `horizon`: the same light, closing the page from the bottom edge.
   */
  variant?: "hero" | "horizon";
  /** Draw the dark planet here. The opening draws its own, in front of the laptop. */
  planet?: boolean;
  className?: string;
}

/**
 * Coloured light on a dark band (DESIGN.md §3.2): the mesh colours rising behind the
 * rim of a dark horizon, like the first light over a planet. All gradients, no blur
 * filters; the light drifts slowly, pauses when off screen and stops with reduced motion.
 */
export function Glow({ variant = "hero", planet = true, className }: Readonly<GlowProps>) {
  const root = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { duration: 0.9, bounce: 0 });
  const y = useSpring(pointerY, { duration: 0.9, bounce: 0 });
  const follows = variant === "hero";

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      element.toggleAttribute("data-paused", !entry?.isIntersecting);
    });
    observer.observe(element);

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const onMove = (event: PointerEvent) => {
      pointerX.set((event.clientX / window.innerWidth - 0.5) * 2 * REACH);
      pointerY.set((event.clientY / window.innerHeight - 0.5) * REACH);
    };
    if (follows && fine.matches && !reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
    }
    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [follows, pointerX, pointerY, reduce]);

  return (
    <div
      ref={root}
      aria-hidden
      className={cn(
        "glow horizon pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        variant === "horizon" && "horizon-low",
        className,
      )}
    >
      <m.div className="absolute inset-0" style={follows ? { x, y } : {}}>
        <div className="horizon-light horizon-light-a" />
        <div className="horizon-light horizon-light-b" />
        <div className="horizon-light horizon-light-c" />
      </m.div>
      {planet && <div className="horizon-planet" />}
      <div className="horizon-grain" />
    </div>
  );
}
