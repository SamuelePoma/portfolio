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

/** Scroll offsets: while the stage is pinned, or while the scene passes through the viewport. */
const PINNED: ["start start", "end end"] = ["start start", "end end"];
const PASSING: ["start 0.75", "end 0.55"] = ["start 0.75", "end 0.55"];

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
  const reduce = useReducedMotion() ?? false;
  const large = useIsLarge();
  const pinned = !reduce && (mode === "always" || large);
  const { scrollYProgress } = useScroll({ target, offset: pinned ? PINNED : PASSING });
  const smooth = useSmooth(scrollYProgress);
  const finished = useMotionValue(1);
  return { progress: reduce ? finished : smooth, still: reduce };
}
