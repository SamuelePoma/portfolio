import type { MetadataRoute } from "next";

import { publicEnv } from "@/lib/env/public";
import { absoluteUrl, isIndexable } from "@/lib/seo/metadata";

/** Production: everything but the API. Previews and local builds: nothing. */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable()) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: absoluteUrl("/sitemap.xml", publicEnv.NEXT_PUBLIC_SITE_URL),
  };
}
