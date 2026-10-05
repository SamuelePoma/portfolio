import type { Project } from "./schema";

/**
 * Projects in display order: the featured one, then the most recent first. Facts come
 * from the résumé and from Samuele; anything unknown is left out and listed as a
 * question in the local content to-do list.
 */
export const projects = [
  {
    slug: "musetrail",
    title: "MuseTrail",
    category: "Team project",
    period: { start: "2024-11", end: "2025-01" },
    status: "completed",
    tagline: "A web app that promotes sustainable digital habits among young adults.",
    role: "Frontend and backend development, team lead",
    team: 5,
    stack: ["SvelteKit", "Docker"],
    highlight: "Grand prize · Dragons' Den",
    featured: true,
    card: { type: "screenshot", slot: "IMG-MUSETRAIL-01" },
    media: {
      hero: "IMG-MUSETRAIL-01",
      secondary: "IMG-MUSETRAIL-02",
      screens: ["IMG-MUSETRAIL-01", "IMG-MUSETRAIL-03"],
    },
  },
  {
    slug: "progmatic-ai-knowledge-assistant",
    title: "AI knowledge assistant",
    organisation: "Progmatic",
    category: "Research",
    period: { start: "2026-09" },
    status: "in-progress",
    tagline:
      "A local AI chatbot for Progmatic that will answer questions about the company database, find information, write emails and code, and prepare quotations and budget calculations.",
    role: "Researcher",
    team: 5,
    stack: ["AI", "Document retrieval", "FileMaker"],
    card: { type: "screenshot", slot: "IMG-PROGMATIC-01" },
    media: { hero: "IMG-PROGMATIC-01" },
  },
  {
    slug: "young-dcc-platform",
    title: "Youth climate events platform",
    organisation: "Delta Climate Center",
    category: "Web platform",
    period: { start: "2026-06", end: "2026-06" },
    status: "completed",
    tagline:
      "An online platform, built with the Delta Climate Center, to promote and organise events on environmental themes for young people in Zeeland.",
    stack: [],
    card: { type: "screenshot", slot: "IMG-YOUNGDCC-01" },
    media: { hero: "IMG-YOUNGDCC-01" },
  },
  {
    slug: "conneqtech-gps-dashboard",
    title: "GPS monitoring dashboard",
    organisation: "Conneqtech",
    category: "Internship",
    period: { start: "2024-09", end: "2025-01" },
    status: "completed",
    tagline:
      "A dashboard to track cars and bicycles and see their GPS data and vehicle details in one place. Built end to end during my internship.",
    role: "Software engineering intern",
    stack: ["Go", "Frontend", "Backend"],
    card: { type: "screenshot", slot: "IMG-CONNEQTECH-01" },
    media: { hero: "IMG-CONNEQTECH-01", secondary: "IMG-CONNEQTECH-02" },
  },
  {
    slug: "stedin-grid-monitoring",
    title: "Grid monitoring",
    organisation: "Stedin",
    category: "University project",
    status: "completed",
    tagline:
      "Software for visualising power usage and monitoring faulty transformers across regions of the Netherlands.",
    role: "Team member",
    stack: ["Laravel", "PHP", "MySQL"],
    card: { type: "screenshot", slot: "IMG-STEDIN-01" },
    media: { hero: "IMG-STEDIN-01", secondary: "IMG-STEDIN-02" },
  },
  {
    slug: "chess-game-java",
    title: "Chess in the terminal",
    category: "Java",
    period: { start: "2024-12", end: "2025-01" },
    status: "completed",
    tagline: "A text-based chess game built with object-oriented programming and design patterns.",
    role: "Developer",
    stack: ["Java", "OOP", "Design patterns"],
    card: { type: "terminal" },
    media: {},
  },
  {
    slug: "tower-defense-typescript",
    title: "Tower defense game",
    category: "TypeScript",
    status: "completed",
    tagline: "A tower defense game built with object-oriented TypeScript.",
    stack: ["TypeScript", "OOP"],
    card: { type: "screenshot", slot: "IMG-TOWERDEFENSE-01" },
    media: { hero: "IMG-TOWERDEFENSE-01" },
  },
] as const satisfies readonly Project[];

export type ProjectSlug = (typeof projects)[number]["slug"];
