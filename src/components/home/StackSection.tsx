import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { skillGroups } from "@/content/skills";

/** Grouped, typographic, no logos and no progress bars (DESIGN.md §9.4). */
export function StackSection() {
  return (
    <Section id="stack" spacing="top" aria-labelledby="stack-title">
      <Container>
        <h2 id="stack-title" className="text-display">
          Tools I reach for.
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
          {skillGroups.map((group) => (
            <div key={group.label} className="border-t border-hairline pt-6">
              <h3 className="font-mono text-mono-label text-ink-tertiary uppercase">
                {group.label}
              </h3>
              <ul className="mt-5 flex flex-col gap-2">
                {group.items.map((item) => (
                  <li key={item} className="text-lead">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
