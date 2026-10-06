"use client";

import { m, useTransform } from "motion/react";
import { type ReactNode, useRef } from "react";

import { Container } from "@/components/layout/Container";
import { Glow } from "@/components/motion/Glow";
import { Scene } from "@/components/motion/Scene";
import { useSceneProgress } from "@/components/motion/useSceneProgress";

interface HeroSceneProps {
  eyebrow: string;
  lead: string;
  actions: ReactNode;
}

/**
 * How many screens the opening lasts. The light section after it overlaps the last
 * screen (`-mt-[100svh]` in SelectedWork), sliding up over the pinned stage like a
 * sheet, so the sunrise runs until (LENGTH - 2) / (LENGTH - 1) and the rest is the cover.
 */
const LENGTH = 2.6;
const COVER = (LENGTH - 2) / (LENGTH - 1);

/**
 * The opening scene (DESIGN.md §7.3.1): the name over a dark horizon lit from behind.
 * Scrolling is a sunrise: the light climbs and swells while the horizon sinks away and
 * the name drifts up. Then the light work section slides up over it and the opening
 * steps back into the dark. With reduced motion it is simply shown.
 */
export function HeroScene({ eyebrow, lead, actions }: Readonly<HeroSceneProps>) {
  const ref = useRef<HTMLElement>(null);
  const { progress, still } = useSceneProgress(ref);

  const lightY = useTransform(progress, [0, COVER], ["0vh", "-12vh"]);
  const lightScale = useTransform(progress, [0, COVER], [1, 1.18]);
  const horizonY = useTransform(progress, [0, COVER], ["0vh", "12vh"]);
  const nameY = useTransform(progress, [0, 1], [0, -90]);
  const nameScale = useTransform(progress, [COVER, 1], [1, 0.95]);
  const dim = useTransform(progress, [COVER, 1], [0, 0.65]);

  return (
    <Scene
      sceneRef={ref}
      still={still}
      length={LENGTH}
      tone="night"
      labelledBy="hero-title"
      className="-mt-16"
      stageClassName={still ? "horizon relative isolate pt-40 pb-56" : "horizon relative isolate"}
    >
      {/* Layers that follow the scroll are composited (will-change), so the GPU only
          moves them instead of repainting them on every frame. */}
      <m.div
        className="absolute inset-0 -z-10 will-change-transform"
        style={still ? {} : { y: lightY, scale: lightScale }}
      >
        <Glow variant="hero" planet={false} />
      </m.div>
      <m.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 will-change-transform"
        style={still ? {} : { y: horizonY }}
      >
        <div className="horizon-planet" />
      </m.div>

      <m.div
        className={still ? "" : "absolute inset-x-0 top-[22%] sm:top-[24%]"}
        style={still ? {} : { y: nameY, scale: nameScale }}
      >
        <Container>
          <p className="font-mono text-mono-label text-ink-tertiary uppercase">{eyebrow}</p>
          <h1 id="hero-title" className="mt-6 text-display-xl">
            <span className="name-shine block sm:inline-block">Samuele</span>{" "}
            <span className="name-shine block sm:inline-block">Poma.</span>
          </h1>
          <p className="mt-8 max-w-[32ch] text-lead text-ink-secondary">{lead}</p>
          <div className="mt-10 flex flex-wrap gap-3">{actions}</div>
        </Container>
      </m.div>

      {!still && (
        <m.div
          aria-hidden
          className="bg-black pointer-events-none absolute inset-0 will-change-[opacity]"
          style={{ opacity: dim }}
        />
      )}
    </Scene>
  );
}
