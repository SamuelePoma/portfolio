import type { SkillGroup } from "./schema";

/** Only technologies and practices listed on the résumé. */
export const skillGroups = [
  { label: "Languages", items: ["Go", "TypeScript", "JavaScript", "Java", "PHP", "SQL"] },
  { label: "Frameworks", items: ["React", "SvelteKit", "Laravel", "Tailwind CSS"] },
  { label: "Tools", items: ["Git", "GitHub", "Docker", "MySQL"] },
  {
    label: "Practices",
    items: ["Domain-driven design", "Design patterns", "OOP", "Agile teamwork"],
  },
] as const satisfies readonly SkillGroup[];
