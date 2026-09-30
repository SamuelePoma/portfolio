import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { MonoLabel } from "@/components/ui/MonoLabel";
import { TagList } from "@/components/ui/Tag";
import type { CardVisual } from "@/content/schema";
import { projectMeta } from "@/lib/format/project-meta";
import { cn } from "@/lib/utils/cn";

import { CardMedia } from "./CardMedia";

export interface ProjectCardProps {
  slug: string;
  title: string;
  organisation?: string;
  category: string;
  period?: { start: string; end?: string };
  status: "completed" | "in-progress";
  tagline: string;
  stack: readonly string[];
  card: CardVisual;
  className?: string;
}

/**
 * Project card (DESIGN.md §8.7). The title link is stretched over the whole card, so
 * the card is one click target while screen readers hear a single, short link name.
 */
export function ProjectCard({
  slug,
  title,
  organisation,
  category,
  period,
  status,
  tagline,
  stack,
  card,
  className,
}: Readonly<ProjectCardProps>) {
  const meta = projectMeta({
    category,
    ...(organisation === undefined ? {} : { organisation }),
    ...(period === undefined ? {} : { period }),
  });

  return (
    <article
      className={cn(
        "group relative rounded-lg bg-surface shadow-card",
        "transition-transform duration-200 ease-out hover:-translate-y-0.5",
        "has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-accent",
        className,
      )}
    >
      {/* Hover elevation crossfades on its own layer instead of animating box-shadow.
          It sits outside the clipping wrapper below, or overflow-hidden would cut it. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 shadow-card-hover transition-opacity duration-200 ease-out group-hover:opacity-100"
      />

      <div className="relative flex h-full flex-col overflow-hidden rounded-[inherit]">
        <CardMedia visual={card} />

        <div className="flex flex-1 flex-col gap-3 p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <MonoLabel as="p">{meta}</MonoLabel>
              {status === "in-progress" && (
                <MonoLabel as="p" tone="accent" className="inline-flex items-center gap-2">
                  <span aria-hidden className="size-1.5 rounded-full bg-accent" />
                  <span>In progress</span>
                </MonoLabel>
              )}
            </div>
            <ArrowRight
              aria-hidden
              size={18}
              strokeWidth={1.75}
              className="shrink-0 text-ink-tertiary transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-ink"
            />
          </div>

          <h3 className="text-h3">
            <Link
              href={`/work/${slug}`}
              className="outline-hidden after:absolute after:inset-0 after:content-['']"
            >
              {title}
            </Link>
          </h3>
          <p className="max-w-[52ch] text-small text-ink-secondary">{tagline}</p>
          <TagList tags={stack} className="mt-auto pt-3" />
        </div>
      </div>
    </article>
  );
}
