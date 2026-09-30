/**
 * Image slots (DESIGN.md §10). A slot renders its file from `public/images/`
 * when the file exists, and a designed placeholder when it doesn't.
 */

export const mediaRatios = ["16:10", "4:5"] as const;
export type MediaRatio = (typeof mediaRatios)[number];

export interface MediaSlotDefinition {
  id: string;
  /** File name inside `public/images/`. */
  file: string;
  ratio: MediaRatio;
  /** Alt text for the real image. */
  alt: string;
  /** What belongs in the slot, shown while the image is missing. */
  placeholder: string;
}

export const mediaSlots = [
  {
    id: "IMG-MUSETRAIL-01",
    file: "musetrail-01.webp",
    ratio: "16:10",
    alt: "MuseTrail web app, main screen",
    placeholder: "Main MuseTrail screen, desktop",
  },
  {
    id: "IMG-MUSETRAIL-02",
    file: "musetrail-02.webp",
    ratio: "4:5",
    alt: "The MuseTrail team at the Dragons' Den award ceremony",
    placeholder: "Dragons' Den award ceremony",
  },
  {
    id: "IMG-MUSETRAIL-03",
    file: "musetrail-03.webp",
    ratio: "16:10",
    alt: "MuseTrail, secondary screen",
    placeholder: "Second design screen or mobile view",
  },
  {
    id: "IMG-CONNEQTECH-01",
    file: "conneqtech-01.webp",
    ratio: "16:10",
    alt: "GPS monitoring dashboard with a map of tracked vehicles",
    placeholder: "Dashboard main view with map",
  },
  {
    id: "IMG-CONNEQTECH-02",
    file: "conneqtech-02.webp",
    ratio: "16:10",
    alt: "Vehicle detail view with GPS history",
    placeholder: "Vehicle detail and GPS history",
  },
  {
    id: "IMG-STEDIN-01",
    file: "stedin-01.webp",
    ratio: "16:10",
    alt: "Grid monitoring app showing regional power usage",
    placeholder: "Power usage map or transformer overview",
  },
  {
    id: "IMG-STEDIN-02",
    file: "stedin-02.webp",
    ratio: "16:10",
    alt: "Alert view for a faulty transformer",
    placeholder: "Faulty transformer detail or alert",
  },
  {
    id: "IMG-PROGMATIC-01",
    file: "progmatic-01.webp",
    ratio: "16:10",
    alt: "Research material from the AI knowledge assistant project",
    placeholder: "Research board or early prototype",
  },
  {
    id: "IMG-PORTRAIT",
    file: "portrait.webp",
    ratio: "4:5",
    alt: "Portrait of Samuele Poma",
    placeholder: "Portrait, neutral background",
  },
] as const satisfies readonly MediaSlotDefinition[];

export type MediaSlotId = (typeof mediaSlots)[number]["id"];

export function getMediaSlot(id: MediaSlotId): MediaSlotDefinition {
  const slot = mediaSlots.find((candidate) => candidate.id === id);
  if (!slot) throw new Error(`Unknown media slot: ${id}`);
  return slot;
}
