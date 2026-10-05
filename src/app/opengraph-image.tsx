import { ImageResponse } from "next/og";

import { OG_SIZE, OgCard, ogFonts } from "@/components/seo/OgCard";
import { site } from "@/content/site";
import { publicEnv } from "@/lib/env/public";

export const alt = `${site.name}, ${site.role.toLowerCase()} in ${site.location}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <OgCard
      eyebrow={site.heroEyebrow}
      title={`${site.name}.`}
      footer={new URL(publicEnv.NEXT_PUBLIC_SITE_URL).host}
    />,
    { ...size, fonts: await ogFonts() },
  );
}
