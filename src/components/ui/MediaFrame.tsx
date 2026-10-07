import type { ReactNode } from "react";

import type { MediaRatio } from "@/content/media";
import { cn } from "@/lib/utils/cn";

const aspect: Record<MediaRatio, string> = {
  "16:10": "aspect-[16/10]",
  "16:9": "aspect-video",
  "2:1": "aspect-[2/1]",
  "4:5": "aspect-[4/5]",
  "9:19.5": "aspect-[1170/2532]",
};

interface MediaFrameProps {
  /** `browser` for web app screenshots, `plain` for photos (DESIGN.md §8.5). */
  variant?: "browser" | "plain";
  /** A locked aspect ratio, or `fill` to stretch into a sized parent (card trays). */
  ratio: MediaRatio | "fill";
  /** Optional URL shown in the browser bar. Only for real, public URLs. */
  url?: string;
  radius?: "lg" | "xl";
  className?: string;
  /** The media: a `fill` image or a placeholder, positioned against the frame. */
  children: ReactNode;
}

export function MediaFrame({
  variant = "browser",
  ratio,
  url,
  radius = "lg",
  className,
  children,
}: Readonly<MediaFrameProps>) {
  const rounded = radius === "xl" ? "rounded-xl" : "rounded-lg";
  const box = ratio === "fill" ? "flex-1" : aspect[ratio];

  if (variant === "plain") {
    return (
      <div className={cn("relative overflow-hidden bg-surface-sunken", rounded, box, className)}>
        {children}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-ink/5 ring-inset"
        />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col overflow-hidden bg-surface shadow-card", rounded, className)}>
      <div
        aria-hidden
        className="flex h-9 shrink-0 items-center gap-1.5 border-b border-hairline px-3.5"
      >
        <span className="size-2 rounded-full bg-hairline-strong" />
        <span className="size-2 rounded-full bg-hairline-strong" />
        <span className="size-2 rounded-full bg-hairline-strong" />
        {url && (
          <span className="mx-auto max-w-[60%] truncate rounded-sm bg-surface-sunken px-3 py-0.5 font-mono text-caption text-ink-tertiary">
            {url}
          </span>
        )}
      </div>
      <div className={cn("relative bg-surface-sunken", box)}>{children}</div>
    </div>
  );
}
