import { ContactForm } from "@/components/contact/ContactForm";
import { CopyEmail } from "@/components/contact/CopyEmail";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Glow } from "@/components/motion/Glow";
import { ScrollWords } from "@/components/motion/ScrollWords";
import { Button } from "@/components/ui/Button";
import { site } from "@/content/site";
import { turnstileSiteKey } from "@/lib/env/public";

/** Dark band that flows into the footer (DESIGN.md §9.6). No phone number, ever. */
export function Contact() {
  return (
    <Section
      id="contact"
      tone="night"
      aria-labelledby="contact-title"
      className="relative isolate overflow-hidden"
    >
      {/* The opening's light, closing the page. */}
      <Glow className="top-auto h-[140%] opacity-60" />
      <Container className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col gap-10 lg:col-span-6">
          <h2 id="contact-title" className="text-display">
            <ScrollWords text="Let's talk." />
          </h2>
          <CopyEmail email={site.email} />
          <ul className="flex flex-wrap gap-3">
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
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <ContactForm email={site.email} turnstileSiteKey={turnstileSiteKey} />
        </div>
      </Container>
    </Section>
  );
}
