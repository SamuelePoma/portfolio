import Link from "next/link";
import { siGithub } from "simple-icons";

import { site } from "@/content/site";

import { Container } from "./Container";
import { NavTone } from "./NavTone";

const NAV_ID = "site-nav";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
] as const;

const linkClass =
  "inline-flex h-11 items-center rounded-sm px-2 text-small text-ink-secondary transition-colors duration-200 ease-out hover:text-ink sm:px-3";

/**
 * Site header (DESIGN.md §8.1). Three short links fit on one line down to 320px,
 * so there is no collapsed mobile menu: no extra tap, no JavaScript. The frosted
 * surface fades in over the first 24px of scroll (`.nav-surface` in globals.css).
 */
export function Nav() {
  return (
    <header id={NAV_ID} className="nav-surface sticky top-0 z-40">
      <NavTone navId={NAV_ID} />
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="-ml-2 inline-flex h-11 items-center rounded-sm px-2 font-mono text-small font-semibold tracking-tight text-ink"
        >
          SP<span className="sr-only"> (Samuele Poma, home)</span>
        </Link>

        <nav aria-label="Main">
          <ul className="-mr-2 flex items-center">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={linkClass}>
                  {label}
                </Link>
              </li>
            ))}
            <li className="ml-1">
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-11 items-center justify-center rounded-sm text-ink-secondary transition-colors duration-200 ease-out hover:text-ink"
              >
                <svg aria-hidden viewBox="0 0 24 24" className="size-[18px] fill-current">
                  <path d={siGithub.path} />
                </svg>
                <span className="sr-only">GitHub (opens in new tab)</span>
              </a>
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  );
}
