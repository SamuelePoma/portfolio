import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { TagList } from "@/components/ui/Tag";

// Dev-only route: the `.dev.tsx` extension keeps it out of production builds (next.config.ts).
export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const colorTokens = [
  "canvas",
  "surface",
  "surface-sunken",
  "ink",
  "ink-secondary",
  "ink-tertiary",
  "hairline",
  "hairline-strong",
  "accent",
  "danger",
] as const;

const typeScale = [
  { token: "display-xl", sample: "Samuele Poma." },
  { token: "display", sample: "Things I've built." },
  { token: "h1", sample: "GPS monitoring dashboard" },
  { token: "h2", sample: "Tools I reach for." },
  { token: "h3", sample: "Grid monitoring" },
  {
    token: "lead",
    sample:
      "I build full-stack software, from Go services to React interfaces, and take projects from the first requirement to the final release.",
  },
  {
    token: "body",
    sample:
      "A dashboard for tracking cars and bicycles, with live GPS data and vehicle information in one place. Built end to end, from problem analysis to delivery.",
  },
  { token: "small", sample: "Visualising regional power usage and detecting faulty transformers." },
  { token: "caption", sample: "Your message is only used to reply to you." },
  { token: "mono", sample: "> e2 e4" },
] as const;

const typeClass: Record<(typeof typeScale)[number]["token"], string> = {
  "display-xl": "text-display-xl",
  display: "text-display",
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
  lead: "text-lead text-ink-secondary",
  body: "text-body",
  small: "text-small text-ink-secondary",
  caption: "text-caption text-ink-secondary",
  mono: "font-mono text-mono",
};

const swatchClass: Record<(typeof colorTokens)[number], string> = {
  canvas: "bg-canvas",
  surface: "bg-surface",
  "surface-sunken": "bg-surface-sunken",
  ink: "bg-ink",
  "ink-secondary": "bg-ink-secondary",
  "ink-tertiary": "bg-ink-tertiary",
  hairline: "bg-hairline",
  "hairline-strong": "bg-hairline-strong",
  accent: "bg-accent",
  danger: "bg-danger",
};

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <div className="grid gap-8 border-t border-hairline pt-10 md:grid-cols-12">
      <h2 id={id} className="text-h3 md:col-span-3">
        {title}
      </h2>
      <div className="md:col-span-9">{children}</div>
    </div>
  );
}

function Swatches() {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {colorTokens.map((token) => (
        <li key={token} className="grid gap-2">
          <span
            className={`h-16 rounded-md ring-1 ring-hairline ring-inset ${swatchClass[token]}`}
          />
          <code className="font-mono text-mono-label font-normal text-ink-tertiary">--{token}</code>
        </li>
      ))}
    </ul>
  );
}

function Buttons() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button href="#work" icon="arrow-down">
        View work
      </Button>
      <Button variant="secondary" href="https://github.com/SamuelePoma" icon="arrow-up-right">
        GitHub
      </Button>
      <Button variant="secondary" href="/cv/samuele-poma-cv.pdf" icon="arrow-down">
        Résumé (PDF)
      </Button>
      <Button icon="arrow-right">Send message</Button>
      <Button disabled>Sending…</Button>
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <main>
      <Section aria-labelledby="styleguide-title">
        <Container className="grid gap-16">
          <header className="grid gap-4">
            <MonoLabel as="p">Dev only, not in production builds</MonoLabel>
            <h1 id="styleguide-title" className="text-display">
              Styleguide
            </h1>
            <p className="max-w-prose text-lead text-ink-secondary">
              Every token and primitive from DESIGN.md, rendered with the real components.
            </p>
          </header>

          <Block id="sg-color" title="Color">
            <Swatches />
          </Block>

          <Block id="sg-type" title="Type scale">
            <ul className="grid gap-8">
              {typeScale.map(({ token, sample }) => (
                <li key={token} className="grid gap-2">
                  <MonoLabel>text-{token}</MonoLabel>
                  <p className={`max-w-prose ${typeClass[token]}`}>{sample}</p>
                </li>
              ))}
            </ul>
          </Block>

          <Block id="sg-buttons" title="Buttons">
            <Buttons />
          </Block>

          <Block id="sg-labels" title="Labels and tags">
            <div className="grid gap-6">
              <MonoLabel as="p">2024 · Internship</MonoLabel>
              <TagList tags={["Go", "SvelteKit", "Docker", "Design patterns"]} />
            </div>
          </Block>

          <Block id="sg-media" title="Media">
            <div className="grid items-start gap-6 md:grid-cols-12">
              <MediaFrame ratio="16:10" url="dashboard.conneqtech.com" className="md:col-span-8">
                <MediaSlot id="IMG-CONNEQTECH-01" sizes="(min-width: 768px) 60vw, 100vw" />
              </MediaFrame>
              <MediaFrame variant="plain" ratio="4:5" className="md:col-span-4">
                <MediaSlot id="IMG-MUSETRAIL-02" sizes="(min-width: 768px) 30vw, 100vw" />
              </MediaFrame>
            </div>
          </Block>

          <Block id="sg-elevation" title="Elevation">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-lg bg-surface p-8 shadow-card">
                <MonoLabel as="p">shadow-card</MonoLabel>
              </div>
              <div className="rounded-lg bg-surface p-8 shadow-card-hover">
                <MonoLabel as="p">shadow-card-hover</MonoLabel>
              </div>
            </div>
          </Block>
        </Container>
      </Section>

      <Section tone="night" aria-labelledby="styleguide-night">
        <Container className="grid gap-16">
          <header className="grid gap-4">
            <MonoLabel as="p">Tone night</MonoLabel>
            <h2 id="styleguide-night" className="text-display">
              Let&apos;s talk.
            </h2>
            <p className="max-w-prose text-lead text-ink-secondary">
              The same components inside a dark band. Nothing here has a dark variant: the tokens
              are remapped by the section.
            </p>
          </header>
          <Block id="sg-night-color" title="Color">
            <Swatches />
          </Block>
          <Block id="sg-night-buttons" title="Buttons">
            <Buttons />
          </Block>
          <Block id="sg-night-labels" title="Labels and tags">
            <div className="grid gap-6">
              <MonoLabel as="p">Grand prize · Dragons&apos; Den</MonoLabel>
              <TagList tags={["SvelteKit", "Docker"]} />
            </div>
          </Block>
          <Block id="sg-night-media" title="Media">
            <MediaFrame ratio="16:10" url="musetrail.app" radius="xl">
              <MediaSlot id="IMG-MUSETRAIL-01" sizes="(min-width: 768px) 70vw, 100vw" />
            </MediaFrame>
          </Block>
        </Container>
      </Section>
    </main>
  );
}
