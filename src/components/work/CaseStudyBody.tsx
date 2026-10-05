import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { ProgmaticDiagram } from "@/components/visuals/ProgmaticDiagram";
import { RagFlowDiagram } from "@/components/visuals/RagFlowDiagram";
import { VetComponentsDiagram } from "@/components/visuals/VetComponentsDiagram";
import { getMediaSlot } from "@/content/media";
import type { Project } from "@/content/schema";
import { publicFileExists } from "@/lib/public-file";

type CaseStudyBodyProps = Pick<
  Project,
  | "problem"
  | "approach"
  | "approachVisuals"
  | "outcome"
  | "highlights"
  | "learnings"
  | "links"
  | "media"
>;

interface CaseSectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

/** A titled section: the heading in the left columns, the reading column on the right. */
function CaseSection({ id, title, children }: Readonly<CaseSectionProps>) {
  return (
    <section
      aria-labelledby={id}
      className="grid grid-cols-1 gap-4 border-t border-hairline py-12 md:py-16 lg:grid-cols-12 lg:gap-12"
    >
      <h2 id={id} className="text-h2 lg:col-span-4">
        {title}
      </h2>
      <div className="flex flex-col gap-6 lg:col-span-8">{children}</div>
    </section>
  );
}

function Prose({ paragraphs }: Readonly<{ paragraphs: readonly string[] }>) {
  return (
    <div className="flex max-w-[60ch] flex-col gap-5 text-lead text-ink-secondary">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

/**
 * Problem, approach, outcome, learnings and links, then the gallery (DESIGN.md §9.3).
 * Sections without content are left out; gallery images whose file is missing are
 * skipped, because optional images never get a placeholder.
 */
export function CaseStudyBody({
  problem,
  approach,
  approachVisuals,
  outcome,
  highlights,
  learnings,
  links,
  media,
}: Readonly<CaseStudyBodyProps>) {
  const gallery = (media.gallery ?? [])
    .map((id) => ({ id, slot: getMediaSlot(id) }))
    .filter(({ slot }) => publicFileExists(`/images/${slot.file}`));

  return (
    <>
      {problem && (
        <CaseSection id="problem" title="Problem">
          <Prose paragraphs={[problem]} />
        </CaseSection>
      )}

      {approach && (
        <CaseSection id="approach" title="Approach">
          <Prose paragraphs={approach} />
          {approachVisuals?.map((visual) => (
            <div
              key={visual}
              className="mt-4 flex justify-center rounded-xl bg-surface-sunken px-4 py-10 md:px-8 md:py-12"
            >
              {visual === "research-map" && <ProgmaticDiagram />}
              {visual === "rag-flow" && <RagFlowDiagram />}
              {visual === "vet-components" && <VetComponentsDiagram />}
            </div>
          ))}
        </CaseSection>
      )}

      {(outcome ?? highlights) && (
        <CaseSection id="outcome" title="Outcome">
          {outcome && <Prose paragraphs={[outcome]} />}
          {highlights && (
            <ul className="flex flex-col gap-2">
              {highlights.map((highlight) => (
                <li key={highlight}>
                  <MonoLabel tone="accent">{highlight}</MonoLabel>
                </li>
              ))}
            </ul>
          )}
        </CaseSection>
      )}

      {learnings && (
        <CaseSection id="learnings" title="What I learned">
          <Prose paragraphs={learnings} />
        </CaseSection>
      )}

      {links && (links.repo ?? links.demo) && (
        <CaseSection id="links" title="Links">
          <ul className="flex flex-wrap gap-3">
            {links.repo && (
              <li>
                <Button variant="secondary" href={links.repo} icon="arrow-up-right">
                  Source code
                </Button>
              </li>
            )}
            {links.demo && (
              <li>
                <Button variant="secondary" href={links.demo} icon="arrow-up-right">
                  Live demo
                </Button>
              </li>
            )}
          </ul>
        </CaseSection>
      )}

      {gallery.length > 0 && (
        <div className="flex flex-col gap-12 border-t border-hairline py-12 md:py-16">
          {gallery.map(({ id, slot }) => (
            <figure key={id} className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-12">
              <MediaFrame
                variant="plain"
                ratio={slot.ratio}
                radius="xl"
                className="lg:col-span-8 lg:col-start-5 lg:row-start-1"
              >
                <MediaSlot
                  id={id}
                  sizes="(min-width: 1280px) 780px, (min-width: 1024px) 66vw, 100vw"
                />
              </MediaFrame>
              {slot.caption && (
                <figcaption className="text-small text-ink-secondary lg:col-span-4 lg:row-start-1 lg:self-end">
                  {slot.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </>
  );
}
