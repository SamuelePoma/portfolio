"use client";

import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";

import { Container } from "@/components/layout/Container";

/** Card width and side padding, shared with the cards so the CSS height matches. */
export const RAIL_CARD_WIDTH = "min(84vw, 620px)";
const RAIL_GAP = "1.5rem";
const RAIL_PADDING = "max(1rem, calc((100vw - 75rem) / 2 + 1.5rem))";

interface ProjectRailProps {
  heading: ReactNode;
  /** How many cards ride the rail; the section's height is worked out from it in CSS. */
  count: number;
  children: ReactNode;
}

/**
 * The rest of the work on a horizontal rail, like Apple's "Get to know" galleries: the
 * section pins and scrolling down slides the cards sideways. The section is as tall as
 * the sideways distance, so every card passes at the speed of normal scrolling. With
 * reduced motion it is a row you scroll sideways yourself.
 */
export function ProjectRail({ heading, count, children }: Readonly<ProjectRailProps>) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const element = track.current;
    if (!element || reduce) return;
    const measure = () => {
      setDistance(Math.max(0, element.scrollWidth - window.innerWidth));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [reduce]);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  if (reduce) {
    return (
      <section className="py-24">
        <Container>{heading}</Container>
        <div
          className="mt-12 flex snap-x gap-6 overflow-x-auto pb-6"
          style={{ paddingInline: RAIL_PADDING }}
        >
          {children}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={section}
      className="relative"
      // The sideways distance, in CSS: every card and gap plus both paddings, minus the
      // viewport. The page has its final length before any script runs.
      style={{
        height: `calc(100svh + max(0px, ${String(count)} * ${RAIL_CARD_WIDTH} + ${String(count - 1)} * ${RAIL_GAP} + 2 * ${RAIL_PADDING} - 100vw))`,
      }}
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center gap-10 overflow-hidden pt-16">
        <Container>{heading}</Container>
        <m.div ref={track} className="flex w-max gap-6" style={{ x, paddingInline: RAIL_PADDING }}>
          {children}
        </m.div>
      </div>
    </section>
  );
}
