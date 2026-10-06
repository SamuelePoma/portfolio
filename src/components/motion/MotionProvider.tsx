"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Fetched after hydration: scroll-linked styles render without them. */
const loadFeatures = () => import("./motion-features").then((module) => module.default);

/**
 * Loads Motion's animation features once for the whole app, asynchronously so they
 * stay off the critical path, and makes every Motion animation respect the visitor's
 * reduced-motion setting.
 */
export function MotionProvider({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
