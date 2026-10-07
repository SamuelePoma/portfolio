"use client";

import { useEffect } from "react";

/**
 * Smooths mouse-wheel scrolling (DESIGN.md §7.2). A wheel moves the page in steps of
 * about 100px; Lenis turns them into one continuous glide, so the pinned scenes play
 * like a film instead of in jumps. It loads only on devices with a mouse; touch,
 * keyboard, scrollbar and anchor links stay native, and with reduced motion it never
 * loads. It loads once the page is idle, so it never weighs on the first paint.
 */
export function SmoothScroll() {
  useEffect(() => {
    // Only where there is a mouse wheel to smooth: phones and tablets scroll natively
    // with their own momentum, and a glide still running under a tap would move the
    // page away from the finger.
    const wheel = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!wheel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let destroy: (() => void) | undefined;

    const start = () => {
      void import("lenis").then(({ default: Lenis }) => {
        if (cancelled) return;
        // A click on a link to another page stops the glide, so the next page opens still.
        const lenis = new Lenis({ autoRaf: true, lerp: 0.12, stopInertiaOnNavigate: true });
        destroy = () => {
          lenis.destroy();
        };
      });
    };

    // Safari has no requestIdleCallback: a short timeout does the same job there.
    const idle = "requestIdleCallback" in window;
    const handle = idle
      ? window.requestIdleCallback(start, { timeout: 2000 })
      : window.setTimeout(start, 400);
    return () => {
      cancelled = true;
      if (idle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      destroy?.();
    };
  }, []);

  return null;
}
