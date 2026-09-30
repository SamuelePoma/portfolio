import { formatPeriod } from "./period";

interface ProjectMetaInput {
  organisation?: string;
  category: string;
  period?: { start: string; end?: string };
}

/**
 * The mono metadata line on a project card: who or what, then when.
 * "Conneqtech · 2024-25", "Stedin · University project", "Java · 2024-25".
 * Never more than one middle dot (DESIGN.md §12).
 */
export function projectMeta({ organisation, category, period }: ProjectMetaInput): string {
  const first = organisation ?? category;
  const second = period ? formatPeriod(period) : organisation ? category : undefined;
  return second === undefined ? first : `${first} · ${second}`;
}
