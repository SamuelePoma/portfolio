import { LaptopScene } from "@/components/scenes/LaptopScene";
import { Button } from "@/components/ui/Button";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { projects } from "@/content/projects";
import { projectMeta } from "@/lib/format/project-meta";

const project = projects.find((candidate) => candidate.slug === "young-dcc-platform");

/** The Young DCC platform, opening on a laptop (DESIGN.md §9.2). */
export function LaptopFeature() {
  if (!project) return null;
  const titleId = `project-${project.slug}`;

  return (
    <LaptopScene
      titleId={titleId}
      screen={
        <MediaSlot id={project.media.hero} sizes="(min-width: 1024px) 760px, 86vw" position="top" />
      }
      copy={
        <>
          <MonoLabel as="p">{projectMeta(project)}</MonoLabel>
          <h3 id={titleId} className="text-display">
            {project.title}
          </h3>
          <p className="max-w-[52ch] text-lead text-ink-secondary">{project.tagline}</p>
          <Button variant="secondary" href={`/work/${project.slug}`} icon="arrow-right">
            Read the case study
          </Button>
        </>
      }
    />
  );
}
