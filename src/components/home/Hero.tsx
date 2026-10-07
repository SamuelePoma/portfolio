import { HeroScene } from "@/components/scenes/HeroScene";
import { Button } from "@/components/ui/Button";
import { site } from "@/content/site";

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
    />
  );
}
