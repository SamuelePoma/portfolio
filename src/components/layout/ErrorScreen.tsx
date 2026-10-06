import type { ReactNode } from "react";

import { Glow } from "@/components/motion/Glow";
import { MonoLabel } from "@/components/ui/MonoLabel";

import { Container } from "./Container";

interface ErrorScreenProps {
  eyebrow: string;
  title: string;
  lead: string;
  /** The buttons: a way back, and a retry where it helps. */
  children: ReactNode;
}

/**
 * The shared layout of the 404 and error pages (DESIGN.md §9.8): a full dark screen over
 * the horizon, the same light that opens and closes the home page, with a way back.
 */
export function ErrorScreen({ eyebrow, title, lead, children }: Readonly<ErrorScreenProps>) {
  return (
    <section
      aria-labelledby="error-title"
      data-tone="night"
      className="tone-night relative isolate -mt-16 flex min-h-svh flex-col justify-center pt-32 pb-40"
    >
      <Glow variant="horizon" />
      <Container className="flex flex-col items-center text-center">
        <MonoLabel as="p">{eyebrow}</MonoLabel>
        <h1 id="error-title" className="mt-6 max-w-[16ch] text-display-xl">
          {title}
        </h1>
        <p className="mt-6 max-w-[40ch] text-lead text-ink-secondary">{lead}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">{children}</div>
      </Container>
    </section>
  );
}
