import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";
import { legalNotice } from "@/content/legal";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: legalNotice.title,
  description: legalNotice.seoDescription,
  path: "/legal",
});

export default function Page() {
  return <LegalPage {...legalNotice} />;
}
