import type { CSSProperties } from "react";

import { cn } from "@/lib/utils/cn";

/**
 * The component architecture of the veterinary practice system, redrawn from the
 * team's component diagram (users, the two front ends, the shared authorisation
 * layer, the services and the shared database). Positions are percentages of a
 * 16:11 box, so the drawing scales with its container.
 */

type Tone = "default" | "ink" | "external";

interface DiagramNode {
  id: string;
  label: string;
  x: number;
  y: number;
  row: number;
  tone?: Tone;
}

const nodes: readonly DiagramNode[] = [
  { id: "client", label: "Client", x: 13, y: 8, row: 0 },
  { id: "receptionist", label: "Receptionist", x: 35, y: 8, row: 0 },
  { id: "vet", label: "Veterinarian", x: 59, y: 8, row: 0 },
  { id: "lab", label: "Laboratorium Centraal", x: 86, y: 8, row: 0, tone: "external" },
  { id: "booking", label: "Booking UI", x: 28, y: 29, row: 1 },
  { id: "clinicalUi", label: "Clinical records UI", x: 62, y: 29, row: 1 },
  { id: "auth", label: "Authentication & authorisation", x: 45, y: 50, row: 2, tone: "ink" },
  { id: "appointments", label: "Appointments", x: 9, y: 71, row: 3 },
  { id: "clinical", label: "Clinical records", x: 28, y: 71, row: 3 },
  { id: "medication", label: "Medication", x: 47, y: 71, row: 3 },
  { id: "stock", label: "Stock", x: 64, y: 71, row: 3 },
  { id: "labIntegration", label: "Lab integration", x: 86, y: 71, row: 3 },
  { id: "db", label: "Shared database", x: 45, y: 92, row: 4, tone: "ink" },
];

const edges: readonly (readonly [string, string])[] = [
  ["client", "booking"],
  ["receptionist", "booking"],
  ["vet", "booking"],
  ["vet", "clinicalUi"],
  ["booking", "auth"],
  ["clinicalUi", "auth"],
  ["auth", "appointments"],
  ["auth", "clinical"],
  ["auth", "medication"],
  ["auth", "stock"],
  ["auth", "labIntegration"],
  ["lab", "labIntegration"],
  ["medication", "stock"],
  ["appointments", "db"],
  ["clinical", "db"],
  ["medication", "db"],
  ["stock", "db"],
  ["labIntegration", "db"],
];

const byId = new Map(nodes.map((node) => [node.id, node]));

/** A soft S-curve between two node centres; the nodes sit on top of the ends. */
/** x and y in percent to the drawing's 160 × 110 units (the box is 16:11). */
const px = (x: number) => x * 1.6;
const py = (y: number) => y * 1.1;

/** A soft S-curve between two node centres; the nodes sit on top of the ends. */
function curve(from: DiagramNode, to: DiagramNode): string {
  const [x1, y1, x2, y2] = [px(from.x), py(from.y), px(to.x), py(to.y)];
  if (from.y === to.y) return `M ${String(x1)} ${String(y1)} L ${String(x2)} ${String(y2)}`;
  const mid = (y1 + y2) / 2;
  return `M ${String(x1)} ${String(y1)} C ${String(x1)} ${String(mid)}, ${String(x2)} ${String(mid)}, ${String(x2)} ${String(y2)}`;
}

const tones: Record<Tone, string> = {
  default: "bg-surface text-ink-secondary ring-1 ring-hairline-strong ring-inset",
  ink: "bg-ink text-canvas",
  external: "border border-dashed border-ink-tertiary bg-canvas text-ink-secondary",
};

interface VetComponentsDiagramProps {
  className?: string;
}

export function VetComponentsDiagram({ className }: Readonly<VetComponentsDiagramProps>) {
  return (
    <div
      role="img"
      aria-label="Component architecture: clients, receptionists and veterinarians use a booking UI and a clinical records UI; authentication and authorisation guard the appointment, clinical record, medication, stock and laboratory integration services, which share one database; Laboratorium Centraal sends HL7 v2.5 results to the laboratory integration."
      className={cn("@container relative isolate aspect-[16/11] w-full", className)}
    >
      <svg
        aria-hidden
        viewBox="0 0 160 110"
        className="absolute inset-0 -z-10 size-full overflow-visible"
      >
        {edges.map(([fromId, toId]) => {
          const from = byId.get(fromId);
          const to = byId.get(toId);
          if (!from || !to) return null;
          return (
            <path
              key={`${fromId}-${toId}`}
              d={curve(from, to)}
              pathLength={1}
              fill="none"
              className="draw-line stroke-hairline-strong"
              strokeWidth={0.35}
              style={{ "--i": from.row } as CSSProperties}
            />
          );
        })}
      </svg>

      <span
        aria-hidden
        className="absolute top-[39%] left-[86%] -translate-x-1/2 -translate-y-1/2 rounded-sm bg-canvas px-[0.6cqw] font-mono text-[max(8px,1.2cqw)] whitespace-nowrap text-ink-tertiary"
      >
        HL7 v2.5 ORU
      </span>

      {nodes.map((node) => (
        <span
          key={node.id}
          aria-hidden
          className={cn(
            "rise-in absolute -translate-x-1/2 -translate-y-1/2 rounded-sm px-[1cqw] py-[0.55cqw] font-mono text-[max(8px,1.35cqw)] whitespace-nowrap",
            tones[node.tone ?? "default"],
          )}
          style={
            {
              left: `${String(node.x)}%`,
              top: `${String(node.y)}%`,
              "--i": node.row,
            } as CSSProperties
          }
        >
          {node.label}
        </span>
      ))}
    </div>
  );
}
