import { MediaSlot } from "@/components/ui/MediaSlot";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import type { MediaSlotId } from "@/content/media";
import { cn } from "@/lib/utils/cn";

interface PhonePairProps {
  front: MediaSlotId;
  back: MediaSlotId;
  /** `next/image` sizes for one phone screen. */
  sizes?: string;
  /** For a page's main visual: the phones are its largest content. */
  preload?: boolean;
  className?: string;
}

/**
 * Two phones side by side, the second set back and lower, like a product shot
 * (DESIGN.md §8.5). The phones are sized by the stage's height, so the stage's
 * aspect ratio decides how big they are.
 */
export function PhonePair({
  front,
  back,
  sizes = "(min-width: 640px) 260px, 40vw",
  preload = false,
  className,
}: Readonly<PhonePairProps>) {
  return (
    <div className={cn("relative aspect-square w-full sm:aspect-[5/4]", className)}>
      <div className="absolute top-[8%] left-1/2 h-[88%] -translate-x-[8%]">
        <PhoneFrame className="h-full">
          <MediaSlot id={back} sizes={sizes} position="top" preload={preload} />
        </PhoneFrame>
      </div>
      <div className="absolute top-0 left-1/2 h-[94%] -translate-x-[92%]">
        <PhoneFrame className="h-full">
          <MediaSlot id={front} sizes={sizes} position="top" preload={preload} />
        </PhoneFrame>
      </div>
    </div>
  );
}
