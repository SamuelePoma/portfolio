import type { MediaRatio } from "@/content/media";
import { cn } from "@/lib/utils/cn";

interface PlaceholderProps {
  slotId: string;
  ratio: MediaRatio;
  description: string;
  className?: string;
}

/**
 * Stand-in for a missing image (DESIGN.md §8.6). Fills its positioned parent and says
 * exactly what belongs there, so it reads as intentional rather than broken.
 */
export function Placeholder({ slotId, ratio, description, className }: PlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={`Image coming soon: ${description}`}
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center gap-1 bg-surface-sunken hatch p-6 text-center",
        className,
      )}
    >
      <span aria-hidden className="font-mono text-mono-label text-ink-tertiary tabular">
        {slotId} · {ratio}
      </span>
      <span aria-hidden className="font-mono text-mono-label font-normal text-ink-tertiary">
        {description}
      </span>
    </div>
  );
}
