import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { site } from "@/content/site";
import { timeline } from "@/content/timeline";
import { formatPeriod } from "@/lib/format/period";
import { publicFileExists } from "@/lib/public-file";

/** Short first-person intro and a timeline of education and work (DESIGN.md §9.5). */
export function About() {
  const hasCv = publicFileExists(site.cvPath);

  return (
    <Section id="about" aria-labelledby="about-title">
      <Container className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <h2 id="about-title" className="text-display">
            About me.
          </h2>
          <div className="mt-8 flex max-w-[40ch] flex-col gap-5 text-lead text-ink-secondary">
            {site.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <MonoLabel as="p" className="mt-8">
            {site.languages}
          </MonoLabel>
        </div>

        <div className="lg:col-span-7 lg:pt-3">
          <ol className="border-t border-hairline">
            {timeline.map((entry) => (
              <li
                key={`${entry.organisation}-${entry.period.start}`}
                className="grid grid-cols-1 gap-2 border-b border-hairline py-6 md:grid-cols-[5.5rem_minmax(0,1.2fr)_minmax(0,1fr)] md:gap-6"
              >
                <MonoLabel as="p" className="md:pt-1">
                  {formatPeriod(entry.period)}
                </MonoLabel>
                <div>
                  <h3 className="text-h3">{entry.title}</h3>
                  <p className="mt-1 text-small text-ink-secondary">{entry.organisation}</p>
                </div>
                <p className="text-small text-ink-secondary md:pt-0.5">{entry.summary}</p>
              </li>
            ))}
          </ol>
          {hasCv && (
            <div className="mt-8">
              <Button variant="secondary" href={site.cvPath} icon="arrow-down" download>
                Résumé (PDF)
              </Button>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
