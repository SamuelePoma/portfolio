import type { MetadataRoute } from "next";

import { legalDocuments } from "@/content/legal";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { publicEnv } from "@/lib/env/public";
import { absoluteUrl } from "@/lib/seo/metadata";

/** Home, every case study and the legal pages, dated from the content. */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => absoluteUrl(path, publicEnv.NEXT_PUBLIC_SITE_URL);
  return [
    { url: url("/"), lastModified: site.contentUpdated, priority: 1 },
    ...projects.map((project) => ({
      url: url(`/work/${project.slug}`),
      lastModified: site.contentUpdated,
      priority: 0.8,
    })),
    ...legalDocuments.map((document) => ({
      url: url(`/${document.slug}`),
      lastModified: document.updated,
      priority: 0.2,
    })),
  ];
}
