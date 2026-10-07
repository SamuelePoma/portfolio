import { MediaFrame } from "@/components/ui/MediaFrame";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { PhonePair } from "@/components/visuals/PhonePair";
import { TerminalChess } from "@/components/visuals/TerminalChess";
import { getMediaSlot } from "@/content/media";
import type { Project } from "@/content/schema";

type CaseStudyHeroProps = Pick<Project, "card" | "media">;

/** Whether a project has a main visual to show under its title. */
export function hasHeroVisual({ card, media }: Readonly<CaseStudyHeroProps>): boolean {
  const [front, back] = media.screens ?? [];
  return Boolean(front && back) || card.type === "terminal" || media.hero !== undefined;
}

/**
 * The case study's main visual, the same product the card shows: phones for a mobile
 * app, the terminal for the chess game, otherwise the hero screenshot in a browser
 * frame. It floats over the edge of the dark header (CaseStudyHeader), so it has no
 * tray of its own. It is the page's largest image, so it is preloaded.
 */
export function CaseStudyHero({ card, media }: Readonly<CaseStudyHeroProps>) {
  const [front, back] = media.screens ?? [];

  if (front && back) {
    return (
      <PhonePair
        front={front}
        back={back}
        sizes="(min-width: 1024px) 320px, 40vw"
        preload
        className="mx-auto max-w-3xl"
      />
    );
  }

  if (card.type === "terminal") {
    return <TerminalChess variant="full" className="mx-auto max-w-3xl" />;
  }

  if (media.hero === undefined) return null;
  const slot = getMediaSlot(media.hero);

  return (
    <MediaFrame ratio={slot.ratio} radius="xl">
      <MediaSlot id={media.hero} sizes="(min-width: 1280px) 1200px, 100vw" position="top" preload />
    </MediaFrame>
  );
}
