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
 * How many screens the opening lasts. The light section after it overlaps the last
 * screen (`HERO_OVERLAP` in SelectedWork), sliding up over the pinned laptop like a
 * sheet, so the scene ends at (LENGTH - 2) / (LENGTH - 1) and the rest is the cover.
 */
const LENGTH = 4;
const COVER = (LENGTH - 2) / (LENGTH - 1);

/**
 * The opening scene (DESIGN.md §7.3.1). The name stands over a dark horizon lit from
 * behind. Scrolling sends the name back while a closed laptop rises from behind the
 * horizon like a sunrise, the horizon sinks away, the lid opens and the screen wakes
 * up on a real project. Then the light section slides up over it and the laptop steps
 * back into the dark. With reduced motion everything is simply shown, open.
 */
export function HeroScene({ eyebrow, lead, actions, screen, caption }: Readonly<HeroSceneProps>) {
  const ref = useRef<HTMLElement>(null);
  const { progress, still } = useSceneProgress(ref);

  const nameOpacity = useTransform(progress, [0.02, 0.2], [1, 0]);
  const nameScale = useTransform(progress, [0, 0.2], [1, 0.94]);
  const nameY = useTransform(progress, [0, 0.2], [0, -60]);

  // The sunrise: the laptop climbs from behind the rim while the horizon sinks.
  const laptopY = useTransform(progress, [0.04, 0.4], ["56vh", "0vh"]);
  const horizonY = useTransform(progress, [0.06, 0.44], ["0vh", "40vh"]);
  const lightY = useTransform(progress, [0.06, 0.44], ["0vh", "18vh"]);
  // -88, not -90: closed flat on the deck, the lid and the keys would flicker in turn.
  const lid = useTransform(progress, [0.3, 0.58], [-88, 8]);
  const captionOpacity = useTransform(progress, [0.54, 0.62], [0, 1]);

  // The cover: as the light section slides up, the laptop steps back into the dark.
  const laptopScale = useTransform(progress, [0.28, 0.58, COVER, 1], [0.86, 1, 1, 0.9]);
  const dim = useTransform(progress, [COVER, 1], [0, 0.65]);

  return (
    <Scene
      sceneRef={ref}
      still={still}
      length={LENGTH}
      tone="night"
      labelledBy="hero-title"
      className="-mt-16"
      stageClassName={still ? "flex flex-col gap-16 pt-32 pb-24" : "horizon relative isolate"}
    >
      {/* Layers that follow the scroll are composited (will-change), so the GPU only
          moves them instead of repainting them on every frame. */}
      <m.div
        className="absolute inset-0 -z-10 will-change-transform"
        style={still ? {} : { y: lightY }}
      >
        <Glow variant={still ? "horizon" : "hero"} planet={still} />
      </m.div>

      <m.div
        className={still ? "" : "absolute inset-x-0 top-[22%] sm:top-[24%]"}
        style={still ? {} : { opacity: nameOpacity, scale: nameScale, y: nameY }}
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
          data-reveal
          className="mt-[9vw] font-mono text-mono-label text-ink-tertiary uppercase md:mt-[84px]"
          style={still ? {} : { opacity: captionOpacity }}
        >
          {caption}
        </m.p>
      </m.div>

      {!still && (
        <>
          {/* The horizon, in front of the laptop until it has risen past it. */}
          <m.div
            aria-hidden
            className="pointer-events-none absolute inset-0 will-change-transform"
            style={{ y: horizonY }}
          >
            <div className="horizon-planet" />
          </m.div>
          <m.div
            aria-hidden
            className="bg-black pointer-events-none absolute inset-0 will-change-[opacity]"
            style={{ opacity: dim }}
          />
        </>
      )}
    </Scene>
  );
}
