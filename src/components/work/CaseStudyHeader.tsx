import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { StatusLabel } from "@/components/ui/StatusLabel";
import type { Project } from "@/content/schema";
import { projectMeta } from "@/lib/format/project-meta";

import { MetaRow } from "./MetaRow";

type CaseStudyHeaderProps = Pick<
  Project,
  | "title"
  | "tagline"
  | "organisation"
  | "category"
  | "period"
  | "status"
  | "role"
  | "team"
  | "stack"
> & { titleId: string };

/** Breadcrumbs, the context line, the title and the one-liner, then the meta row. */
export function CaseStudyHeader({
  titleId,
  title,
  tagline,
  organisation,
  category,
  period,
  status,
  role,
  team,
  stack,
}: Readonly<CaseStudyHeaderProps>) {
  const meta = projectMeta({ category, organisation, period });

  return (
    <header className="flex flex-col gap-12 pt-6 md:gap-16 md:pt-10">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Work", href: "/#work" }, { label: title }]}
      />
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <MonoLabel as="p">{meta}</MonoLabel>
          {status === "in-progress" && <StatusLabel />}
        </div>
        <h1 id={titleId} className="text-display">
          {title}
        </h1>
        <p className="max-w-[44ch] text-lead text-ink-secondary">{tagline}</p>
      </div>
      <MetaRow role={role} team={team} period={period} stack={stack} />
    </header>
  );
}
