import type { CSSProperties } from "react";

import { cn } from "@/lib/utils/cn";

/**
 * The retrieval-augmented generation flow from the project's own README, as a
 * pipeline that snakes over two rows. Each step lights up in turn, like a request
 * travelling through it; the line draws itself as it scrolls into view.
 */
const steps = [
  "Employee",
  "Question in everyday language",
  "Query processing",
  "Search Progmatic's knowledge",
  "Retrieve relevant information",
  "Language model",
  "Generated answer",
  "Sources and references",
] as const;

/** Centres in percent: left to right on the top row, right to left below. */
const positions = [
  [12.5, 25],
  [37.5, 25],
  [62.5, 25],
  [87.5, 25],
  [87.5, 75],
  [62.5, 75],
  [37.5, 75],
  [12.5, 75],
] as const;

interface RagFlowDiagramProps {
  className?: string;
}

export function RagFlowDiagram({ className }: Readonly<RagFlowDiagramProps>) {
  return (
    // The line is a sibling of the list, not inside it: an <ol> may only hold <li>s.
    <div className={cn("@container relative isolate aspect-[16/7] w-full", className)}>
      <svg
        aria-hidden
        viewBox="0 0 160 70"
        className="absolute inset-0 -z-10 size-full overflow-visible"
      >
        <path
          d="M 20 17.5 L 140 17.5 C 158 17.5, 158 52.5, 140 52.5 L 20 52.5"
          pathLength={1}
          fill="none"
          className="draw-line stroke-hairline-strong"
          strokeWidth={0.35}
        />
      </svg>
      <ol
        aria-label="How a question is answered: retrieval-augmented generation"
        className="absolute inset-0"
      >
        {steps.map((step, index) => {
          const [x, y] = positions[index] ?? [0, 0];
          return (
            <li
              key={step}
              className="absolute w-[21%] -translate-x-1/2 -translate-y-1/2 rounded-sm bg-surface px-[1cqw] py-[1.2cqw] text-center font-mono text-[max(9px,1.4cqw)] leading-snug text-ink-secondary ring-1 ring-hairline-strong"
              style={{ left: `${String(x)}%`, top: `${String(y)}%` }}
            >
              {step}
              {/* The pulse passing through this step: a ring that lights up in turn. */}
              <span
                aria-hidden
                className="step-glow pointer-events-none absolute -inset-px rounded-[inherit] ring-2 ring-accent"
                style={{ "--i": index } as CSSProperties}
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
}
