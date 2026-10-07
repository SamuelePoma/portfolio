"use client";

import { m, type MotionValue, useTransform } from "motion/react";
import { type ReactNode, useRef } from "react";

import { Container } from "@/components/layout/Container";
import { Scene } from "@/components/motion/Scene";
import { useIsLarge, useSceneProgress } from "@/components/motion/useSceneProgress";
import { cn } from "@/lib/utils/cn";

/** Where each layer sits in the screenshot, in percent of its 1920 × 1080 frame. */
const placement = [
  "inset-0",
  "left-0 top-0 h-full w-[12.4%]",
  "left-[12.4%] top-[5.74%] h-[20.74%] w-[87.6%]",
  "left-[12.4%] top-0 h-[5.74%] w-[87.6%]",
] as const;

/** How far each layer lifts off the one below, in px, when the interface comes apart. */
const lift = [0, 120, 230, 330] as const;

interface LayerProps {
  progress: MotionValue<number>;
  index: number;
  /** Small screens lift the layers less, so they stay inside the stage. */
  depth: number;
  children: ReactNode;
}

function Layer({ progress, index, depth, children }: Readonly<LayerProps>) {
  const height = (lift[index] ?? 0) * depth;
  const z = useTransform(progress, [0.38, 0.62, 0.84, 0.98], [0, height, height, 0]);
  return (
    <m.div
      className={cn(
        "absolute overflow-hidden preserve-3d",
        placement[index],
        index > 0 && "shadow-[0_24px_48px_-12px_rgb(0_0_0/0.45)] ring-1 ring-white/10",
      )}
      style={{ z }}
    >
      {children}
    </m.div>
  );
}

interface LegendItemProps {
  progress: MotionValue<number>;
  index: number;
  label: string;
  text: string;
}

/** A legend line that slides in as its layer lifts. */
function LegendItem({ progress, index, label, text }: Readonly<LegendItemProps>) {
  const start = 0.42 + index * 0.05;
  // Hidden, not dimmed, until its layer lifts: dimmed text would fail contrast.
  const opacity = useTransform(progress, [start, start + 0.08], [0, 1]);
  const x = useTransform(progress, [start, start + 0.08], [24, 0]);
  return (
    <m.li
      data-reveal
      className="flex flex-col gap-1 border-t border-hairline pt-3"
      style={{ opacity, x }}
    >
      <span className="font-mono text-mono-label text-ink-tertiary uppercase">{label}</span>
      <span className="text-small text-ink-secondary">{text}</span>
    </m.li>
  );
}

interface ProgmaticSceneProps {
  titleId: string;
  copy: ReactNode;
  layers: readonly { id: string; label: string; text: string; image: ReactNode }[];
}

/**
 * The assistant as an exploded view (DESIGN.md §7.3.2): the interface tilts into an
 * isometric view, comes apart into its layers, each one named, then clicks back
 * together.
 */
export function ProgmaticScene({ titleId, copy, layers }: Readonly<ProgmaticSceneProps>) {
  const ref = useRef<HTMLElement>(null);
  const { progress, still } = useSceneProgress(ref, "large");
  const depth = useIsLarge() ? 1 : 0.45;

  const rotateX = useTransform(progress, [0.14, 0.38, 0.84, 0.98], [0, 46, 46, 0]);
  const rotateZ = useTransform(progress, [0.14, 0.38, 0.84, 0.98], [0, -26, -26, 0]);
  const scale = useTransform(progress, [0, 0.14, 0.38, 0.84, 0.98], [0.86, 1, 0.86, 0.86, 1]);
  const y = useTransform(progress, [0, 0.14], ["12%", "0%"]);

  return (
    <Scene
      sceneRef={ref}
      still={still}
      length={3.2}
      mode="large"
      labelledBy={titleId}
      className="overflow-x-clip"
      stageClassName="flex items-center py-24 lg:py-0"
    >
      <Container className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-6 lg:col-span-4">
          {copy}
          <ol className="flex flex-col gap-3">
            {layers.map((layer, index) => (
              <LegendItem
                key={layer.id}
                progress={progress}
                index={index}
                label={layer.label}
                text={layer.text}
              />
            ))}
          </ol>
        </div>

        <div className="relative mt-10 mb-6 [perspective:2400px] lg:col-span-8 lg:my-0">
          <m.div
            className="relative aspect-video w-full overflow-visible rounded-lg preserve-3d"
            style={still ? {} : { rotateX, rotateZ, scale, y }}
          >
            {layers.map((layer, index) => (
              <Layer key={layer.id} progress={progress} index={index} depth={depth}>
                {layer.image}
              </Layer>
            ))}
          </m.div>
        </div>
      </Container>
    </Scene>
  );
}
