"use client";

import { m, type MotionValue, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { usePrefersReducedMotion, useSmooth } from "./useSceneProgress";

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
  const blur = useTransform(progress, [start, start + 0.3], [10, 0]);
  const filter = useTransform(blur, (value) => `blur(${String(value)}px)`);
  return (
    <m.span data-reveal className="inline-block" style={{ opacity, y, filter }}>
      {children}
    </m.span>
  );
}

/**
 * A heading whose words rise into focus one after another as it scrolls into place,
 * like Apple's product copy. The text stays real text in the page.
 */
export function ScrollWords({ text }: Readonly<{ text: string }>) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress: raw } = useScroll({ target: ref, offset: ["start 0.92", "start 0.45"] });
  const scrollYProgress = useSmooth(raw);
  const words = text.split(" ");

  if (reduce) return <span>{text}</span>;
  return (
    <span ref={ref}>
      {words.map((word, index) => (
        <span key={`${word}-${String(index)}`}>
          {index > 0 && " "}
          <Word progress={scrollYProgress} index={index} count={words.length}>
            {word}
          </Word>
        </span>
      ))}
    </span>
  );
}
