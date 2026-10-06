"use client";

import type { CSSProperties, ReactNode, RefObject } from "react";

import { cn } from "@/lib/utils/cn";

import type { PinMode } from "./useSceneProgress";

/**
 * Heights and pinning come from CSS (breakpoint and prefers-reduced-motion), not from
 * JavaScript, so the page has its final length from the first paint and a link to
 * `/#contact` lands where it should.
 */
const pinning: Record<PinMode, { section: string; stage: string }> = {
  always: {
    section: "h-(--scene-height) motion-reduce:h-auto",
    stage: "sticky top-0 h-svh motion-reduce:static motion-reduce:h-auto",
  },
  large: {
    section: "lg:h-(--scene-height) lg:motion-reduce:h-auto",
    stage: "lg:sticky lg:top-0 lg:h-svh lg:motion-reduce:static lg:motion-reduce:h-auto",
  },
};

interface SceneProps {
  sceneRef: RefObject<HTMLElement | null>;
  /** How many screens of scrolling the scene lasts while pinned, e.g. 3 for 300svh. */
  length: number;
  /** Pin on every screen, or from the lg breakpoint up (see useSceneProgress). */
  mode?: PinMode;
  /**
   * The scene is shown in its final state (reduced motion). The stage is rebuilt when
   * this changes: elements that were following the scroll would otherwise keep the
   * last transforms they were given.
   */
  still?: boolean;
  className?: string;
  stageClassName?: string;
  labelledBy?: string;
  tone?: "light" | "night";
  children: ReactNode;
}

/**
 * A pinned scene, like Apple's product pages: a tall section whose stage sticks to the
 * viewport while the visitor scrolls through it, so scrolling drives the animation.
 * Unpinned, it is an ordinary section that animates as it passes.
 */
export function Scene({
  sceneRef,
  length,
  mode = "always",
  still = false,
  className,
  stageClassName,
  labelledBy,
  tone = "light",
  children,
}: Readonly<SceneProps>) {
  return (
    <section
      ref={sceneRef}
      aria-labelledby={labelledBy}
      data-tone={tone}
      className={cn(
        "scene relative",
        pinning[mode].section,
        tone === "night" && "tone-night",
        className,
      )}
      style={{ "--scene-height": `${String(length * 100)}svh` } as CSSProperties}
    >
      <div
        key={still ? "still" : "moving"}
        className={cn("scene-stage overflow-hidden", pinning[mode].stage, stageClassName)}
      >
        {children}
      </div>
    </section>
  );
}
