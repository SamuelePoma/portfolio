"use client";

import { m, useTransform } from "motion/react";
import { type ReactNode, useRef } from "react";

import { Container } from "@/components/layout/Container";
import { Glow } from "@/components/motion/Glow";
import { Scene } from "@/components/motion/Scene";
import { useSceneProgress } from "@/components/motion/useSceneProgress";
import { Laptop } from "@/components/visuals/Laptop";

interface HeroSceneProps {
  eyebrow: string;
  lead: string;
  actions: ReactNode;
  /** The laptop's screen content. */
  screen: ReactNode;
  /** Mono caption under the laptop: which project is on screen. */
  caption: string;
}

/**
 * The opening scene (DESIGN.md §7.3.1). The name stands in coloured light; scrolling
 * sends it back, a closed laptop rises from below, opens, and its screen wakes up on
 * a real project. With reduced motion everything is simply shown, open.
 */
export function HeroScene({ eyebrow, lead, actions, screen, caption }: Readonly<HeroSceneProps>) {
  const ref = useRef<HTMLElement>(null);
  const { progress, still } = useSceneProgress(ref);

  const nameOpacity = useTransform(progress, [0.06, 0.3], [1, 0]);
  const nameScale = useTransform(progress, [0, 0.3], [1, 0.92]);
  const nameY = useTransform(progress, [0, 0.3], [0, -80]);
  const laptopY = useTransform(progress, [0.04, 0.42], ["62vh", "0vh"]);
  const laptopScale = useTransform(progress, [0.3, 0.8, 1], [0.86, 1, 1.06]);
  // The last stretch dissolves into the light section that follows.
  const fadeToLight = useTransform(progress, [0.94, 1], [0, 1]);
  const lid = useTransform(progress, [0.4, 0.78], [-90, 8]);
  const captionOpacity = useTransform(progress, [0.78, 0.9], [0, 1]);
  const glowOpacity = useTransform(progress, [0.25, 0.75], [1, 0.55]);

  return (
    <Scene
      sceneRef={ref}
      length={3.4}
      tone="night"
      labelledBy="hero-title"
      className="-mt-16"
      stageClassName={still ? "flex flex-col gap-16 pt-32 pb-24" : "relative isolate"}
    >
      <m.div className="absolute inset-0 -z-10" style={{ opacity: glowOpacity }}>
        <Glow />
      </m.div>

      <m.div
        className={still ? "" : "absolute inset-x-0 bottom-0 pb-16 md:pb-24"}
        style={still ? {} : { opacity: nameOpacity, scale: nameScale, y: nameY }}
      >
        <Container>
          <p className="font-mono text-mono-label text-ink-tertiary uppercase">{eyebrow}</p>
          <h1 id="hero-title" className="mt-6 text-display-xl">
            <span className="block sm:inline-block">Samuele</span>{" "}
            <span className="block sm:inline-block">Poma.</span>
          </h1>
          <p className="mt-8 max-w-[32ch] text-lead text-ink-secondary">{lead}</p>
          <div className="mt-10 flex flex-wrap gap-3">{actions}</div>
        </Container>
      </m.div>

      <m.div
        aria-hidden={!still || undefined}
        className={
          still
            ? "mx-auto w-[min(88vw,880px)]"
            : "absolute inset-0 flex flex-col items-center justify-center gap-10 pt-16"
        }
        style={still ? {} : { y: laptopY, scale: laptopScale }}
      >
        <Laptop lid={lid} screen={screen} className="w-[min(84vw,820px)]" />
        <m.p
          className="mt-[9vw] font-mono text-mono-label text-ink-tertiary uppercase md:mt-[84px]"
          style={still ? {} : { opacity: captionOpacity }}
        >
          {caption}
        </m.p>
      </m.div>
      {!still && (
        <m.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-(--canvas-light)"
          style={{ opacity: fadeToLight }}
        />
      )}
    </Scene>
  );
}
