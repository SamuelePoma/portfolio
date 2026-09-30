import { Container } from "@/components/layout/Container";
import { projects } from "@/content/projects";

import { FeaturedProject } from "./FeaturedProject";
import { ProjectCard } from "./ProjectCard";

/** Bento rhythm on large screens: 7 + 5, then 5 + 7 (DESIGN.md §9.2b). */
const bentoSpans = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"] as const;

export function SelectedWork() {
  const featured = projects.find((project) => "featured" in project && project.featured);
  const others = projects.filter((project) => project !== featured);

  return (
    <section id="work" aria-labelledby="work-title" className="section-t">
      <Container>
        <h2 id="work-title" className="text-display">
          Things I&apos;ve built.
        </h2>
      </Container>

      {featured && (
        <div className="mt-12 md:mt-16">
          <FeaturedProject {...featured} />
        </div>
      )}

      <Container className="pt-16 md:pt-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
          {others.map((project, index) => (
            <ProjectCard
              key={project.slug}
              {...project}
              className={bentoSpans[index % bentoSpans.length] ?? ""}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
