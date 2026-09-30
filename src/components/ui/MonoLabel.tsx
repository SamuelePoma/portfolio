import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils/cn";

const tones = {
  default: "text-ink-tertiary",
  /** Reserved for real signals, such as the award label (DESIGN.md §3.2). */
  accent: "text-accent",
} as const;

interface MonoLabelProps extends ComponentPropsWithoutRef<"span"> {
  as?: "span" | "p" | "div" | "h3";
  tone?: keyof typeof tones;
}

/** Uppercase mono metadata: eyebrows, dates, context lines (DESIGN.md §8.3). */
export function MonoLabel({
  as: Element = "span",
  tone = "default",
  className,
  ...props
}: Readonly<MonoLabelProps>) {
  return (
    <Element
      className={cn("font-mono text-mono-label uppercase tabular", tones[tone], className)}
      {...props}
    />
  );
}
