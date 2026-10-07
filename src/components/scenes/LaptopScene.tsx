"use client";

import { m, useTransform } from "motion/react";
import { type ReactNode, useRef } from "react";

import { Container } from "@/components/layout/Container";
import { Scene } from "@/components/motion/Scene";
import { useSceneProgress } from "@/components/motion/useSceneProgress";
import { Laptop } from "@/components/visuals/Laptop";

interface LaptopSceneProps {
  /** Id of the heading inside `copy`, which names the scene. */
  titleId: string;
  /** The project's text: label, title, one-liner and link. */
  copy: ReactNode;
  /** The laptop's screen content. */
  screen: ReactNode;
}

/**
 * A web project presented like a MacBook launch (DESIGN.md §7.3.2): on the light page,
 * under the headline, a closed laptop rises into place, its lid opens on the hinge, the
 * screen wakes up on the real product, and it leans in a touch. Pinned on
 * every screen: the text is short. With reduced motion it is simply shown, open.
 */
export function LaptopScene({ titleId, copy, screen }: Readonly<LaptopSceneProps>) {
  const ref = useRef<HTMLElement>(null);
  const { progress, still } = useSceneProgress(ref);

  // The closed laptop already shows at the bottom as the scene arrives, then rises.
  const laptopY = useTransform(progress, [0, 0.3], ["14vh", "0vh"]);
  const laptopScale = useTransform(progress, [0, 0.36, 0.62, 1], [0.86, 1, 1, 1.04]);
  // -88, not -90: closed flat on the deck, the lid and the keys would flicker in turn.
  const lid = useTransform(progress, [0.2, 0.54], [-88, 8]);

  return (
    <Scene
      sceneRef={ref}
      still={still}
      length={3}
      labelledBy={titleId}
      className="overflow-x-clip"
      stageClassName={still ? "flex flex-col gap-16 py-24" : "flex flex-col"}
    >
      <Container className="pt-24 md:pt-24">
        <div className="mx-auto flex max-w-[64rem] flex-col items-center gap-5 text-center">
          {copy}
        </div>
      </Container>

      {/* A size container: the laptop takes the room the text leaves, at most 134% of
          its height (a laptop is about 0.75 times as tall as it is wide). */}
      <div
        className={
          still
            ? "flex justify-center"
            : "[container-type:size] flex min-h-0 flex-1 items-center justify-center pt-4 pb-[5svh]"
        }
      >
        <m.div
          className="will-change-transform"
          style={still ? {} : { y: laptopY, scale: laptopScale }}
        >
          <Laptop
            lid={lid}
            screen={screen}
            surface="light"
            className={still ? "w-[min(86vw,760px)]" : "w-[min(86vw,820px,134cqh)]"}
          />
        </m.div>
      </div>
    </Scene>
  );
}
