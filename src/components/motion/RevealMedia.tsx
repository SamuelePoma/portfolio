"use client";

import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { type ReactNode, useRef } from "react";

import { cn } from "@/lib/utils/cn";

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
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(10% 14% 10% 14% round 24px)", "inset(0% 0% 0% 0% round 24px)"],
  );
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1]);

  return (
    <m.div
      ref={ref}
      className={cn("overflow-hidden", className)}
      style={reduce ? {} : { clipPath }}
    >
      <m.div className="h-full w-full" style={reduce ? {} : { scale }}>
        {children}
      </m.div>
    </m.div>
  );
}
