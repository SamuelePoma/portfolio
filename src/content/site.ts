import type { Site } from "./schema";

/** Site-wide facts. Everything here comes from Samuele's résumé; never add a phone number. */
export const site = {
  name: "Samuele Poma",
  role: "Software Engineer",
  location: "Middelburg, Netherlands",
  email: "samuelepoma45@gmail.com",
  github: "https://github.com/SamuelePoma",
  linkedin: "https://www.linkedin.com/in/samuele-poma-547120242/",
  cvPath: "/cv/samuele-poma-cv.pdf",
  heroEyebrow: "Software engineer · Middelburg, NL",
  heroLead:
    "I build full-stack software, from Go services to React interfaces, and take projects from the first requirement to the final release.",
  seoDescription:
    "Samuele Poma is a software engineer in Middelburg, Netherlands, building full-stack software with Go, TypeScript and React. See his projects and case studies.",
  contentUpdated: "2026-10-05",
  about: [
    "I'm a software engineer in the final year of a BSc in ICT at HZ University of Applied Sciences in Middelburg.",
    "I like to own a problem from start to finish: understanding what people need, turning it into requirements, and delivering software that solves it.",
    "I work mostly with Go, TypeScript and React, and I use design patterns and domain-driven design to keep codebases easy to change.",
  ],
  languages: "Italian (native), English (C1)",
} as const satisfies Site;
