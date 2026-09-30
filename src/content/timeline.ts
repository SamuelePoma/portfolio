import type { TimelineEntry } from "./schema";

/** Education and experience for the About section, most recent first. */
export const timeline = [
  {
    period: { start: "2023", end: "2027" },
    title: "BSc ICT, Software Engineering",
    organisation: "HZ University of Applied Sciences",
    summary: "Expected graduation in 2027.",
  },
  {
    period: { start: "2024-09", end: "2025-01" },
    title: "Software engineering intern",
    organisation: "Conneqtech",
    summary: "Built a GPS monitoring dashboard, from requirements to delivery.",
  },
  {
    period: { start: "2020", end: "2022" },
    title: "Web development and marketing",
    organisation: "Rondinella & Partners",
    summary: "Managed web development, mailing and marketing.",
  },
] as const satisfies readonly TimelineEntry[];
