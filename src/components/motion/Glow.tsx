"use client";

import { m, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils/cn";

import { usePrefersReducedMotion } from "./useSceneProgress";

const blobs = [
  "left-[55%] top-[-25%] size-[60vmax] bg-[radial-gradient(closest-side,var(--mesh-2),transparent)] opacity-60 [animation:glow-drift-a_26s_ease-in-out_infinite_alternate]",
  "left-[20%] top-[-35%] size-[48vmax] bg-[radial-gradient(closest-side,var(--mesh-1),transparent)] opacity-45 [animation:glow-drift-b_31s_ease-in-out_infinite_alternate]",
  "left-[70%] top-[20%] size-[44vmax] bg-[radial-gradient(closest-side,var(--mesh-3),transparent)] opacity-35 [animation:glow-drift-c_23s_ease-in-out_infinite_alternate]",
  "left-[35%] top-[-10%] size-[36vmax] bg-[radial-gradient(closest-side,var(--mesh-4),transparent)] opacity-30 [animation:glow-drift-b_28s_ease-in-out_infinite_alternate-reverse]",
] as const;

/** How far the light follows the pointer, in pixels. */
const REACH = 60;

interface GlowProps {
  className?: string;
}

/**
 * Coloured light on a dark band: the hero's mesh as a glow. It drifts slowly, leans
 * towards the pointer on a spring, and pauses when off screen.
 */
export function Glow({ className }: Readonly<GlowProps>) {
  const root = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { duration: 0.9, bounce: 0 });
  const y = useSpring(pointerY, { duration: 0.9, bounce: 0 });

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
      pointerY.set((event.clientY / window.innerHeight - 0.5) * 2 * REACH);
    };
    if (fine.matches && !reduce) window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [pointerX, pointerY, reduce]);

  return (
    <div
      ref={root}
      aria-hidden
      className={cn("glow pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
    >
      <m.div className="absolute inset-0" style={{ x, y }}>
        {blobs.map((blob) => (
          <div key={blob} className={cn("absolute -translate-x-1/2 rounded-full", blob)} />
        ))}
      </m.div>
    </div>
  );
}
