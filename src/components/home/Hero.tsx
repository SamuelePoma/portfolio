import { HeroScene } from "@/components/scenes/HeroScene";
import { Button } from "@/components/ui/Button";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

/** The project the laptop opens on in the hero. */
const onScreen = projects.find((project) => project.slug === "young-dcc-platform");

/** The opening scene, with its server-rendered pieces (DESIGN.md §9.1). */
export function Hero() {
  return (
    <HeroScene
      eyebrow={site.heroEyebrow}
      lead={site.heroLead}
      actions={
        <>
          <Button href="#work" icon="arrow-down">
            View work
          </Button>
          <Button variant="secondary" href={site.github} icon="arrow-up-right">
            GitHub
          </Button>
        </>
      }
      screen={
        <MediaSlot id="IMG-YOUNGDCC-01" sizes="(min-width: 1024px) 900px, 90vw" position="top" />
      }
      caption={onScreen ? `${onScreen.title} · ${onScreen.organisation}` : ""}
    />
  );
}
