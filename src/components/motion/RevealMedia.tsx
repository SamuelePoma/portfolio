"use client";

import { m, useScroll, useTransform } from "motion/react";
import { type ReactNode, useRef } from "react";

import { cn } from "@/lib/utils/cn";

import { usePrefersReducedMotion, useSmooth } from "./useSceneProgress";

interface RevealMediaProps {
  className?: string;
  children: ReactNode;
}

/**
 * A photo that opens up as it scrolls into view, from a smaller window to its full
 * frame, while the image inside settles from a slight zoom (DESIGN.md §7.3.3).
 */
export function RevealMedia({ className, children }: Readonly<RevealMediaProps>) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress: raw } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const scrollYProgress = useSmooth(raw);
  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(10% 14% 10% 14% round 24px)", "inset(0% 0% 0% 0% round 24px)"],
  );
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1]);

  // A plain element, not the same one with its styles removed: Motion would keep the
  // clip and zoom it last applied.
  if (reduce) return <div className={cn("overflow-hidden", className)}>{children}</div>;

  return (
    <m.div ref={ref} className={cn("overflow-hidden", className)} style={{ clipPath }}>
      <m.div className="h-full w-full" style={{ scale }}>
        {children}
      </m.div>
    </m.div>
  );
}
