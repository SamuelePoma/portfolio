import type { Project } from "./schema";

/**
 * Projects in display order: the featured one, then the most recent first. Facts come
 * from the résumé, the MuseTrail poster, the screenshots and Samuele himself; anything
 * unknown is left out and listed as a question in the local content to-do list.
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
    problem:
      "How can young adults become aware of their digital footprint? Old photos, videos, emails and social media posts pile up, and keeping them stored has a CO2 cost that is easy to overlook.",
    approach: [
      "MuseTrail turns the small actions that reduce a digital CO2 footprint into one-of-a-kind art. Users accept bite-sized challenges, such as deleting duplicate photos, clearing out old videos or unsubscribing from newsletters they no longer read, and their actions become artworks in a personal museum.",
      "A progress view shows how much CO2 a user has saved compared with the average user, and short educational insights explain where a digital footprint comes from.",
      "I led our team of five and worked on both the frontend and the backend. The app is built with SvelteKit and Docker.",
    ],
    outcome:
      "We pitched MuseTrail to professors and investors, and the project won the grand prize in a Dragons' Den competition.",
    highlights: ["Grand prize, Dragons' Den competition"],
    media: {
      hero: "IMG-MUSETRAIL-01",
      secondary: "IMG-MUSETRAIL-02",
      screens: ["IMG-MUSETRAIL-01", "IMG-MUSETRAIL-03"],
      gallery: ["IMG-MUSETRAIL-02"],
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
    problem:
      "Progmatic wants an internal assistant for its technical and organisational knowledge, one that runs locally.",
    approach: [
      "Through client meetings and requirements analysis, our team of five is investigating four areas: document retrieval, integration with FileMaker, access control and data confidentiality.",
      "The assistant is meant to answer questions about the company database, find information, write emails and code, and prepare quotations and budget calculations. Its interface brings chat, files, search, email and FileMaker together in one sidebar.",
    ],
    approachVisual: "research-map",
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
    problem:
      "Conneqtech wanted a single dashboard to track cars and bicycles, with their GPS data and vehicle details in one place.",
    approach: [
      "I took the project from start to finish during my internship: problem analysis, requirements, implementation and the final delivery. The dashboard is written in Go and covers both the frontend and the backend.",
    ],
    outcome: "I delivered the dashboard at the end of the internship, in January 2025.",
    media: { hero: "IMG-CONNEQTECH-01", gallery: ["IMG-CONNEQTECH-02"] },
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
    problem:
      "Stedin needed a way to visualise power usage and keep an eye on faulty transformers across regions of the Netherlands.",
    approach: [
      "As part of a university project team, I worked on a web application built with Laravel, PHP and MySQL. For each transformer, it charts the maximum voltages measured over time.",
    ],
    media: { hero: "IMG-STEDIN-01", gallery: ["IMG-STEDIN-02"] },
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
    approach: [
      "Players choose a piece by its index, the game lists the moves that piece can make, and the chosen move is checked, logged and added to the move history before the board is printed again.",
      "It is written in Java, with object-oriented programming and design patterns.",
    ],
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
