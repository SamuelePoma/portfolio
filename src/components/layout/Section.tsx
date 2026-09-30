import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils/cn";

interface SectionProps extends ComponentPropsWithoutRef<"section"> {
  /** `night` renders a dark band: every token inside is remapped by `.tone-night`. */
  tone?: "light" | "night";
  /** `default` applies the fluid section padding from DESIGN.md §5.1. */
  spacing?: "default" | "none";
}

export function Section({
  tone = "light",
  spacing = "default",
  className,
  ...props
}: SectionProps) {
  return (
    <section
      data-tone={tone}
      className={cn(
        tone === "night" && "tone-night",
        spacing === "default" && "section-y",
        className,
      )}
      {...props}
    />
  );
}
