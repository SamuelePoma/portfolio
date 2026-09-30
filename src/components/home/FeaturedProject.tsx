import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { TagList } from "@/components/ui/Tag";
import type { MediaSlotId } from "@/content/media";
import { formatPeriod } from "@/lib/format/period";

interface FeaturedProjectProps {
  slug: string;
  title: string;
  tagline: string;
  role: string;
  period?: { start: string; end?: string };
  stack: readonly string[];
  highlight?: string;
  media: { hero?: MediaSlotId; secondary?: MediaSlotId };
}

/**
 * The featured project as a full-bleed dark band (DESIGN.md §9.2a): text on the left,
 * the product in a browser frame on the right, and a photo overlapping its corner.
 */
export function FeaturedProject({
  slug,
  title,
  tagline,
  role,
  period,
  stack,
  highlight,
  media,
}: Readonly<FeaturedProjectProps>) {
  const titleId = `project-${slug}`;

  return (
    <article aria-labelledby={titleId} data-tone="night" className="tone-night py-20 md:py-28">
      <Container className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col gap-6 lg:col-span-5">
          {highlight && (
            <MonoLabel as="p" tone="accent">
              {highlight}
            </MonoLabel>
          )}
          <h3 id={titleId} className="text-display">
            {title}
          </h3>
          <p className="max-w-[36ch] text-lead text-ink-secondary">{tagline}</p>

          <dl className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-10 gap-y-6 border-t border-hairline pt-6">
            <div className="flex flex-col gap-2">
              <dt>
                <MonoLabel>Role</MonoLabel>
              </dt>
              <dd className="text-small text-ink-secondary">{role}</dd>
            </div>
            {period && (
              <div className="flex flex-col gap-2">
                <dt>
                  <MonoLabel>Timeline</MonoLabel>
                </dt>
                <dd className="text-small text-ink-secondary tabular">{formatPeriod(period)}</dd>
              </div>
            )}
          </dl>

          <TagList tags={stack} />
          <div className="pt-2">
            <Button variant="secondary" href={`/work/${slug}`} icon="arrow-right">
              Read the case study
            </Button>
          </div>
        </div>

        {media.hero && (
          <div className="relative pb-12 lg:col-span-7 lg:pb-16">
            <MediaFrame ratio="16:10" radius="xl">
              <MediaSlot
                id={media.hero}
                sizes="(min-width: 1280px) 700px, (min-width: 1024px) 58vw, 100vw"
                position="top"
              />
            </MediaFrame>
            {media.secondary && (
              // Positioned by a wrapper: the frame is `relative` itself, and components
              // never have their classes overridden (see `cn`).
              <div className="absolute right-3 bottom-0 w-[38%] sm:right-6 lg:right-auto lg:-left-10 lg:w-[34%]">
                <MediaFrame variant="plain" ratio="4:5" className="shadow-card-hover">
                  <MediaSlot id={media.secondary} sizes="(min-width: 1024px) 240px, 38vw" />
                </MediaFrame>
              </div>
            )}
          </div>
        )}
      </Container>
    </article>
  );
}
