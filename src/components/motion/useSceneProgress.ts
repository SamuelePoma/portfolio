"use client";

import {
  type MotionValue,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import { type RefObject, useSyncExternalStore } from "react";

/**
 * The spring every scene follows the scroll with. A mouse wheel moves the page in
 * steps; the scene glides after it instead of jumping, and settles without overshoot.
 */
export const SCROLL_SPRING = { stiffness: 140, damping: 30, mass: 0.35, restDelta: 0.0005 };

/** A motion value that follows another on the scroll spring. */
export function useSmooth(value: MotionValue<number>): MotionValue<number> {
  return useSpring(value, SCROLL_SPRING);
}

/** Where pinned scenes start pinning when they only pin on large screens. */
const LARGE = "(min-width: 64rem)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(LARGE);
  query.addEventListener("change", onChange);
  return () => {
    query.removeEventListener("change", onChange);
  };
}

/** True from the lg breakpoint up. Assumes a large screen on the server. */
export function useIsLarge(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(LARGE).matches,
    () => true,
  );
}

export type PinMode = "always" | "large";

/**
 * How far the visitor has scrolled through a scene, from 0 to 1. A pinned scene runs
 * while its stage sticks to the viewport; an unpinned one (small screens, for scenes
 * with a lot of text) runs while it passes through the viewport. With reduced motion
 * the scene is shown in its final state and never pinned (`still` is true).
 */
export function useSceneProgress(
  target: RefObject<HTMLElement | null>,
  mode: PinMode = "always",
): { progress: MotionValue<number>; still: boolean } {
  const reduce = useReducedMotion() ?? false;
  const large = useIsLarge();
  const pinned = !reduce && (mode === "always" || large);
  const { scrollYProgress: whilePinned } = useScroll({
    target,
    offset: ["start start", "end end"],
  });
  const { scrollYProgress: whilePassing } = useScroll({
    target,
    offset: ["start 0.75", "end 0.55"],
  });
  const smoothPinned = useSmooth(whilePinned);
  const smoothPassing = useSmooth(whilePassing);
  const finished = useMotionValue(1);
  return { progress: reduce ? finished : pinned ? smoothPinned : smoothPassing, still: reduce };
}
