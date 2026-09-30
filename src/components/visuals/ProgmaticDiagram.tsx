import { cn } from "@/lib/utils/cn";

/** The four areas the research investigates, straight from the project brief. */
const areas = [
  "Document retrieval",
  "FileMaker integration",
  "Access control",
  "Data confidentiality",
] as const;

interface ProgmaticDiagramProps {
  className?: string;
}

function Node({ children, emphasis = false }: Readonly<{ children: string; emphasis?: boolean }>) {
  return (
    <span
      className={cn(
        "inline-flex min-h-9 items-center justify-center rounded-sm px-3 py-1.5 text-center font-mono text-mono-label font-normal ring-1 ring-inset",
        emphasis
          ? "bg-ink text-canvas ring-ink"
          : "bg-surface text-ink-secondary ring-hairline-strong",
      )}
    >
      {children}
    </span>
  );
}

/**
 * Research map for the AI knowledge assistant (DESIGN.md §8.9). It shows the open
 * questions being researched, not an architecture, because none has been chosen yet.
 * Lines are drawn behind the nodes with percentage coordinates, so they follow the
 * grid at any width.
 */
export function ProgmaticDiagram({ className }: Readonly<ProgmaticDiagramProps>) {
  const [topLeft, topRight, bottomLeft, bottomRight] = areas;

  return (
    <div
      role="img"
      aria-label={`Research areas of the knowledge assistant: ${areas.join(", ")}`}
      className={cn("relative isolate w-full max-w-md", className)}
    >
      <svg aria-hidden className="absolute inset-0 -z-10 size-full overflow-visible">
        {[
          ["25%", "15%"],
          ["75%", "15%"],
          ["25%", "85%"],
          ["75%", "85%"],
        ].map(([x, y]) => (
          <line
            key={`${x}-${y}`}
            x1="50%"
            y1="50%"
            x2={x}
            y2={y}
            className="stroke-hairline-strong"
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10">
        <Node>{topLeft}</Node>
        <Node>{topRight}</Node>
        <div className="col-span-2 flex justify-center">
          <Node emphasis>Knowledge assistant</Node>
        </div>
        <Node>{bottomLeft}</Node>
        <Node>{bottomRight}</Node>
      </div>
    </div>
  );
}
