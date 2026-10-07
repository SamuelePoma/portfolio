"use client";

import "./globals.css";

import { useEffect } from "react";

import { ErrorScreen } from "@/components/layout/ErrorScreen";
import { Button } from "@/components/ui/Button";
import { errorPages } from "@/content/errors";
import { cn } from "@/lib/utils/cn";

import { geistMono, geistSans } from "./fonts";

const copy = errorPages.error;

interface GlobalErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

/**
 * Replaces the root layout when it fails, so it brings its own document, styles and
 * fonts. Metadata exports aren't supported here, hence the React <title>.
 */
export default function GlobalError({ error, retry }: Readonly<GlobalErrorProps>) {
  useEffect(() => {
    console.error("Root error", error.digest ?? "client");
  }, [error]);

  return (
    <html lang="en" className={cn(geistSans.variable, geistMono.variable)}>
      <body>
        <title>{`${copy.title.replace(".", "")} | Samuele Poma`}</title>
        <main>
          <ErrorScreen eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead}>
            <Button onClick={retry}>Try again</Button>
            <Button variant="secondary" href="/">
              Back home
            </Button>
          </ErrorScreen>
        </main>
      </body>
    </html>
  );
}
