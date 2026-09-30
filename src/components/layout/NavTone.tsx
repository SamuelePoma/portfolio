"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Height of the sticky nav; the probe line sits at its vertical middle. */
const NAV_HEIGHT = 64;

/**
 * Switches the nav to the night tone while a dark band is behind it, like Apple's
 * header, instead of showing a muddy grey bar over black. Uses an
 * IntersectionObserver on a one-pixel line under the nav: no scroll listeners.
 * Renders nothing; without JavaScript the nav simply stays light.
 */
export function NavTone({ navId }: Readonly<{ navId: string }>) {
  // Re-scan on navigation: the nav persists in the layout, the dark bands change.
  const pathname = usePathname();

  useEffect(() => {
    const nav = document.getElementById(navId);
    if (!nav) return;

    const bands = document.querySelectorAll<HTMLElement>('[data-tone="night"]');
    const underNav = new Set<Element>();
    let observer: IntersectionObserver | undefined;

    const observe = () => {
      observer?.disconnect();
      underNav.clear();
      const probe = NAV_HEIGHT / 2;
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) underNav.add(entry.target);
            else underNav.delete(entry.target);
          }
          nav.classList.toggle("tone-night", underNav.size > 0);
        },
        { rootMargin: `-${probe}px 0px -${window.innerHeight - probe - 1}px 0px` },
      );
      bands.forEach((band) => {
        observer?.observe(band);
      });
    };

    observe();
    window.addEventListener("resize", observe);
    return () => {
      window.removeEventListener("resize", observe);
      observer?.disconnect();
    };
  }, [navId, pathname]);

  return null;
}
