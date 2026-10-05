import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { CaseStudyBody } from "@/components/work/CaseStudyBody";
import { CaseStudyHeader } from "@/components/work/CaseStudyHeader";
import { CaseStudyHero } from "@/components/work/CaseStudyHero";
import { NextProject } from "@/components/work/NextProject";
import { projects } from "@/content/projects";
import type { Project } from "@/content/schema";
import { nextInLoop } from "@/lib/work/next-in-loop";

/** Every case study is built at build time; any other slug is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

/** The project for a slug, widened to the schema type, and the one after it. */
function findProject(slug: string): { project: Project; next: Project } | undefined {
  const list: readonly Project[] = projects;
  const index = list.findIndex((project) => project.slug === slug);
  const project = list[index];
  if (project === undefined) return undefined;
  return { project, next: nextInLoop(list, index) };
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const found = findProject((await params).slug);
  if (!found) return {};
  return {
    title: `${found.project.title} case study | Samuele Poma`,
    description: found.project.tagline,
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const found = findProject((await params).slug);
  if (!found) notFound();
  const { project, next } = found;
  const titleId = "case-study-title";

  return (
    <article aria-labelledby={titleId}>
      <Container>
        <CaseStudyHeader titleId={titleId} {...project} />
        <div className="py-12 md:py-16">
          <CaseStudyHero card={project.card} media={project.media} />
        </div>
        <CaseStudyBody {...project} />
        <NextProject slug={next.slug} title={next.title} />
      </Container>
    </article>
  );
}
