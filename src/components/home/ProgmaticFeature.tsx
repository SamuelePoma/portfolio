import Image from "next/image";

import { ProgmaticScene } from "@/components/scenes/ProgmaticScene";
import { Button } from "@/components/ui/Button";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { StatusLabel } from "@/components/ui/StatusLabel";
import { TagList } from "@/components/ui/Tag";
import { projects } from "@/content/projects";
import { progmaticLayers } from "@/content/scenes";
import { projectMeta } from "@/lib/format/project-meta";

const project = projects.find((candidate) => candidate.slug === "progmatic-ai-knowledge-assistant");

/** The Progmatic assistant as an exploded view, with its text (DESIGN.md §9.2b). */
export function ProgmaticFeature() {
  if (!project) return null;
  const titleId = `project-${project.slug}`;

  return (
    <ProgmaticScene
      titleId={titleId}
      copy={
        <>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <MonoLabel as="p">{projectMeta(project)}</MonoLabel>
            <StatusLabel />
          </div>
          <h3 id={titleId} className="text-h1">
            {project.title}
          </h3>
          <p className="text-body text-ink-secondary">{project.tagline}</p>
          <TagList tags={project.stack} />
          <div>
            <Button variant="secondary" href={`/work/${project.slug}`} icon="arrow-right">
              Read the case study
            </Button>
          </div>
        </>
      }
      layers={progmaticLayers.map((layer, index) => ({
        id: layer.id,
        label: layer.label,
        text: layer.text,
        image: (
          <Image
            src={layer.image}
            alt={index === 0 ? "The assistant's overview screen" : ""}
            fill
            sizes="(min-width: 1024px) 760px, 100vw"
            className="object-cover object-left-top"
          />
        ),
      }))}
    />
  );
}
