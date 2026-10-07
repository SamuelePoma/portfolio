import { Container } from "@/components/layout/Container";
import { Glow } from "@/components/motion/Glow";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { MonoLabel } from "@/components/ui/MonoLabel";
import type { LegalDocument, LegalSection } from "@/content/schema";
import { publicEnv } from "@/lib/env/public";
import { legalPageJsonLd } from "@/lib/seo/jsonld";

function Section({ id, title, paragraphs, items, links }: Readonly<LegalSection>) {
  return (
    <section
      aria-labelledby={id}
      className="flex flex-col gap-4 border-t border-hairline pt-8 first:border-t-0 first:pt-0"
    >
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

/**
 * A long-form legal page (DESIGN.md §9.8): a short dark header over the horizon, like the
 * case studies, then the text in a reading column with a table of contents that stays
 * in view beside it on wide screens.
 */
export function LegalPage({ slug, title, updated, intro, sections }: Readonly<LegalDocument>) {
  const path = `/${slug}`;
  return (
    <article aria-labelledby="legal-title" className="pb-24 md:pb-32">
      <JsonLd data={legalPageJsonLd(title, path, publicEnv.NEXT_PUBLIC_SITE_URL)} />
      <header
        data-tone="night"
        className="tone-night relative isolate -mt-16 overflow-hidden pt-28 pb-24 md:pt-32 md:pb-32"
      >
        <Glow variant="horizon" />
        <Container className="flex flex-col gap-12 md:gap-16">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />
          <div className="flex flex-col gap-6">
            <MonoLabel as="p">
              Last updated <time dateTime={updated}>{updated}</time>
            </MonoLabel>
            <h1 id="legal-title" className="text-display">
              {title}
            </h1>
            <p className="max-w-[52ch] text-lead text-ink-secondary">{intro}</p>
          </div>
        </Container>
      </header>

      <Container className="grid grid-cols-1 gap-12 pt-16 md:pt-20 lg:grid-cols-12">
        <nav aria-label="On this page" className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-28 flex flex-col gap-4">
            <MonoLabel as="p">On this page</MonoLabel>
            <ol className="flex flex-col border-l border-hairline">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="-ml-px flex min-h-9 items-center border-l border-transparent pl-4 text-small text-ink-secondary transition-colors duration-200 ease-out hover:border-ink hover:text-ink"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>
        <div className="flex max-w-[65ch] flex-col gap-10 text-body text-ink-secondary lg:col-span-8 lg:col-start-5">
          {sections.map((section) => (
            <Section key={section.id} {...section} />
          ))}
        </div>
      </Container>
    </article>
  );
}
