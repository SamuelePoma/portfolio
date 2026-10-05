import type { Metadata } from "next";

import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";
import { Hero } from "@/components/home/Hero";
import { SelectedWork } from "@/components/home/SelectedWork";
import { StackSection } from "@/components/home/StackSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/content/site";
import { skillGroups } from "@/content/skills";
import { publicEnv } from "@/lib/env/public";
import { homeJsonLd } from "@/lib/seo/jsonld";
import { HOME_TITLE, pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: HOME_TITLE,
  description: site.seoDescription,
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={homeJsonLd({
          siteUrl: publicEnv.NEXT_PUBLIC_SITE_URL,
          role: site.role,
          github: site.github,
          linkedin: site.linkedin,
          skills: skillGroups.flatMap((group) => group.items),
        })}
      />
      <Hero />
      <SelectedWork />
      <StackSection />
      <About />
      <Contact />
    </>
  );
}
