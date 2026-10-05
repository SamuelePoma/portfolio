import Link from "next/link";

interface Crumb {
  label: string;
  /** Omitted for the current page, which is the last crumb. */
  href?: string;
}

interface BreadcrumbsProps {
  items: readonly Crumb[];
}

/**
 * Visible breadcrumbs for case studies and legal pages: `Home / Work / MuseTrail`.
 * Links keep a 44px hit area; the current page is marked with `aria-current`.
 */
export function Breadcrumbs({ items }: Readonly<BreadcrumbsProps>) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-1 font-mono text-mono-label text-ink-tertiary uppercase">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-1">
            {index > 0 && (
              <span aria-hidden className="px-1">
                /
              </span>
            )}
            {item.href === undefined ? (
              <span aria-current="page" className="text-ink-secondary">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="-mx-1 inline-flex h-11 items-center rounded-sm px-1 transition-colors duration-200 ease-out hover:text-ink"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
