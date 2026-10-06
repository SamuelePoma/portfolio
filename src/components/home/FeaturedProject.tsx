import Image from "next/image";

import { Container } from "@/components/layout/Container";
import { RevealMedia } from "@/components/motion/RevealMedia";
import { MuseTrailScene } from "@/components/scenes/MuseTrailScene";
import { Button } from "@/components/ui/Button";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { TagList } from "@/components/ui/Tag";
import { getMediaSlot, type MediaSlotId } from "@/content/media";
import { formatPeriod } from "@/lib/format/period";

/** The artworks of the My Museum screen, cut out for the scene. Decorative. */
const artworks = [1, 2, 3, 4].map((n) => `/images/scenes/musetrail-art-${String(n)}.webp`);

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
 * The featured project (DESIGN.md §9.2a): a dark, pinned product reveal, then the photo
 * that backs up the highlight. The scene animates; this file renders its pieces.
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
  const sizes = "(min-width: 1024px) 300px, 40vw";

  if (!front || !back) return null;

  return (
    // A dark tile on the light page, like Apple's product tiles: rounded, inset from the
    // edges. `overflow: clip` rounds the corners without breaking the pinned stage inside.
    <div
      data-tone="night"
      className="tone-night mx-2 overflow-clip rounded-[28px] bg-canvas md:mx-4 md:rounded-[40px]"
    >
      <MuseTrailScene
        titleId={titleId}
        front={<MediaSlot id={front} sizes={sizes} position="top" />}
        back={<MediaSlot id={back} sizes={sizes} position="top" />}
        art={artworks.map((src) => (
          <Image key={src} src={src} alt="" width={240} height={260} className="h-auto w-full" />
        ))}
        copy={
          <>
            {highlight && (
              <MonoLabel as="p" tone="accent">
                {highlight}
              </MonoLabel>
            )}
            <h3 id={titleId} className="text-display">
              {title}
            </h3>
            <p className="max-w-[34ch] text-lead text-ink-secondary">{tagline}</p>
            {(role ?? period) && (
              <dl className="flex flex-col gap-4 border-t border-hairline pt-6">
                {role && (
                  <div className="flex flex-col gap-1">
                    <dt>
                      <MonoLabel>Role</MonoLabel>
                    </dt>
                    <dd className="text-small text-ink-secondary">{role}</dd>
                  </div>
                )}
                {period && (
                  <div className="flex flex-col gap-1">
                    <dt>
                      <MonoLabel>Timeline</MonoLabel>
                    </dt>
                    <dd className="text-small text-ink-secondary tabular">
                      {formatPeriod(period)}
                    </dd>
                  </div>
                )}
              </dl>
            )}
            <TagList tags={stack} />
            <div>
              <Button variant="secondary" href={`/work/${slug}`} icon="arrow-right">
                Read the case study
              </Button>
            </div>
          </>
        }
      />

      {photo && media.secondary && (
        <Container className="pb-24 md:pb-32">
          <figure className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-12">
            <RevealMedia className="rounded-xl lg:col-span-8 lg:col-start-5 lg:row-start-1">
              <MediaFrame variant="plain" ratio={photo.ratio} radius="xl">
                <MediaSlot
                  id={media.secondary}
                  sizes="(min-width: 1280px) 800px, (min-width: 1024px) 66vw, 100vw"
                />
              </MediaFrame>
            </RevealMedia>
            {photo.caption && (
              <figcaption className="text-small text-ink-secondary lg:col-span-4 lg:row-start-1 lg:self-end">
                {photo.caption}
              </figcaption>
            )}
          </figure>
        </Container>
      )}
    </div>
  );
}
