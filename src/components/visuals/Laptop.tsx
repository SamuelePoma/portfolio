"use client";

import { m, type MotionValue, useTransform } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

interface LaptopProps {
  /**
   * The lid's angle in degrees around the hinge: -90 is closed on the keyboard,
   * 0 is upright, a few degrees more leans it back like an open laptop.
   */
  lid: MotionValue<number>;
  /** The screen: a `fill` image positioned against it. */
  screen: ReactNode;
  /**
   * What the laptop stands on. On a dark band the screen's light spills behind it; on
   * a light section there is no glow (DESIGN.md §3.2) and the floor shadow is softer.
   */
  surface?: "night" | "light";
  className?: string;
}

/** Keys: thin dark gaps in both directions over the deck's keyboard well. */
const keys =
  "bg-[repeating-linear-gradient(90deg,transparent_0_5.6%,rgb(0_0_0/0.55)_5.6%_6.25%),repeating-linear-gradient(180deg,transparent_0_15%,rgb(0_0_0/0.55)_15%_16.6%)]";

/**
 * A laptop drawn in CSS 3D (DESIGN.md §8.5): a lid with a screen on one face and
 * brushed metal on the other, hinged to a keyboard deck seen from slightly above.
 * As the lid opens the screen wakes up, a glare slides across the glass and its
 * light spills onto the space behind. No WebGL: just transforms.
 */
export function Laptop({ lid, screen, surface = "night", className }: Readonly<LaptopProps>) {
  const screenOff = useTransform(lid, [-60, -12], [1, 0]);
  const spill = useTransform(lid, [-40, 8], [0, 0.6]);
  const glare = useTransform(lid, [-70, 8], ["-80%", "70%"]);

  return (
    <div className={cn("relative [perspective:4400px]", className)}>
      {/* The screen's light on the space behind the laptop. A gradient already fades
          to nothing, so it needs no blur filter (a large one repaints on every frame). */}
      {surface === "night" && (
        <m.div
          aria-hidden
          className="pointer-events-none absolute inset-x-[4%] top-[8%] -z-10 h-[70%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(64_180_150/0.5),rgb(0_124_240/0.22)_55%,transparent)]"
          style={{ opacity: spill }}
        />
      )}

      {/* The camera: a little above the laptop, looking down at the deck. */}
      <div className="relative [transform:rotateX(-5deg)] preserve-3d">
        <m.div
          className="relative aspect-[16/10.7] w-full origin-bottom preserve-3d"
          style={{ rotateX: lid }}
        >
          {/* Screen face. */}
          <div className="absolute inset-0 rounded-t-[2.4%] bg-[#0b0b0c] p-[1.8%] pb-[2.6%] ring-1 ring-white/10 backface-hidden">
            {/* The camera in the top bezel. */}
            <span className="absolute top-[0.7%] left-1/2 size-[0.55%] min-h-1 min-w-1 -translate-x-1/2 rounded-full bg-[#1d1d20] ring-1 ring-white/5" />
            <div className="bg-black relative h-full overflow-hidden rounded-[0.6%]">
              {screen}
              <m.div className="bg-black absolute inset-0" style={{ opacity: screenOff }} />
              {/* A glare sliding across the glass as the lid opens. */}
              <m.div
                className="pointer-events-none absolute inset-y-0 w-[60%] bg-[linear-gradient(105deg,transparent,rgb(255_255_255/0.10)_45%,transparent_70%)]"
                style={{ x: glare }}
              />
            </div>
          </div>
          {/* Lid back: what you see from above when it is closed. */}
          <div className="absolute inset-0 [transform:rotateY(180deg)] rounded-t-[2.4%] bg-[linear-gradient(180deg,#3d3d40,#232325)] ring-1 ring-white/10 backface-hidden" />
        </m.div>

        {/* Keyboard deck, flat, reaching towards the viewer: as wide as the lid at the
            hinge, like the real thing, so perspective widens only its near edge. */}
        <div className="absolute top-full left-0 aspect-[16/6.4] w-full origin-top [transform:rotateX(90deg)] preserve-3d">
          <div className="absolute inset-0 rounded-b-[4%] bg-[linear-gradient(180deg,#2a2a2d,#3a3a3d)] ring-1 ring-white/10">
            {/* The hinge. */}
            <div className="bg-black/40 absolute inset-x-[12%] top-0 h-[4%] rounded-b-sm" />
            <div
              className={cn(
                "bg-black/20 absolute inset-x-[10%] top-[10%] h-[50%] rounded-[1.5%] opacity-80",
                keys,
              )}
            />
            <div className="bg-black/20 absolute top-[66%] left-1/2 h-[28%] w-[36%] -translate-x-1/2 rounded-[4%] ring-1 ring-white/5" />
          </div>
          {/* The front edge, facing the viewer. */}
          <div className="absolute inset-x-0 top-full h-[3%] origin-top [transform:rotateX(-90deg)] rounded-b-md bg-[#1c1c1e]" />
        </div>
      </div>

      {/* Contact shadow on the floor: a soft gradient ellipse rather than a blurred one. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 -bottom-[20%] -z-10 h-[18%]",
          surface === "night"
            ? "bg-[radial-gradient(closest-side,rgb(0_0_0/0.7),rgb(0_0_0/0.35)_55%,transparent)]"
            : "bg-[radial-gradient(closest-side,rgb(0_0_0/0.28),rgb(0_0_0/0.1)_55%,transparent)]",
        )}
      />
    </div>
  );
}
