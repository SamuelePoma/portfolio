import { z } from "zod";

import { mediaSlots } from "./media";

/**
 * Schemas for the site content. `tests/unit/content.test.ts` parses every content
 * file with them, so invalid content fails CI instead of reaching the page.
 */

/** Visible copy: trimmed, non-empty, and free of the dashes DESIGN.md §12 bans. */
export const visibleText = z
  .string()
  .trim()
  .min(1)
  .refine((text) => !/[\u2013\u2014]/.test(text), {
    message: "Visible text must not contain em or en dashes (DESIGN.md §12)",
  });

/** A year ("2020") or a year and month ("2024-09"). */
const yearOrMonth = z.string().regex(/^\d{4}(-(0[1-9]|1[0-2]))?$/, "Use YYYY or YYYY-MM");

export const periodSchema = z
  .object({ start: yearOrMonth, end: yearOrMonth.optional() })
  .refine((period) => period.end === undefined || period.end >= period.start, {
    message: "A period cannot end before it starts",
  });

const httpsUrl = z.url({ protocol: /^https$/ });

const mediaSlotIds = mediaSlots.map((slot) => slot.id) as [
  (typeof mediaSlots)[number]["id"],
  ...(typeof mediaSlots)[number]["id"][],
];
const mediaSlotId = z.enum(mediaSlotIds);

/** What a project card shows in its media area. */
export const cardVisualSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("screenshot"),
    slot: mediaSlotId,
    /** "draw": the screenshot wipes in left to right, for charts. */
    effect: z.enum(["draw"]).optional(),
  }),
  z.object({ type: z.literal("diagram"), name: z.enum(["research-map", "vet-components"]) }),
  z.object({ type: z.literal("terminal") }),
]);

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slugs are lowercase and hyphenated"),
  title: visibleText,
  /** Company or client, when there is one (shown in the card's mono row). */
  organisation: visibleText.optional(),
  /** Kind of project, e.g. "Internship" or "University project". */
  category: visibleText,
  period: periodSchema.optional(),
  status: z.enum(["completed", "in-progress"]),
  /** One or two sentences for cards and the featured band. */
  tagline: visibleText.max(180),
  /** The case study's meta description: 140 to 160 characters, keywords used naturally. */
  seoDescription: visibleText.min(140).max(160),
  /** Samuele's role. Optional: left out until he confirms it, never guessed. */
  role: visibleText.optional(),
  team: z.number().int().min(2).optional(),
  /** Empty until the stack is confirmed; the card then simply shows no tags. */
  stack: z.array(visibleText).max(5),
  /** A real distinction, e.g. an award. Shown as the accent label. */
  highlight: visibleText.optional(),
  featured: z.boolean().default(false),
  card: cardVisualSchema,

  // Case study (DESIGN.md §9.3). Every section is optional: a missing fact means a
  // shorter page, never a guessed one.
  /** The problem solved, one paragraph. */
  problem: visibleText.optional(),
  /** What was done, one to three paragraphs. */
  approach: z.array(visibleText).min(1).max(3).optional(),
  /** Diagrams for the Approach section, in order. */
  approachVisuals: z
    .array(z.enum(["research-map", "rag-flow", "vet-components"]))
    .min(1)
    .optional(),
  /** The result, one paragraph. */
  outcome: visibleText.optional(),
  /** Real distinctions, listed under the outcome. */
  highlights: z.array(visibleText).min(1).optional(),
  /** What Samuele learned, in his words. */
  learnings: z.array(visibleText).min(1).optional(),
  /** Only links that are public. */
  links: z.object({ repo: httpsUrl.optional(), demo: httpsUrl.optional() }).optional(),

  media: z.object({
    /** The case study's main visual; also the card's screenshot when it has one. */
    hero: mediaSlotId.optional(),
    /** The photo under the featured band. */
    secondary: mediaSlotId.optional(),
    /** Phone screens, front first: the featured band and the case-study hero. */
    screens: z.array(mediaSlotId).min(2).max(2).optional(),
    /** Extra images at the end of the case study; missing files are skipped. */
    gallery: z.array(mediaSlotId).min(1).max(3).optional(),
  }),
});

export const timelineEntrySchema = z.object({
  period: periodSchema,
  title: visibleText,
  organisation: visibleText,
  summary: visibleText.max(120),
});

export const skillGroupSchema = z.object({
  label: visibleText,
  items: z.array(visibleText).min(1),
});

const legalSectionSchema = z.object({
  /** Anchor id: lowercase and hyphenated. */
  id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  title: visibleText,
  paragraphs: z.array(visibleText).min(1).optional(),
  items: z.array(visibleText).min(1).optional(),
  links: z
    .array(z.object({ label: visibleText, href: httpsUrl }))
    .min(1)
    .optional(),
});

export const legalDocumentSchema = z.object({
  slug: z.string().regex(/^[a-z]+$/),
  title: visibleText,
  seoDescription: visibleText.min(140).max(160),
  updated: z.iso.date(),
  intro: visibleText,
  sections: z.array(legalSectionSchema).min(1),
});

export const siteSchema = z.object({
  name: visibleText,
  role: visibleText,
  location: visibleText,
  email: z.email(),
  github: httpsUrl,
  linkedin: httpsUrl,
  cvPath: z.string().startsWith("/"),
  heroEyebrow: visibleText,
  heroLead: visibleText,
  /** The home page's meta description, 140 to 160 characters. */
  seoDescription: visibleText.min(140).max(160),
  /** When the content last changed (YYYY-MM-DD), for the sitemap. */
  contentUpdated: z.iso.date(),
  about: z.array(visibleText).min(1).max(4),
  languages: visibleText,
});

export type Period = z.infer<typeof periodSchema>;
export type Project = z.input<typeof projectSchema>;
export type CardVisual = z.infer<typeof cardVisualSchema>;
export type TimelineEntry = z.infer<typeof timelineEntrySchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type Site = z.infer<typeof siteSchema>;
export type LegalDocument = z.input<typeof legalDocumentSchema>;
export type LegalSection = z.infer<typeof legalSectionSchema>;
