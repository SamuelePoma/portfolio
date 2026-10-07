import type { Metadata } from "next";

import { ErrorScreen } from "@/components/layout/ErrorScreen";
import { Button } from "@/components/ui/Button";
import { errorPages } from "@/content/errors";

const copy = errorPages.notFound;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <ErrorScreen eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead}>
      <Button href="/">Back home</Button>
      <Button variant="secondary" href="/#work" icon="arrow-right">
        View work
      </Button>
    </ErrorScreen>
  );
}
