import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";
import { privacyPolicy } from "@/content/legal";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: privacyPolicy.title,
  description: privacyPolicy.seoDescription,
  path: "/privacy",
});

export default function Page() {
  return <LegalPage {...privacyPolicy} />;
}
