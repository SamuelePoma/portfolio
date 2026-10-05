import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { MonoLabel } from "@/components/ui/MonoLabel";

interface NextProjectProps {
  slug: string;
  title: string;
}

/** A large link to the next case study, looping back to the first (DESIGN.md §9.3). */
export function NextProject({ slug, title }: Readonly<NextProjectProps>) {
  return (
    <nav aria-label="Next project" className="border-t border-hairline">
      <Link href={`/work/${slug}`} className="group flex flex-col gap-4 rounded-sm py-16 md:py-24">
        <MonoLabel>Next project</MonoLabel>
        <span className="flex items-center gap-4 text-h1">
          {title}
          <ArrowRight
            aria-hidden
            strokeWidth={1.5}
            className="size-[0.8em] shrink-0 text-ink-tertiary transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:text-ink"
          />
        </span>
      </Link>
    </nav>
  );
}
