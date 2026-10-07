import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";
import { isExternalHref } from "@/lib/utils/is-external-href";

const icons = {
  "arrow-right": { Icon: ArrowRight, nudge: "group-hover:translate-x-0.5" },
  "arrow-up-right": {
    Icon: ArrowUpRight,
    nudge: "group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
  },
  "arrow-down": { Icon: ArrowDown, nudge: "group-hover:translate-y-0.5" },
} as const;

const variants = {
  primary: "bg-ink text-canvas hover:bg-ink/85",
  secondary: "bg-surface text-ink ring-1 ring-hairline ring-inset hover:ring-hairline-strong",
} as const;

interface BaseProps {
  variant?: keyof typeof variants;
  icon?: keyof typeof icons;
  children: ReactNode;
  className?: string;
}

type ButtonAsLink = BaseProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof BaseProps | "href"> & { href: string };
type ButtonAsButton = BaseProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof BaseProps> & { href?: undefined };

export type ButtonProps = ButtonAsLink | ButtonAsButton;

/** Links to files (e.g. the résumé PDF) must bypass client-side navigation. */
const isFileHref = (href: string) => /\.[a-z0-9]{2,5}$/i.test(href.split(/[?#]/)[0] ?? "");

/**
 * Pill button (DESIGN.md §8.2). Renders a Next.js `Link` for internal routes, a plain
 * anchor for external or file links, and a `<button>` when there's no `href`.
 * Colors come from tokens, so it inverts automatically inside a `.tone-night` band.
 */
export function Button(props: Readonly<ButtonProps>) {
  const { variant = "primary", icon, children, className, ...rest } = props;

  const classes = cn(
    "group inline-flex h-11 shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 text-small font-medium",
    "transition-[background-color,box-shadow,transform] duration-200 ease-out active:scale-[0.97] active:duration-120",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    className,
  );

  const iconConfig = icon ? icons[icon] : undefined;
  const content = (
    <>
      {children}
      {iconConfig && (
        <iconConfig.Icon
          aria-hidden
          size={16}
          strokeWidth={1.75}
          className={cn("transition-transform duration-200 ease-out", iconConfig.nudge)}
        />
      )}
    </>
  );

  // TypeScript doesn't narrow `rest` through the `href` check, so each branch says which
  // of the two prop shapes it has.
  if (rest.href === undefined) {
    const { type = "button", ...buttonProps } = rest as Omit<ButtonAsButton, keyof BaseProps>;
    return (
      <button type={type} className={classes} {...buttonProps}>
        {content}
      </button>
    );
  }

  const { href, ...anchorProps } = rest as Omit<ButtonAsLink, keyof BaseProps>;

  if (isExternalHref(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...anchorProps}>
        {content}{" "}
        {/* The space must sit outside: accessible-name computation trims text inside elements. */}
        <span className="sr-only">(opens in new tab)</span>
      </a>
    );
  }

  if (isFileHref(href)) {
    return (
      <a href={href} className={classes} {...anchorProps}>
        {content}
      </a>
    );
  }

  // React's anchor props allow explicit `undefined` handlers; Next's LinkProps don't, which
  // clashes under `exactOptionalPropertyTypes`. The runtime values are identical.
  const linkProps = anchorProps as Omit<ComponentPropsWithoutRef<typeof Link>, "href">;
  return (
    <Link href={href} className={classes} {...linkProps}>
      {content}
    </Link>
  );
}
