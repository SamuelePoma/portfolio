import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { MeshGradient } from "@/components/visuals/MeshGradient";
import { site } from "@/content/site";

/**
 * Editorial cover (DESIGN.md §9.1): bottom-weighted, left-aligned, the name as the
 * visual. Pulled up under the sticky nav so the mesh shows through it at the top.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate -mt-16 flex min-h-[90svh] flex-col justify-end pt-32 pb-16 md:pb-24"
    >
      <MeshGradient />
      <Container>
        <MonoLabel as="p">{site.heroEyebrow}</MonoLabel>
        <h1 id="hero-title" className="mt-6 text-display-xl">
          <span className="block sm:inline">Samuele</span>{" "}
          <span className="block sm:inline">Poma.</span>
        </h1>
        <p className="mt-8 max-w-[32ch] text-lead text-ink-secondary">{site.heroLead}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="#work" icon="arrow-down">
            View work
          </Button>
          <Button variant="secondary" href={site.github} icon="arrow-up-right">
            GitHub
          </Button>
        </div>
      </Container>
    </section>
  );
}
