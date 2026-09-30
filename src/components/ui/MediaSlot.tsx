import "server-only";

import { existsSync } from "node:fs";
import path from "node:path";

import Image from "next/image";

import { getMediaSlot, type MediaSlotId } from "@/content/media";

import { Placeholder } from "./Placeholder";

interface MediaSlotProps {
  id: MediaSlotId;
  /** Responsive `sizes` hint for `next/image`, e.g. "(min-width: 1024px) 58vw, 100vw". */
  sizes: string;
  /** Only for the LCP image of a page. */
  preload?: boolean;
  /** `top` keeps the top of UI screenshots (navigation, header) when cropping. */
  position?: "center" | "top";
}

/**
 * Renders the image for a slot if its file exists in `public/images/`, otherwise a
 * placeholder. Checked at build time: pages are static, so there is no runtime cost.
 * Place it inside a `MediaFrame`, which provides the positioned, ratio-locked box.
 */
export function MediaSlot({
  id,
  sizes,
  preload = false,
  position = "center",
}: Readonly<MediaSlotProps>) {
  const slot = getMediaSlot(id);
  const exists = existsSync(path.join(process.cwd(), "public", "images", slot.file));

  if (!exists) {
    return <Placeholder slotId={slot.id} ratio={slot.ratio} description={slot.placeholder} />;
  }

  return (
    <Image
      src={`/images/${slot.file}`}
      alt={slot.alt}
      fill
      sizes={sizes}
      preload={preload}
      className={position === "top" ? "object-cover object-top" : "object-cover"}
    />
  );
}
