import { Container } from "@/components/layout/Container";
import { ProjectRail, RAIL_CARD_WIDTH } from "@/components/motion/ProjectRail";
import { ScrollWords } from "@/components/motion/ScrollWords";
import { TiltCard } from "@/components/motion/TiltCard";
import { projects } from "@/content/projects";

import { FeaturedProject } from "./FeaturedProject";
import { LaptopFeature } from "./LaptopFeature";
import { ProgmaticFeature } from "./ProgmaticFeature";
import { ProjectCard } from "./ProjectCard";

/** Projects with a scene of their own; the rest ride the rail. */
const SCENE_SLUGS = new Set([
  "young-dcc-platform",
  "musetrail",
  "progmatic-ai-knowledge-assistant",
]);

/**
 * The work, told as a product launch (DESIGN.md §9.2): the Young DCC platform opening
 * on a laptop, MuseTrail's reveal, Progmatic's exploded view, then every other
 * project on a horizontal rail.
 *
 * The section is a light sheet that slides up over the opening's last screen while
 * the laptop is still pinned behind it (`-mt-[100svh]`, the overlap HeroScene plans
 * for). With reduced motion the opening isn't pinned, so the sheet stays in the flow.
 */
export function SelectedWork() {
  const featured = projects.find((project) => "featured" in project && project.featured);
  const others = projects.filter((project) => !SCENE_SLUGS.has(project.slug));

  return (
    <section
      id="work"
      data-tone="light"
      aria-labelledby="work-title"
      className="relative z-10 -mt-[100svh] rounded-t-[28px] bg-canvas section-t motion-reduce:mt-0 md:rounded-t-[48px]"
    >
      <Container className="grid grid-cols-1 gap-8 pb-16 md:pb-24 lg:grid-cols-12 lg:items-end lg:gap-12">
        <h2 id="work-title" className="max-w-[12ch] text-display-xl lg:col-span-7">
          <ScrollWords text="Things I've built." />
        </h2>
        <p className="max-w-[40ch] text-lead text-ink-secondary lg:col-span-5 lg:pb-3">
          {String(projects.length)} projects, from a team app that won a Dragons&apos; Den grand
          prize to the local AI assistant we&apos;re building for Progmatic.
        </p>
      </Container>

      <LaptopFeature />
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
