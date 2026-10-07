"use client";

import { type ReactNode, useEffect, useRef } from "react";

/**
 * Wipes its content in from left to right once it comes into view: a chart drawing
 * itself (DESIGN.md §7.3.3). The wipe is a CSS transition (`.wipe` in globals.css);
 * this only marks the moment. The outer box is what is watched, because a fully
 * clipped element never counts as visible. With reduced motion the chart is simply
 * there.
 */
export function DrawReveal({ children }: Readonly<{ children: ReactNode }>) {
  const box = useRef<HTMLDivElement>(null);
  const wipe = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        wipe.current?.setAttribute("data-shown", "");
      },
      { threshold: 0.4 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={box} className="absolute inset-0">
      <div ref={wipe} data-reveal className="wipe absolute inset-0">
        {children}
      </div>
    </div>
  );
}
