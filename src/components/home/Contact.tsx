import { CopyEmail } from "@/components/contact/CopyEmail";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Glow } from "@/components/motion/Glow";
import { ScrollWords } from "@/components/motion/ScrollWords";
import { Button } from "@/components/ui/Button";
import { site } from "@/content/site";

/**
 * The finale (DESIGN.md §9.6): a dark band that flows into the footer, with the email
 * as the one thing to do. No form, so nothing to fill in and nothing stored; no phone
 * number, ever.
 */
export function Contact() {
  return (
    <Section
      id="contact"
      tone="night"
      aria-labelledby="contact-title"
      // A full screen for the last word: the page ends on the horizon, not mid-band.
      className="relative isolate flex min-h-svh flex-col justify-center overflow-hidden"
    >
      {/* The opening's light, closing the page. */}
      <Glow variant="horizon" />
      <Container className="flex flex-col items-center text-center">
        <h2 id="contact-title" className="text-display-xl">
          <ScrollWords text="Let's talk." />
        </h2>
        <p className="mt-6 max-w-[36ch] text-lead text-ink-secondary">
          Have a project, a question or an idea? Email is the best way to reach me.
        </p>
        <CopyEmail email={site.email} size="display" className="mt-12 md:mt-16" />
        <ul className="mt-12 flex flex-wrap justify-center gap-3">
          <li>
            <Button href={`mailto:${site.email}`} icon="arrow-up-right">
              Write an email
            </Button>
          </li>
          <li>
            <Button variant="secondary" href={site.github} icon="arrow-up-right">
              GitHub
            </Button>
          </li>
          <li>
            <Button variant="secondary" href={site.linkedin} icon="arrow-up-right">
              LinkedIn
            </Button>
          </li>
        </ul>
      </Container>
    </Section>
  );
}
