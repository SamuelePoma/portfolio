import type { ReactNode } from "react";

import { MonoLabel } from "@/components/ui/MonoLabel";
import { MeshGradient } from "@/components/visuals/MeshGradient";

import { Container } from "./Container";

interface ErrorScreenProps {
  eyebrow: string;
  title: string;
  lead: string;
  /** The buttons: a way back, and a retry where it helps. */
  children: ReactNode;
}

/**
 * The shared layout of the 404 and error pages (DESIGN.md §9.8): the hero's structure,
 * with a faint mesh, the only exception to the hero-only rule.
 */
export function ErrorScreen({ eyebrow, title, lead, children }: Readonly<ErrorScreenProps>) {
  return (
    <section
      aria-labelledby="error-title"
      className="relative isolate -mt-16 flex min-h-[80svh] flex-col justify-end pt-32 pb-24"
    >
      <MeshGradient className="opacity-40" />
      <Container>
        <MonoLabel as="p">{eyebrow}</MonoLabel>
        <h1 id="error-title" className="mt-6 max-w-[16ch] text-display">
          {title}
        </h1>
        <p className="mt-6 max-w-[40ch] text-lead text-ink-secondary">{lead}</p>
        <div className="mt-10 flex flex-wrap gap-3">{children}</div>
      </Container>
    </section>
  );
}
