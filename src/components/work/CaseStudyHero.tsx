import { MediaFrame } from "@/components/ui/MediaFrame";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { PhonePair } from "@/components/visuals/PhonePair";
import { TerminalChess } from "@/components/visuals/TerminalChess";
import { getMediaSlot } from "@/content/media";
import type { Project } from "@/content/schema";

type CaseStudyHeroProps = Pick<Project, "card" | "media">;

/** Sunken tray for visuals that aren't screenshots: phones and the terminal. */
const tray = "rounded-xl bg-surface-sunken px-5 py-10 md:px-12 md:py-16";

/**
 * The case study's main visual, the same product the card shows: phones for a mobile
 * app, the terminal for the chess game, otherwise the hero screenshot in a browser
 * frame. It is the page's largest image, so it is preloaded.
 */
export function CaseStudyHero({ card, media }: Readonly<CaseStudyHeroProps>) {
  const [front, back] = media.screens ?? [];

  if (front && back) {
    return (
      <div className={tray}>
        <PhonePair
          front={front}
          back={back}
          sizes="(min-width: 1024px) 300px, 40vw"
          preload
          className="mx-auto max-w-2xl"
        />
      </div>
    );
  }

  if (card.type === "terminal") {
    return (
      <div className={tray}>
        <TerminalChess variant="full" className="mx-auto max-w-2xl" />
      </div>
    );
  }

  if (media.hero === undefined) return null;
  const slot = getMediaSlot(media.hero);

  return (
    <MediaFrame ratio={slot.ratio} radius="xl">
      <MediaSlot id={media.hero} sizes="(min-width: 1280px) 1200px, 100vw" position="top" preload />
    </MediaFrame>
  );
}
