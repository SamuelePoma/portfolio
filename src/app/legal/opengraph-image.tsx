import { ImageResponse } from "next/og";

import { OG_SIZE, OgCard, ogFonts } from "@/components/seo/OgCard";
import { legalNotice } from "@/content/legal";
import { site } from "@/content/site";
import { publicEnv } from "@/lib/env/public";

export const alt = `${legalNotice.title}, ${site.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <OgCard
      eyebrow={site.name}
      title={legalNotice.title}
      footer={`${new URL(publicEnv.NEXT_PUBLIC_SITE_URL).host}/legal`}
    />,
    { ...size, fonts: await ogFonts() },
  );
}
