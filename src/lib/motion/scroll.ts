type Edge = "start" | "center" | "end" | `${number}`;

/**
 * Where a scroll track starts or ends: "<element edge> <viewport edge>", e.g.
 * "start end" is the moment the element's top meets the bottom of the viewport.
 * An edge is start, center, end, or a fraction such as 0.75.
 */
type ScrollEdge = `${Edge} ${Edge}`;
export type ScrollOffset = readonly [ScrollEdge, ScrollEdge];

const named: Record<string, number> = { start: 0, center: 0.5, end: 1 };

function fraction(edge: string): number {
  const value = named[edge] ?? Number(edge);
  if (!Number.isFinite(value)) throw new Error(`Unknown scroll edge "${edge}".`);
  return value;
}

/** How much further the page has to scroll until `edge` is reached (negative once past). */
function distanceTo(edge: ScrollEdge, top: number, height: number, viewport: number): number {
  const [element = "", screen = ""] = edge.split(" ");
  return top + fraction(element) * height - fraction(screen) * viewport;
}

/**
 * How far through its scroll track an element is, from 0 to 1, given where it sits in
 * the viewport right now (`top` and `height`, as from getBoundingClientRect).
 */
export function scrollProgress(
  { top, height }: { top: number; height: number },
  viewport: number,
  [from, to]: ScrollOffset,
): number {
  const start = distanceTo(from, top, height, viewport);
  const end = distanceTo(to, top, height, viewport);
  if (end === start) return start <= 0 ? 1 : 0;
  return Math.min(1, Math.max(0, -start / (end - start)));
}
