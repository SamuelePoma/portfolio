import { ImageResponse } from "next/og";

import { OG_SIZE, OgCard, ogFonts } from "@/components/seo/OgCard";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { publicEnv } from "@/lib/env/public";
import { projectMeta } from "@/lib/format/project-meta";

export const alt = "Case study card with the project title";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((candidate) => candidate.slug === slug);
  const host = new URL(publicEnv.NEXT_PUBLIC_SITE_URL).host;
  return new ImageResponse(
    <OgCard
      eyebrow={project ? projectMeta(project) : "Case study"}
      title={project?.title ?? site.name}
      footer={`${host}/work/${slug}`}
    />,
    { ...size, fonts: await ogFonts() },
  );
}
