import { DrawReveal } from "@/components/motion/DrawReveal";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { ProgmaticDiagram } from "@/components/visuals/ProgmaticDiagram";
import { TerminalChess } from "@/components/visuals/TerminalChess";
import type { CardVisual } from "@/content/schema";
import { cn } from "@/lib/utils/cn";

/**
 * Sunken tray at the top of a card. From md up every tray has the same height, so
 * titles line up across a row whatever the visual inside. Windows (browser frame,
 * terminal) rise from the tray's bottom edge; their bottom corners are hidden.
 */
const tray = "relative overflow-hidden bg-surface-sunken md:h-72 lg:h-88";
const windowInset = "absolute inset-x-5 top-5 bottom-0 rounded-b-none md:inset-x-8 md:top-8";

interface CardMediaProps {
  visual: CardVisual;
}

export function CardMedia({ visual }: Readonly<CardMediaProps>) {
  switch (visual.type) {
    case "screenshot": {
      const image = (
        <MediaSlot
          id={visual.slot}
          sizes="(min-width: 1280px) 620px, (min-width: 768px) 50vw, 100vw"
          position="top"
        />
      );
      return (
        <div className={cn(tray, "aspect-[16/10] md:aspect-auto")}>
          <MediaFrame ratio="fill" className={windowInset}>
            {/* The screenshot leans in a touch when the card is hovered. */}
            <div className="absolute inset-0 transition-transform duration-700 ease-(--ease-out) group-hover:scale-[1.04]">
              {visual.effect === "draw" ? <DrawReveal>{image}</DrawReveal> : image}
            </div>
          </MediaFrame>
        </div>
      );
    }
    case "terminal":
      // On phones the tray takes the terminal's natural height; from md up the tray
      // is fixed and the terminal fills it, clipping the last lines if space runs out.
      return (
        <div className={cn(tray, "px-5 pt-5 md:px-0 md:pt-0")}>
          <TerminalChess className="rounded-b-none md:absolute md:inset-x-8 md:top-8 md:bottom-0" />
        </div>
      );
    case "diagram":
      return (
        <div className={cn(tray, "flex items-center justify-center px-5 py-10 md:px-8")}>
          <ProgmaticDiagram />
        </div>
      );
  }
}
