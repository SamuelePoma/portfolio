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
 *
 * Bands can overlap: the light work section slides over the dark opening, and the dark
 * MuseTrail tile sits inside it. Of the bands under the nav, the one that comes last in
 * the document is the one painted on top, so its tone wins.
 */
export function NavTone({ navId }: Readonly<{ navId: string }>) {
  // Re-scan on navigation: the nav persists in the layout, the dark bands change.
  const pathname = usePathname();

  useEffect(() => {
    const nav = document.getElementById(navId);
    if (!nav) return;

    const bands = document.querySelectorAll<HTMLElement>("[data-tone]");
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
          let top: Element | undefined;
          for (const band of underNav) {
            if (!top || top.compareDocumentPosition(band) & Node.DOCUMENT_POSITION_FOLLOWING) {
              top = band;
            }
          }
          nav.classList.toggle("tone-night", top?.getAttribute("data-tone") === "night");
        },
        { rootMargin: `-${probe}px 0px -${window.innerHeight - probe - 1}px 0px` },
      );
      bands.forEach((band) => {
        observer?.observe(band);
      });
    };

    observe();
    // From here on the observer decides; the CSS first guess (globals.css) steps aside.
    nav.setAttribute("data-tone-ready", "");
    window.addEventListener("resize", observe);
    return () => {
      window.removeEventListener("resize", observe);
      observer?.disconnect();
    };
  }, [navId, pathname]);

  return null;
}
