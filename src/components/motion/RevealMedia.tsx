"use client";

import { type ReactNode, useRef } from "react";

import { cn } from "@/lib/utils/cn";

import { Animated } from "./Animated";
import { usePrefersReducedMotion, useSmooth } from "./useSceneProgress";
import { useScrollProgress, useTransform } from "./values";

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
  const progress = useSmooth(useScrollProgress(ref, ["start end", "center center"]));
  const clipPath = useTransform(
    progress,
    [0, 1],
    ["inset(10% 14% 10% 14% round 24px)", "inset(0% 0% 0% 0% round 24px)"],
  );
  const scale = useTransform(progress, [0, 1], [1.18, 1]);

  // A plain element, not the same one with its styles removed: the clip and zoom last
  // written to it would stay.
  if (reduce) return <div className={cn("overflow-hidden", className)}>{children}</div>;

  return (
    <Animated.div ref={ref} className={cn("overflow-hidden", className)} style={{ clipPath }}>
      <Animated.div className="h-full w-full" style={{ scale }}>
        {children}
      </Animated.div>
    </Animated.div>
  );
}
