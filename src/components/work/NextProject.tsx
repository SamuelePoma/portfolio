import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { CardMedia } from "@/components/home/CardMedia";
import { Glow } from "@/components/motion/Glow";
import { MonoLabel } from "@/components/ui/MonoLabel";
import type { Project } from "@/content/schema";
import { projectMeta } from "@/lib/format/project-meta";

interface NextProjectProps {
  project: Project;
}

/**
 * The next case study, looping back to the first (DESIGN.md §9.3): a dark tile over
 * the horizon, like the home page's, with the project's title on one side and its card
 * visual rising from the bottom edge on the other. The whole tile is one link.
 */
export function NextProject({ project }: Readonly<NextProjectProps>) {
  const meta = projectMeta(project);

  return (
    <nav aria-label="Next project" className="px-2 pt-16 pb-2 md:px-4 md:pt-24 md:pb-4">
      <Link
        href={`/work/${project.slug}`}
        aria-label={`Next project: ${project.title}`}
        data-tone="night"
        className="tone-night group relative isolate grid grid-cols-1 overflow-clip rounded-[28px] md:rounded-[40px] lg:grid-cols-2"
      >
        <Glow variant="horizon" />
        <div className="flex flex-col gap-10 p-8 pb-10 md:p-14">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <MonoLabel tone="accent">Next project</MonoLabel>
            <MonoLabel>{meta}</MonoLabel>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-display">{project.title}</span>
            <span className="max-w-[40ch] text-lead text-ink-secondary">{project.tagline}</span>
          </div>
          <span className="mt-auto inline-flex items-center gap-2 text-small font-medium text-ink">
            Read the case study
            <ArrowRight
              aria-hidden
              size={16}
              strokeWidth={1.75}
              className="transition-transform duration-200 ease-out group-hover:translate-x-1"
            />
          </span>
        </div>
        <div aria-hidden className="self-end px-5 md:px-14 lg:pt-14 lg:pr-14 lg:pl-0">
          <CardMedia visual={project.card} bare />
        </div>
      </Link>
    </nav>
  );
}
