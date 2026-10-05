"use client";

import { useEffect } from "react";

import { ErrorScreen } from "@/components/layout/ErrorScreen";
import { Button } from "@/components/ui/Button";
import { errorPages } from "@/content/errors";

const copy = errorPages.error;

interface ErrorPageProps {
  error: Error & { digest?: string };
  retry: () => void;
}

/** The error boundary for every page: never a stack trace or an error message. */
export default function ErrorPage({ error, retry }: Readonly<ErrorPageProps>) {
  useEffect(() => {
    // The digest matches the server log entry; nothing personal is logged.
    console.error("Page error", error.digest ?? "client");
  }, [error]);

  return (
    <ErrorScreen eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead}>
      <Button onClick={retry}>Try again</Button>
      <Button variant="secondary" href="/">
        Back home
      </Button>
    </ErrorScreen>
  );
}
