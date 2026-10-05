import { Container } from "@/components/layout/Container";
import { ProjectRail, RAIL_CARD_WIDTH } from "@/components/motion/ProjectRail";
import { ScrollWords } from "@/components/motion/ScrollWords";
import { TiltCard } from "@/components/motion/TiltCard";
import { projects } from "@/content/projects";

import { FeaturedProject } from "./FeaturedProject";
import { ProgmaticFeature } from "./ProgmaticFeature";
import { ProjectCard } from "./ProjectCard";

/** Projects with a scene of their own; the rest ride the rail. */
const SCENE_SLUGS = new Set(["musetrail", "progmatic-ai-knowledge-assistant"]);

/**
 * The work, told as a product launch (DESIGN.md §9.2): MuseTrail's reveal, Progmatic's
 * exploded view, then every other project on a horizontal rail.
 */
export function SelectedWork() {
  const featured = projects.find((project) => "featured" in project && project.featured);
  const others = projects.filter((project) => !SCENE_SLUGS.has(project.slug));

  return (
    <section id="work" aria-labelledby="work-title" className="section-t">
      <Container className="pb-16 md:pb-24">
        <h2 id="work-title" className="max-w-[12ch] text-display-xl">
          <ScrollWords text="Things I've built." />
        </h2>
      </Container>

      {featured && <FeaturedProject {...featured} />}
      <ProgmaticFeature />

      <ProjectRail
        count={others.length}
        heading={
          <h3 className="text-display">
            <ScrollWords text="More work." />
          </h3>
        }
      >
        {others.map((project) => (
          <TiltCard
            key={project.slug}
            className="shrink-0 snap-start"
            style={{ width: RAIL_CARD_WIDTH }}
          >
            <ProjectCard {...project} className="h-full" />
          </TiltCard>
        ))}
      </ProjectRail>
    </section>
  );
}
