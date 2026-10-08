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
    seoDescription:
      "MuseTrail: a SvelteKit app that turns habits that cut digital CO2 into art. Built by a team of five led by Samuele Poma, it won a Dragons' Den grand prize.",
    tagline:
      "A web app that turns the small actions that cut your digital CO2 into one-of-a-kind art for a personal museum.",
    role: "Team lead: design, user interviews, frontend, backend and testing",
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
      "I led our team of five and worked across the whole project: the design, interviews with users, the SvelteKit frontend, the backend and the testing. The backend is a set of Node.js services for users, challenges, the gallery and educational content, each with its own MySQL database, behind an API gateway; Docker Compose runs it all.",
    ],
    outcome:
      "We pitched MuseTrail to professors and investors. Out of ten teams, judged by teachers, other students and IT companies, it won the grand prize in the Dragons' Den competition.",
    highlights: ["Grand prize, Dragons' Den competition (10 teams)"],
    learnings: [
      "Leading a team of five taught me to split the work so that everyone owned a piece of it, and to bring what we heard in user interviews into every design decision.",
      "Splitting the backend into services with their own databases kept each part simple, and showed me how much a Docker Compose set-up has to hold together once services depend on each other.",
    ],
    links: { repo: "https://github.com/Byte-2-Green" },
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
    category: "Team project",
    period: { start: "2026-09" },
    status: "in-progress",
    seoDescription:
      "Case study: a local AI knowledge assistant for Progmatic that will answer questions about the company database and draft emails, code and quotations.",
    tagline:
      "IO, a local AI assistant for Progmatic: ask in everyday language, get answers from the company's own data with their sources, plus drafts of emails, code and quotations.",
    role: "Backend developer",
    team: 5,
    stack: ["AI", "Document retrieval", "FileMaker"],
    card: { type: "screenshot", slot: "IMG-PROGMATIC-01" },
    problem:
      "Progmatic's information is spread across systems, documents, projects and customers. Finding something often means knowing where it is stored, or which words were used when it was filed.",
    approach: [
      'IO works like this: an employee asks in everyday language, such as "Which PLC did we use for this project?", and gets an answer based on Progmatic\'s own data, together with the sources it came from.',
      "Rather than training a model on all that data, IO uses retrieval-augmented generation (RAG): it first searches Progmatic's knowledge for what is relevant, then hands it to a language model that writes the answer. The model runs internally, so company information never goes to a public AI service.",
      "After client meetings and requirements analysis, our team of five is building it around four pieces: document retrieval, FileMaker integration, access control and data confidentiality. It is developed and tested on dummy Progmatic data first, and its interface brings chat, files, search, email and FileMaker together.",
    ],
    approachVisuals: ["rag-flow", "assistant-pillars"],
    learnings: [
      "An assistant is only as good as what it can find: most of the work is in making a company's documents and data searchable, not in the language model.",
      "Keeping the model inside the company shapes the backend from the start: who may see which data has to be settled before the first answer is generated.",
    ],
    media: { hero: "IMG-PROGMATIC-01" },
  },
  {
    slug: "young-dcc-platform",
    title: "Youth climate events platform",
    organisation: "Delta Climate Center",
    category: "Web platform",
    period: { start: "2026-06", end: "2026-06" },
    status: "completed",
    seoDescription:
      "Case study: an online platform built with the Delta Climate Center to promote and organise environmental events for young people in Zeeland.",
    tagline:
      "An online platform, built with the Delta Climate Center, to promote and organise events on environmental themes for young people in Zeeland.",
    role: "Developer and tracker",
    stack: ["JavaScript"],
    card: { type: "screenshot", slot: "IMG-YOUNGDCC-01" },
    learnings: [
      "Building for a real organisation meant turning their goals into features we could deliver within the project.",
      "As the team's tracker I kept our planning visible, which made it easy to see early when something was slipping.",
    ],
    media: { hero: "IMG-YOUNGDCC-01" },
  },
  {
    slug: "veterinary-practice-system",
    title: "Veterinary practice system",
    category: "Team project",
    period: { start: "2026" },
    status: "in-progress",
    seoDescription:
      "Case study: a veterinary practice information system in SvelteKit, with appointment booking and clinical records sharing one backend and one database.",
    tagline:
      "An information system for a veterinary practice that puts appointment booking and animals' clinical records on one shared backend and database.",
    role: "Developer, reviewer of the component architecture",
    team: 2,
    stack: ["SvelteKit"],
    card: { type: "diagram", name: "vet-components" },
    problem:
      "A veterinary practice needs one system for appointments and clinical records: clients book visits, while only authorised staff may see an animal's clinical history, laboratory results and medication.",
    approach: [
      "Booking and clinical records share one backend and one database, so both use the same client, animal and veterinarian records instead of keeping two copies. Authentication and authorisation sit in front of every service, because clinical information is protected.",
      "Later increments add a laboratory integration that receives results from Laboratorium Centraal as HL7 v2.5 ORU messages and matches each one to the right animal, and separate medication and stock services: giving a dose deducts stock, with alerts when it runs low.",
      "I reviewed the component diagram shown below. The first increment covers signing in, finding an animal and viewing its clinical record.",
    ],
    approachVisuals: ["vet-components"],
    learnings: [
      "Reviewing the component diagram before writing code showed me how much a shared data model saves: booking and clinical records always agree on who the client and the animal are.",
      "Working as a pair, a small first increment (signing in, finding an animal, opening its record) kept the scope honest.",
    ],
    // Repository link: add it as `links: { repo: "https://github.com/..." }`.
    media: {},
  },
  {
    slug: "conneqtech-gps-dashboard",
    title: "GPS monitoring dashboard",
    organisation: "Conneqtech",
    category: "Internship",
    period: { start: "2024-09", end: "2025-01" },
    status: "completed",
    seoDescription:
      "Case study: a GPS monitoring dashboard in Go for Conneqtech, tracking cars and bicycles, taken from requirements to delivery during an internship.",
    tagline:
      "A dashboard to track cars and bicycles and see their GPS data and vehicle details in one place. Built end to end during my internship.",
    role: "Software engineering intern",
    stack: ["Go", "Figma"],
    card: { type: "screenshot", slot: "IMG-CONNEQTECH-01" },
    problem:
      "Conneqtech wanted a single dashboard to track cars and bicycles, with their GPS data and vehicle details in one place.",
    approach: [
      "I took the project from start to finish during my internship: problem analysis, requirements, the design of the dashboard in Figma, the backend in Go and the final delivery.",
      "The design puts the fleet's health first: how many devices are healthy, moving or reported stolen, how issues develop over the months, and a table of the devices that need attention, with their battery, GPS and GSM connection and when they were last seen.",
    ],
    outcome: "I delivered the dashboard at the end of the internship, in January 2025.",
    learnings: [
      "Owning a project from requirements to delivery taught me to agree on the scope early and to design the screens before building the backend that feeds them.",
      "Go kept the backend small and readable as it grew.",
    ],
    media: { hero: "IMG-CONNEQTECH-01", gallery: ["IMG-CONNEQTECH-02"] },
  },
  {
    slug: "stedin-grid-monitoring",
    title: "Grid monitoring",
    organisation: "Stedin",
    category: "University project",
    period: { start: "2023", end: "2023" },
    status: "completed",
    seoDescription:
      "Case study: a Laravel, PHP and MySQL web app for Stedin that visualises power usage and charts transformer voltages across regions of the Netherlands.",
    tagline:
      "Software for visualising power usage and monitoring faulty transformers across regions of the Netherlands.",
    role: "Team leader and tracker",
    stack: ["Laravel", "PHP", "MySQL", "Figma"],
    card: { type: "screenshot", slot: "IMG-STEDIN-01" },
    problem:
      "Stedin needed a way to visualise power usage and keep an eye on faulty transformers across regions of the Netherlands.",
    approach: [
      "As team leader and tracker of a university project team, I worked on a web application built with Laravel, PHP and MySQL. For each transformer, it charts the maximum voltages measured over time.",
      "I also designed the screens in Figma: a map of the transformers in Utrecht, Zuid-Holland and Zeeland, coloured by their state, next to a table of the faulty ones and their problem. Selecting transformers opens their measurements in a table that can be searched and filtered.",
    ],
    learnings: [
      "Leading the team and tracking our planning taught me to divide the work so that nobody waited on anyone else.",
      "Designing data-heavy screens is about what stands out: a faulty transformer has to be visible at a glance on the map before anyone opens a table.",
    ],
    media: { hero: "IMG-STEDIN-01", gallery: ["IMG-STEDIN-03", "IMG-STEDIN-02"] },
  },
  {
    slug: "chess-game-java",
    title: "Chess in the terminal",
    category: "Java",
    period: { start: "2024-12", end: "2025-01" },
    status: "completed",
    seoDescription:
      "Case study: a console chess game in Java for a Software Design exam, built on six design patterns, with Strategy, Prototype and Decorator by Samuele.",
    tagline: "A text-based chess game built with object-oriented programming and design patterns.",
    role: "Developer: the Strategy, Prototype and Decorator patterns",
    team: 2,
    stack: ["Java", "OOP", "Design patterns"],
    card: { type: "terminal" },
    problem:
      "A console chess game for the Software Design exam at HZ, built so that new pieces and rules can be added without rewriting the existing ones.",
    approach: [
      "Players choose a piece by its index, the game lists the moves that piece can make, and the chosen move is checked, logged and added to the move history before the board is printed again.",
      "Andrea Bezzolato and I used six design patterns and each implemented three. Mine were Strategy, one movement strategy per kind of piece; Prototype, a factory that creates pieces by cloning prototypes; and Decorator, which adds logging to every move without changing the pieces.",
    ],
    learnings: [
      "Design patterns earn their place when the code has to change: adding a kind of piece means adding a movement strategy, not editing the board.",
      "Splitting six patterns between two people only worked because we agreed on the interfaces first.",
    ],
    links: { repo: "https://github.com/SamuelePoma/SD_ChessGame" },
    media: {},
  },
  {
    slug: "dnd-character-sheet-generator",
    title: "D&D character sheet generator",
    category: "Go",
    period: { start: "2026" },
    status: "in-progress",
    seoDescription:
      "Case study: a Dungeons & Dragons 5e character sheet generator written in Go, with a command line, an HTML front end and data from the D&D 5e API.",
    tagline:
      "A Dungeons & Dragons character sheet generator in Go that follows the 5e rules (SRD 5.1), with a command line and an HTML front end.",
    role: "Developer, individual university project",
    stack: ["Go", "REST API", "HTML"],
    card: { type: "screenshot", slot: "IMG-DND-01" },
    problem:
      "Player characters in Dungeons & Dragons follow strict rules that keep the game balanced. The course turns the 403-page System Reference Document 5.1 into the requirements, checked by automated tests on CodeGrade.",
    approach: [
      "The scope, set by the course: characters with a name, race, class, level, background and ability scores from the standard array (15, 14, 13, 12, 10, 8) plus racial bonuses, with skill proficiencies and modifiers; weapons, armour and shields; and spells and spell slots for casters.",
      "Spells and equipment are enriched from the D&D 5e API. The sheet works out armour class, initiative, passive perception and, for casters, the spell save DC and spell attack bonus.",
      "A command line creates, shows and lists characters, and an HTML page lists every character with a link to its sheet. CodeGrade compiles on one core within two minutes, which keeps external libraries to one or two.",
    ],
    learnings: [
      "A 403-page rulebook turns out to be a very precise specification: reading it closely is half the work.",
      "Working against automated tests from the first requirement keeps the rules honest.",
    ],
    // Repository link: add it as `links: { repo: "https://github.com/..." }`.
    media: { hero: "IMG-DND-01" },
  },
  {
    slug: "tower-defense-typescript",
    title: "Tower defense game",
    category: "TypeScript",
    period: { start: "2023", end: "2023" },
    status: "completed",
    seoDescription:
      "Case study: a tower defense game built with object-oriented TypeScript by Samuele Poma, a software engineer based in Middelburg, the Netherlands.",
    tagline: "My first project: a tower defense game built with object-oriented TypeScript.",
    role: "Team leader",
    team: 3,
    stack: ["TypeScript", "OOP"],
    card: { type: "screenshot", slot: "IMG-TOWERDEFENSE-01" },
    learnings: [
      "My first project and my first time leading a team: it taught me to plan the work so that everyone knew what to build next.",
      "Writing the game in object-oriented TypeScript taught me to model a problem as objects with clear responsibilities before writing the loop that runs them.",
    ],
    // Repository link: add it as `links: { repo: "https://github.com/..." }`.
    media: { hero: "IMG-TOWERDEFENSE-01" },
  },
] as const satisfies readonly Project[];
