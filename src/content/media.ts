/**
 * Image slots (DESIGN.md §10). A slot renders its file from `public/images/`
 * when the file exists, and a designed placeholder when it doesn't.
 */

/** `9:19.5` is a phone screen (1170 × 2532), shown inside a `PhoneFrame`. */
export const mediaRatios = ["16:10", "16:9", "2:1", "4:5", "9:19.5"] as const;
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
  /** Visible caption, for photos that need context (who, where, when). */
  caption?: string;
  /**
   * A drawn stand-in shown while the file is missing, instead of the placeholder, for
   * slots that appear on the live site. The real image replaces it as soon as it exists.
   */
  illustration?: "character-sheet";
}

export const mediaSlots = [
  {
    id: "IMG-MUSETRAIL-01",
    file: "musetrail-01.webp",
    ratio: "9:19.5",
    alt: "MuseTrail on a phone: the My Museum screen, with the user's artworks, likes and collections",
    placeholder: "My Museum screen, phone",
  },
  {
    id: "IMG-MUSETRAIL-02",
    file: "musetrail-02.webp",
    ratio: "16:9",
    alt: "The MuseTrail team presenting four app screens on a projector in a lecture hall",
    placeholder: "The team pitching MuseTrail",
    caption: "Pitching MuseTrail to professors and investors.",
  },
  {
    id: "IMG-MUSETRAIL-03",
    file: "musetrail-03.webp",
    ratio: "9:19.5",
    alt: "MuseTrail on a phone: progress screen comparing the CO2 a user saved with the average user",
    placeholder: "Progress screen, phone",
  },
  {
    id: "IMG-CONNEQTECH-01",
    file: "conneqtech-01.webp",
    ratio: "16:10",
    alt: "Design of the fleet health dashboard: the share of healthy devices, how many are moving or reported stolen, and charts of device issues and status over the months",
    placeholder: "Dashboard main view",
  },
  {
    id: "IMG-CONNEQTECH-02",
    file: "conneqtech-02.webp",
    ratio: "16:10",
    alt: "Design of the faulty devices table: each vehicle's issue, battery, GPS and GSM connection, status and when it was last seen",
    placeholder: "Faulty devices table",
    caption: "The faulty devices view, as designed in Figma.",
  },
  {
    id: "IMG-STEDIN-01",
    file: "stedin-01.webp",
    ratio: "16:10",
    alt: "Grid monitoring app: a chart of one transformer's maximum voltages over two weeks",
    placeholder: "Transformer voltage chart",
  },
  {
    id: "IMG-STEDIN-02",
    file: "stedin-02.webp",
    ratio: "16:9",
    alt: "Seven students around a meeting table, most of them giving a thumbs up",
    placeholder: "The project group at work",
    caption: "Working on the Stedin project with my group.",
  },
  {
    id: "IMG-STEDIN-03",
    file: "stedin-03.webp",
    ratio: "2:1",
    alt: "Screen designs for grid monitoring, joined by arrows: a map of transformers with a table of the faulty ones, the table of measurements it opens, and the message shown when no marker is selected",
    placeholder: "Screen designs and how they connect",
    caption: "The screens as designed in Figma, and how they lead into each other.",
  },
  {
    id: "IMG-PROGMATIC-01",
    file: "progmatic-01.webp",
    ratio: "16:9",
    alt: "The assistant's overview screen: a sidebar with chat, files, search, email and FileMaker, and a field to generate a brief on an engineering subject",
    placeholder: "Assistant overview screen",
  },
  {
    id: "IMG-YOUNGDCC-01",
    file: "young-dcc-01.webp",
    ratio: "16:10",
    alt: "Young DCC home page: the headline Activate community energy for climate action, with buttons to browse events and learn more",
    placeholder: "Platform home page",
  },
  {
    id: "IMG-TOWERDEFENSE-01",
    file: "tower-defense-01.webp",
    ratio: "16:9",
    alt: "Tower defense game won: a trophy over a winding dirt path, with the text No virus detected, You win, and a score of 525",
    placeholder: "Game screen",
  },
  {
    id: "IMG-DND-01",
    file: "dnd-01.webp",
    ratio: "16:10",
    alt: "A generated Dungeons & Dragons character sheet",
    placeholder: "Character sheet page or CLI output",
    illustration: "character-sheet",
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
