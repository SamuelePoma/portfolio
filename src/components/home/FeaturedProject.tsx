import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { TagList } from "@/components/ui/Tag";
import { PhonePair } from "@/components/visuals/PhonePair";
import { getMediaSlot, type MediaSlotId } from "@/content/media";
import { formatPeriod } from "@/lib/format/period";

interface FeaturedProjectProps {
  slug: string;
  title: string;
  tagline: string;
  role?: string;
  period?: { start: string; end?: string };
  stack: readonly string[];
  highlight?: string;
  media: {
    hero?: MediaSlotId;
    secondary?: MediaSlotId;
    screens?: readonly MediaSlotId[];
  };
}

/**
 * The featured project as a full-bleed dark band (DESIGN.md §9.2a): text on the left
 * and the product on the right (phones for a mobile app, a browser frame otherwise),
 * then a photo that backs up the highlight.
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
  const [front, back] = media.screens ?? [];
  const photo = media.secondary ? getMediaSlot(media.secondary) : undefined;

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

          {(role ?? period) && (
            <dl className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-10 gap-y-6 border-t border-hairline pt-6">
              {role && (
                <div className="flex flex-col gap-2">
                  <dt>
                    <MonoLabel>Role</MonoLabel>
                  </dt>
                  <dd className="text-small text-ink-secondary">{role}</dd>
                </div>
              )}
              {period && (
                <div className="flex flex-col gap-2">
                  <dt>
                    <MonoLabel>Timeline</MonoLabel>
                  </dt>
                  <dd className="text-small text-ink-secondary tabular">{formatPeriod(period)}</dd>
                </div>
              )}
            </dl>
          )}

          <TagList tags={stack} />
          <div className="pt-2">
            <Button variant="secondary" href={`/work/${slug}`} icon="arrow-right">
              Read the case study
            </Button>
          </div>
        </div>

        {front && back ? (
          <PhonePair front={front} back={back} className="mx-auto max-w-xl lg:col-span-7" />
        ) : (
          media.hero && (
            <div className="lg:col-span-7">
              <MediaFrame ratio="16:10" radius="xl">
                <MediaSlot
                  id={media.hero}
                  sizes="(min-width: 1280px) 700px, (min-width: 1024px) 58vw, 100vw"
                  position="top"
                />
              </MediaFrame>
            </div>
          )
        )}
      </Container>

      {photo && media.secondary && (
        <Container className="mt-20 md:mt-28">
          {/* From lg the caption sits in the text column, level with the photo's bottom edge. */}
          <figure className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-12">
            <MediaFrame
              variant="plain"
              ratio={photo.ratio}
              radius="xl"
              className="lg:col-span-7 lg:col-start-6 lg:row-start-1"
            >
              <MediaSlot
                id={media.secondary}
                sizes="(min-width: 1280px) 700px, (min-width: 1024px) 58vw, 100vw"
              />
            </MediaFrame>
            {photo.caption && (
              <figcaption className="text-small text-ink-secondary lg:col-span-4 lg:row-start-1 lg:self-end">
                {photo.caption}
              </figcaption>
            )}
          </figure>
        </Container>
      )}
    </article>
  );
}
