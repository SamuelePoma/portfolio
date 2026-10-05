import { Container } from "@/components/layout/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { MonoLabel } from "@/components/ui/MonoLabel";
import type { LegalDocument, LegalSection } from "@/content/schema";
import { publicEnv } from "@/lib/env/public";
import { legalPageJsonLd } from "@/lib/seo/jsonld";

function Section({ id, title, paragraphs, items, links }: Readonly<LegalSection>) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4 border-t border-hairline pt-8">
      <div className="group flex items-baseline gap-2">
        <h2 id={id} className="scroll-mt-24 text-h2">
          {title}
        </h2>
        {/* Shown on hover or focus, so a section can be linked to directly. */}
        <a
          href={`#${id}`}
          className="rounded-sm text-h2 text-ink-tertiary opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100 focus-visible:opacity-100"
        >
          <span aria-hidden>#</span>
          <span className="sr-only">Link to the section {title}</span>
        </a>
      </div>
      {paragraphs?.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {items && (
        <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-ink-tertiary">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {links && (
        <ul className="flex flex-col gap-1">
          {links.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent"
              >
                {label} <span className="sr-only">(opens in new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** A long-form legal page in a single reading column (DESIGN.md §9.8). */
export function LegalPage({ slug, title, updated, intro, sections }: Readonly<LegalDocument>) {
  const path = `/${slug}`;
  return (
    <article aria-labelledby="legal-title" className="pb-24 md:pb-32">
      <JsonLd data={legalPageJsonLd(title, path, publicEnv.NEXT_PUBLIC_SITE_URL)} />
      <Container width="prose" className="flex flex-col gap-10 pt-6 md:pt-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />
        <header className="flex flex-col gap-4">
          <h1 id="legal-title" className="text-h1">
            {title}
          </h1>
          <MonoLabel as="p">
            Last updated <time dateTime={updated}>{updated}</time>
          </MonoLabel>
          <p className="text-lead text-ink-secondary">{intro}</p>
        </header>
        <div className="flex flex-col gap-10 text-body text-ink-secondary">
          {sections.map((section) => (
            <Section key={section.id} {...section} />
          ))}
        </div>
      </Container>
    </article>
  );
}
