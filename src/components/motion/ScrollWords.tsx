"use client";

import { useRef } from "react";

import { Animated } from "./Animated";
import { usePrefersReducedMotion, useSmooth } from "./useSceneProgress";
import { type MotionValue, useScrollProgress, useTransform } from "./values";

function Word({
  progress,
  index,
  count,
  children,
}: Readonly<{ progress: MotionValue<number>; index: number; count: number; children: string }>) {
  const start = (index / count) * 0.7;
  // From fully transparent rather than dimmed: a dimmed word would read as low-contrast
  // text, while an invisible one is simply not there yet.
  const opacity = useTransform(progress, [start, start + 0.3], [0, 1]);
  const y = useTransform(progress, [start, start + 0.3], ["0.35em", "0em"]);
  const filter = useTransform(progress, [start, start + 0.3], ["blur(10px)", "blur(0px)"]);
  return (
    <Animated.span data-reveal className="inline-block" style={{ opacity, y, filter }}>
      {children}
    </Animated.span>
  );
}

/**
 * A heading whose words rise into focus one after another as it scrolls into place,
 * like Apple's product copy. The text stays real text in the page.
 */
export function ScrollWords({ text }: Readonly<{ text: string }>) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = usePrefersReducedMotion();
  const progress = useSmooth(useScrollProgress(ref, ["start 0.92", "start 0.45"]));
  const words = text.split(" ");

  if (reduce) return <span>{text}</span>;
  return (
    <span ref={ref}>
      {words.map((word, index) => (
        <span key={`${word}-${String(index)}`}>
          {index > 0 && " "}
          <Word progress={progress} index={index} count={words.length}>
            {word}
          </Word>
        </span>
      ))}
    </span>
  );
}
