import type { MetadataRoute } from "next";

import { site } from "@/content/site";

/** The web app manifest; icons come from `pnpm icons`. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name}, ${site.role}`,
    short_name: "SP",
    description: site.seoDescription,
    start_url: "/",
    display: "browser",
    theme_color: "#fafafa",
    background_color: "#fafafa",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
