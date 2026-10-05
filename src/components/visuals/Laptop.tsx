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
  className?: string;
}

/**
 * A laptop drawn in CSS 3D (DESIGN.md §8.5): a lid with a screen on one face and
 * brushed metal on the other, hinged to a keyboard deck seen from slightly above.
 * The screen lights up as the lid opens. No WebGL: just transforms.
 */
export function Laptop({ lid, screen, className }: Readonly<LaptopProps>) {
  // The screen is dark while the lid is nearly closed, then wakes up.
  const screenOff = useTransform(lid, [-60, -15], [1, 0]);

  return (
    <div className={cn("[perspective:2600px]", className)}>
      {/* The camera: a little above the laptop, looking down at the deck. */}
      <div className="relative [transform:rotateX(-9deg)] preserve-3d">
        <m.div
          className="relative aspect-[16/10.7] w-full origin-bottom preserve-3d"
          style={{ rotateX: lid }}
        >
          {/* Screen face. */}
          <div className="absolute inset-0 rounded-t-[2.4%] bg-[#0b0b0c] p-[1.8%] pb-[2.6%] ring-1 ring-white/10 backface-hidden">
            <div className="bg-black relative h-full overflow-hidden rounded-[0.6%]">
              {screen}
              <m.div className="bg-black absolute inset-0" style={{ opacity: screenOff }} />
              {/* A soft reflection across the glass. */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgb(255_255_255/0.08),transparent_38%)]" />
            </div>
          </div>
          {/* Lid back: what you see from above when it is closed. */}
          <div className="absolute inset-0 [transform:rotateY(180deg)] rounded-t-[2.4%] bg-[linear-gradient(180deg,#3a3a3d,#232325)] ring-1 ring-white/10 backface-hidden" />
        </m.div>

        {/* Keyboard deck, flat and reaching towards the viewer from the hinge. */}
        <div className="absolute top-full left-[-3%] aspect-[16/7.5] w-[106%] origin-top [transform:rotateX(90deg)] preserve-3d">
          <div className="absolute inset-0 rounded-b-[3%] bg-[linear-gradient(180deg,#2c2c2f,#3b3b3e)] ring-1 ring-white/10">
            <div className="absolute inset-x-[9%] top-[7%] h-[48%] rounded-[1.5%] bg-[repeating-linear-gradient(90deg,rgb(0_0_0/0.35)_0_6.4%,transparent_6.4%_7.2%)] opacity-70" />
            <div className="bg-black/25 absolute top-[62%] left-1/2 h-[30%] w-[38%] -translate-x-1/2 rounded-[3%] ring-1 ring-white/5" />
          </div>
          {/* The front edge, facing the viewer. */}
          <div className="absolute inset-x-0 top-full h-[2.2%] origin-top [transform:rotateX(-90deg)] rounded-b-md bg-[#1c1c1e]" />
        </div>
      </div>
    </div>
  );
}
