"use client";

import { m, type MotionValue, useTransform } from "motion/react";
import { type ReactNode, useRef } from "react";

import { Container } from "@/components/layout/Container";
import { Scene } from "@/components/motion/Scene";
import { useSceneProgress } from "@/components/motion/useSceneProgress";
import { PhoneFrame } from "@/components/ui/PhoneFrame";

/** Where each artwork settles around the phones: offsets in vmin, depth in px. */
const artTargets = [
  { x: -27, y: -27, z: 260, rotate: -8 },
  { x: 36, y: -24, z: 180, rotate: 7 },
  { x: -30, y: 22, z: 340, rotate: 5 },
  { x: 37, y: 20, z: 230, rotate: -6 },
] as const;

interface ArtProps {
  progress: MotionValue<number>;
  index: number;
  children: ReactNode;
}

/** One artwork leaving the screen: from the phone's face out into the space around it. */
function Art({ progress, index, children }: Readonly<ArtProps>) {
  const target = artTargets[index] ?? artTargets[0];
  const start = 0.52 + index * 0.05;
  const range = [start, start + 0.22];
  const x = useTransform(progress, range, ["0vmin", `${String(target.x)}vmin`]);
  const y = useTransform(progress, range, ["0vmin", `${String(target.y)}vmin`]);
  const z = useTransform(progress, range, [0, target.z]);
  const scale = useTransform(progress, range, [0.4, 1]);
  const rotate = useTransform(progress, range, [0, target.rotate]);
  const opacity = useTransform(progress, [start, start + 0.06], [0, 1]);

  return (
    <m.div
      className="absolute top-1/2 left-1/2 -mt-[8vmin] -ml-[7vmin] w-[14vmin] overflow-hidden rounded-[1.4vmin] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)] ring-1 ring-white/15"
      style={{ x, y, z, scale, rotate, opacity }}
    >
      {children}
    </m.div>
  );
}

interface MuseTrailSceneProps {
  titleId: string;
  /** The text column: label, title, tagline, facts and the link. */
  copy: ReactNode;
  front: ReactNode;
  back: ReactNode;
  /** The four artworks from the My Museum screen. */
  art: readonly ReactNode[];
}

/**
 * The featured project as a product reveal (DESIGN.md §7.3.2): two phones swing round
 * to face the visitor, part, and the artworks of the user's museum float out of the
 * screen into the space around them.
 */
export function MuseTrailScene({ titleId, copy, front, back, art }: Readonly<MuseTrailSceneProps>) {
  const ref = useRef<HTMLElement>(null);
  const { progress, still } = useSceneProgress(ref, "large");

  const copyOpacity = useTransform(progress, [0.02, 0.16], [0, 1]);
  const copyY = useTransform(progress, [0.02, 0.16], [40, 0]);

  const phonesY = useTransform(progress, [0, 0.32], ["45svh", "0svh"]);
  const frontRotateY = useTransform(progress, [0, 0.34, 0.55], [-62, -8, -16]);
  const backRotateY = useTransform(progress, [0.04, 0.38, 0.55], [-70, -12, 16]);
  const tilt = useTransform(progress, [0, 0.34], [16, 4]);
  const frontX = useTransform(progress, [0.34, 0.55], ["6%", "-58%"]);
  const backX = useTransform(progress, [0.34, 0.55], ["-4%", "62%"]);
  const backScale = useTransform(progress, [0.34, 0.55], [0.9, 0.94]);
  // Depth keeps the phones apart while they turn: the back one starts well behind, so
  // the two never pass through each other, then comes forward as they part.
  const frontZ = useTransform(progress, [0, 0.55], [60, 0]);
  const backZ = useTransform(progress, [0, 0.34, 0.55], [-320, -260, -40]);
  const shadowOpacity = useTransform(progress, [0.1, 0.4], [0, 0.8]);
  const shadowScale = useTransform(progress, [0.34, 0.55], [0.55, 1]);

  return (
    <Scene
      sceneRef={ref}
      length={3.4}
      mode="large"
      tone="night"
      labelledBy={titleId}
      className="overflow-x-clip"
      stageClassName="flex items-center py-24 lg:py-0"
    >
      <Container className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <m.div
          className="relative z-10 flex flex-col gap-6 lg:col-span-4"
          style={still ? {} : { opacity: copyOpacity, y: copyY }}
        >
          {copy}
        </m.div>

        <div
          className={
            still
              ? "relative h-[70vmin] lg:col-span-8"
              : "relative mx-auto h-[42svh] w-full max-w-[22rem] [perspective:1800px] sm:max-w-none lg:col-span-8 lg:h-[70svh]"
          }
        >
          {/* The phones' shadow on the floor, widening as they part. */}
          <m.div
            aria-hidden
            className="pointer-events-none absolute inset-x-[10%] -bottom-[10%] h-[16%] bg-[radial-gradient(closest-side,rgb(0_0_0/0.9),rgb(0_0_0/0.45)_55%,transparent)]"
            style={still ? { opacity: 0.8 } : { opacity: shadowOpacity, scaleX: shadowScale }}
          />
          <m.div
            className="absolute inset-0 preserve-3d"
            style={still ? {} : { y: phonesY, rotateX: tilt }}
          >
            <m.div
              className="absolute top-[8%] left-1/2 h-[84%] -translate-x-1/2 preserve-3d"
              style={
                still
                  ? { x: "62%", rotateY: 16 }
                  : { x: backX, z: backZ, rotateY: backRotateY, scale: backScale }
              }
            >
              <PhoneFrame className="h-full shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9)]">
                {back}
              </PhoneFrame>
            </m.div>
            <m.div
              className="absolute top-0 left-1/2 h-[92%] -translate-x-1/2 preserve-3d"
              style={
                still
                  ? { x: "-58%", rotateY: -16 }
                  : { x: frontX, z: frontZ, rotateY: frontRotateY }
              }
            >
              <PhoneFrame className="h-full shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9)]">
                {front}
              </PhoneFrame>
            </m.div>
            <div aria-hidden className="pointer-events-none absolute inset-0 preserve-3d">
              {art.map((piece, index) => (
                <Art key={index} progress={progress} index={index}>
                  {piece}
                </Art>
              ))}
            </div>
          </m.div>
        </div>
      </Container>
    </Scene>
  );
}
