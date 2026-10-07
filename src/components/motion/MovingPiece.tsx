"use client";

import { type ReactNode, useEffect, useRef } from "react";

import type { SpringConfig } from "@/lib/motion/spring";

import { Animated } from "./Animated";
import { usePrefersReducedMotion } from "./useSceneProgress";
import { useMotionValue, useSpring, useTransform } from "./values";

/** Settles in about 0.9s with a small bounce, like a piece set down on its square. */
const SET_DOWN: SpringConfig = { stiffness: 81.5, damping: 15.35 };

interface MovingPieceProps {
  /** How many ranks the piece travels to reach its square, downwards. */
  ranks: number;
  children: ReactNode;
}

/** The last move, played again: the piece slides from its old square once in view. */
export function MovingPiece({ ranks, children }: Readonly<MovingPieceProps>) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = usePrefersReducedMotion();
  const square = useMotionValue(-ranks * 1.4);
  const y = useTransform(useSpring(square, SET_DOWN), (value) => `${String(value)}em`);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let timer: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        // A beat after it comes into view, so the eye is there when it moves.
        timer = window.setTimeout(() => {
          square.set(0);
        }, 500);
      },
      { threshold: 0.6 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [square]);

  if (reduce) return <span className="inline-block">{children}</span>;
  return (
    <Animated.span ref={ref} data-reveal className="inline-block" style={{ y }}>
      {children}
    </Animated.span>
  );
}
