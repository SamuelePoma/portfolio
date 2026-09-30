import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils/cn";

/** Technology tag: mono, hairline ring, no fill (DESIGN.md §8.4). */
export function Tag({ className, ...props }: ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-1 font-mono text-mono-label font-normal tracking-normal text-ink-secondary ring-1 ring-hairline ring-inset",
        className,
      )}
      {...props}
    />
  );
}

/** A list of tags with list semantics, so screen readers announce the count. */
export function TagList({ tags, className }: { tags: readonly string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => (
        <li key={tag}>
          <Tag>{tag}</Tag>
        </li>
      ))}
    </ul>
  );
}
