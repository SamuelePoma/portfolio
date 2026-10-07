import { legalDocuments } from "@/content/legal";
import { mediaSlots } from "@/content/media";
import { projects } from "@/content/projects";
import {
  legalDocumentSchema,
  projectSchema,
  siteSchema,
  skillGroupSchema,
  timelineEntrySchema,
} from "@/content/schema";
import { site } from "@/content/site";
import { skillGroups } from "@/content/skills";
import { timeline } from "@/content/timeline";

const allContent = { site, projects, timeline, skillGroups, mediaSlots, legalDocuments };

/** Every string anywhere in the content, with its path, for global rules. */
function collectStrings(value: unknown, path = "content"): [string, string][] {
  if (typeof value === "string") return [[path, value]];
  if (Array.isArray(value))
    return value.flatMap((item, i) => collectStrings(item, `${path}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) => collectStrings(item, `${path}.${key}`));
  }
  return [];
}

describe("content schemas", () => {
  it("site is valid", () => {
    expect(() => siteSchema.parse(site)).not.toThrow();
  });

  it.each(projects.map((project) => [project.slug, project] as const))(
    "project %s is valid",
    (_, project) => {
      expect(() => projectSchema.parse(project)).not.toThrow();
    },
  );

  it.each(legalDocuments.map((document) => [document.slug, document] as const))(
    "legal page %s is valid",
    (_, document) => {
      expect(() => legalDocumentSchema.parse(document)).not.toThrow();
    },
  );

  it("timeline entries and skill groups are valid", () => {
    for (const entry of timeline) expect(() => timelineEntrySchema.parse(entry)).not.toThrow();
    for (const group of skillGroups) expect(() => skillGroupSchema.parse(group)).not.toThrow();
  });
});

describe("content rules", () => {
  const strings = collectStrings(allContent);

  it("never contains em or en dashes (DESIGN.md §12)", () => {
    const offenders = strings.filter(([, text]) => /[\u2013\u2014]/.test(text));
    expect(offenders).toEqual([]);
  });

  it("never contains a phone number", () => {
    // Eight or more digits with at most one space, dot or dash between them. Profile URLs
    // carry numeric ids (LinkedIn) and ISO dates look alike, so https URLs and exact
    // dates are skipped; tel: links never are.
    const isDate = (text: string) => /^\d{4}-\d{2}-\d{2}$/.test(text);
    const offenders = strings.filter(
      ([, text]) =>
        /tel:/i.test(text) ||
        (!text.startsWith("https://") && !isDate(text) && /\+?\d(?:[\s.-]?\d){7,}/.test(text)),
    );
    expect(offenders).toEqual([]);
  });

  it("has unique project slugs and exactly one featured project", () => {
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(projects.filter((project) => "featured" in project && project.featured)).toHaveLength(1);
  });

  it("marks only open-ended projects as in progress", () => {
    for (const project of projects) {
      const openEnded = "period" in project && !("end" in project.period);
      expect(project.status === "in-progress").toBe(openEnded);
    }
  });

  it("gives every page a unique meta description", () => {
    const descriptions = [
      site.seoDescription,
      ...projects.map((project) => project.seoDescription),
      ...legalDocuments.map((document) => document.seoDescription),
    ];
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("uses at most one middle dot per string", () => {
    const offenders = strings.filter(([, text]) => text.split("·").length > 2);
    expect(offenders).toEqual([]);
  });
});
