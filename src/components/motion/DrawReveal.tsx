"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

const wipe = {
  hidden: { clipPath: "inset(0% 100% 0% 0%)" },
  shown: { clipPath: "inset(0% 0% 0% 0%)" },
};

/**
 * Wipes its content in from left to right once it comes into view: a chart drawing
 * itself (DESIGN.md §7.3.3). The outer box is what is watched, because a fully
 * clipped element never counts as visible.
 */
export function DrawReveal({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <m.div
      className="absolute inset-0"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.4 }}
    >
      <m.div
        className="absolute inset-0"
        variants={wipe}
        transition={{ duration: 1.8, ease: [0.77, 0, 0.175, 1] }}
      >
        {children}
      </m.div>
    </m.div>
  );
}
