import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils/cn";

const spacings = {
  /** Top and bottom: dark bands, and the last light section before one. */
  default: "section-y",
  /** Top only: consecutive light sections, so each gap is one unit, not two. */
  top: "section-t",
  none: undefined,
} as const;

interface SectionProps extends ComponentPropsWithoutRef<"section"> {
  /** `night` renders a dark band: every token inside is remapped by `.tone-night`. */
  tone?: "light" | "night";
  /** Fluid section padding from DESIGN.md §5.1. */
  spacing?: keyof typeof spacings;
}

export function Section({
  tone = "light",
  spacing = "default",
  className,
  ...props
}: Readonly<SectionProps>) {
  return (
    <section
      data-tone={tone}
      className={cn(tone === "night" && "tone-night", spacings[spacing], className)}
      {...props}
    />
  );
}
