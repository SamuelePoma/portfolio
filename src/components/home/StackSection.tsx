import Link from "next/link";
import type { CSSProperties } from "react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { ScrollWords } from "@/components/motion/ScrollWords";
import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";

/** Where each tool was used: the projects whose stack lists it, in display order. */
function usedIn(tool: string) {
  return projects.filter((project) => (project.stack as readonly string[]).includes(tool));
}

/**
 * The stack as a spec sheet (DESIGN.md §9.4): every tool in large type, and beside it
 * the projects that used it, linked. Show, don't claim: no logos, no levels, no bars.
 */
export function StackSection() {
  return (
    <Section id="stack" spacing="top" aria-labelledby="stack-title">
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <h2 id="stack-title" className="text-display lg:col-span-7">
            <ScrollWords text="Tools I reach for." />
          </h2>
          <p className="max-w-[40ch] text-lead text-ink-secondary lg:col-span-5 lg:pb-2">
            Each one next to the projects that put it to work.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-14 md:mt-20 lg:grid-cols-2">
          {skillGroups.map((group, groupIndex) => (
            <div
              key={group.label}
              className="rise-in"
              style={{ "--i": groupIndex } as CSSProperties}
            >
              <h3 className="font-mono text-mono-label text-ink-tertiary uppercase">
                {group.label}
              </h3>
              <ul className="mt-4 border-t border-hairline">
                {group.items.map((item) => {
                  const where = usedIn(item);
                  return (
                    <li
                      key={item}
                      className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-hairline py-4"
                    >
                      <span className="text-h2">{item}</span>
                      {where.length > 0 && (
                        <span className="text-small text-ink-secondary">
                          {where.map((project, index) => (
                            <span key={project.slug}>
                              {index > 0 && ", "}
                              <Link
                                href={`/work/${project.slug}`}
                                className="underline decoration-hairline-strong underline-offset-4 transition-colors duration-200 ease-out hover:text-ink hover:decoration-ink"
                              >
                                {project.title}
                              </Link>
                            </span>
                          ))}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
