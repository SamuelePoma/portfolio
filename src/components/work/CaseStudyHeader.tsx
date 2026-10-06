import { Container } from "@/components/layout/Container";
import { Glow } from "@/components/motion/Glow";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { StatusLabel } from "@/components/ui/StatusLabel";
import type { Project } from "@/content/schema";
import { projectMeta } from "@/lib/format/project-meta";

import { CaseStudyHero, hasHeroVisual } from "./CaseStudyHero";

type CaseStudyHeaderProps = Pick<
  Project,
  "title" | "tagline" | "organisation" | "category" | "period" | "status" | "card" | "media"
> & { titleId: string };

/**
 * How far the main visual reaches up into the dark header: it floats over the horizon,
 * half on the dark band and half on the page, like a product on a stage.
 */
const OVERLAP = "clamp(8rem, 18vw, 17rem)";

/**
 * A case study's opening (DESIGN.md §9.3): a dark band with the same horizon as the
 * home page, the breadcrumbs, the context line, the title and the one-liner, then the
 * project's main visual rising out of it onto the light page.
 */
export function CaseStudyHeader({
  titleId,
  title,
  tagline,
  organisation,
  category,
  period,
  status,
  card,
  media,
}: Readonly<CaseStudyHeaderProps>) {
  const meta = projectMeta({ category, organisation, period });
  const visual = hasHeroVisual({ card, media });

  return (
    <header>
      <div
        data-tone="night"
        className="tone-night relative isolate -mt-16 overflow-hidden pt-28 md:pt-32"
        style={{ paddingBottom: visual ? `calc(4rem + ${OVERLAP})` : "clamp(6rem, 10vw, 9rem)" }}
      >
        <Glow variant="horizon" />
        <Container className="flex flex-col gap-12 md:gap-16">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Work", href: "/#work" },
              { label: title },
            ]}
          />
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <MonoLabel as="p">{meta}</MonoLabel>
              {status === "in-progress" && <StatusLabel />}
            </div>
            <h1 id={titleId} className="max-w-[16ch] text-display-xl">
              {title}
            </h1>
            <p className="max-w-[48ch] text-lead text-ink-secondary">{tagline}</p>
          </div>
        </Container>
      </div>
      {visual && (
        <Container className="relative z-10" style={{ marginTop: `calc(-1 * ${OVERLAP})` }}>
          <CaseStudyHero card={card} media={media} />
        </Container>
      )}
    </header>
  );
}
