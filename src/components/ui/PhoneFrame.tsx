import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

interface PhoneFrameProps {
  className?: string;
  /** The screen: a `fill` image or a placeholder, positioned against the screen. */
  children: ReactNode;
}

/**
 * A phone drawn in CSS around a 1170 × 2532 screen (DESIGN.md §8.5). Sized by its
 * parent's height or width; the bezel and corner radii are percentages, so it scales
 * cleanly. Always dark: `tone-night` remaps the tokens even on a light section.
 */
export function PhoneFrame({ className, children }: Readonly<PhoneFrameProps>) {
  return (
    <div
      className={cn(
        "tone-night relative aspect-[1270/2632] rounded-[15%/7.26%] bg-surface ring-1 ring-hairline-strong",
        className,
      )}
    >
      {/* Side buttons: action and volume on the left, power on the right. */}
      <span
        aria-hidden
        className="absolute top-[17%] -left-[1.2%] h-[4%] w-[1.2%] rounded-l-sm bg-hairline-strong"
      />
      <span
        aria-hidden
        className="absolute top-[24%] -left-[1.2%] h-[7%] w-[1.2%] rounded-l-sm bg-hairline-strong"
      />
      <span
        aria-hidden
        className="absolute top-[33%] -left-[1.2%] h-[7%] w-[1.2%] rounded-l-sm bg-hairline-strong"
      />
      <span
        aria-hidden
        className="absolute top-[26%] -right-[1.2%] h-[11%] w-[1.2%] rounded-r-sm bg-hairline-strong"
      />
      {/* 50px bezel on a 1270 × 2632 body: 3.94% of the width, 1.9% of the height. */}
      <div className="absolute inset-x-[3.94%] inset-y-[1.9%] overflow-hidden rounded-[12%/5.57%] bg-canvas">
        {children}
        {/* Glass: a faint diagonal sheen over the screen. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgb(255_255_255/0.12),transparent_35%)]"
        />
        <span
          aria-hidden
          className="absolute top-[1.4%] left-1/2 h-[3.4%] w-[30%] -translate-x-1/2 rounded-full bg-canvas"
        />
      </div>
    </div>
  );
}
