import Link from "next/link";

import { site } from "@/content/site";

import { Container } from "./Container";

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/legal", label: "Legal" },
] as const;

/** Continues the dark contact band (DESIGN.md §9.7). */
export function Footer() {
  // Static pages: the year is fixed at build time, and every deploy rebuilds.
  const year = new Date().getFullYear();

  return (
    <footer data-tone="night" className="tone-night">
      <Container>
        <div className="flex flex-col gap-4 border-t border-hairline py-8 font-mono text-mono-label text-ink-secondary sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}
          </p>
          <nav aria-label="Legal">
            <ul className="-ml-2 flex gap-2 sm:-mr-2 sm:ml-0">
              {legalLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="inline-flex h-11 items-center rounded-sm px-2 transition-colors duration-200 ease-out hover:text-ink"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
