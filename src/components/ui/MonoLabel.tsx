import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils/cn";

interface MonoLabelProps extends ComponentPropsWithoutRef<"span"> {
  as?: "span" | "p" | "div";
}

/** Uppercase mono metadata: eyebrows, dates, context lines (DESIGN.md §8.3). */
export function MonoLabel({ as: Element = "span", className, ...props }: MonoLabelProps) {
  return (
    <Element
      className={cn("font-mono text-mono-label text-ink-tertiary uppercase tabular", className)}
      {...props}
    />
  );
}
