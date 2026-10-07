"use client";

import { type RefObject, useSyncExternalStore } from "react";

import type { ScrollOffset } from "@/lib/motion/scroll";
import type { SpringConfig } from "@/lib/motion/spring";

import { type MotionValue, useMotionValue, useScrollProgress, useSpring } from "./values";

/**
 * The spring every scene follows the scroll with. Critically damped (damping is
 * 2 * sqrt(stiffness * mass)), so it never overshoots and trails the scroll by only
 * about 50ms: enough to round off a keyboard or scrollbar jump, too little to feel
 * like the scene is floating behind the page. Wheel scrolling is already smoothed by
 * Lenis (SmoothScroll).
 */
const SCROLL_SPRING: SpringConfig = {
  stiffness: 140,
  damping: 14.5,
  mass: 0.35,
  restDelta: 0.0005,
};

/** A motion value that follows another on the scroll spring. */
export function useSmooth(value: MotionValue<number>): MotionValue<number> {
  return useSpring(value, SCROLL_SPRING);
}

/**
 * A media query as React state. While hydrating it reports `serverValue`, like the
 * server did, so the markup matches; right after, it re-renders with the real answer.
 */
function useMediaQuery(query: string, serverValue: boolean): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => {
        list.removeEventListener("change", onChange);
      };
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** True from the lg breakpoint up, where pinned scenes pin when they only pin on large screens. */
export function useIsLarge(): boolean {
  return useMediaQuery("(min-width: 64rem)", true);
}

/**
 * True when the visitor asks for reduced motion. It answers like the server while
 * hydrating, so React keeps the server HTML, and gives the real answer right after.
 * Until then the CSS (`motion-reduce:` and the reduced-motion rules) keeps things still.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)", false);
}

export type PinMode = "always" | "large";

/** Scroll offsets: while the stage is pinned, or while the scene passes through the viewport. */
const PINNED: ScrollOffset = ["start start", "end end"];
const PASSING: ScrollOffset = ["start 0.75", "end 0.55"];

/**
 * How far the visitor has scrolled through a scene, from 0 to 1. A pinned scene runs
 * while its stage sticks to the viewport; an unpinned one (small screens, for scenes
 * with a lot of text) runs while it passes through the viewport. With reduced motion
 * the scene is shown in its final state and never pinned (`still` is true).
 *
 * One scroll observer and one spring per scene: when the breakpoint flips, the
 * observer restarts with the other offset instead of a second one running unused.
 */
export function useSceneProgress(
  target: RefObject<HTMLElement | null>,
  mode: PinMode = "always",
): { progress: MotionValue<number>; still: boolean } {
  const reduce = usePrefersReducedMotion();
  const large = useIsLarge();
  const pinned = !reduce && (mode === "always" || large);
  const smooth = useSmooth(useScrollProgress(target, pinned ? PINNED : PASSING));
  const finished = useMotionValue(1);
  return { progress: reduce ? finished : smooth, still: reduce };
}
