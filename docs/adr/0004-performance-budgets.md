# ADR 0004 — Performance budgets and an in-house scroll engine

- **Status:** accepted
- **Date:** 2026-10-07

## Context

The home page tells its story through pinned, scroll-driven scenes (DESIGN.md §7). They were built with the Motion library, which shipped about 40 KB of gzipped JavaScript on every page. Lighthouse on a simulated mid-range phone scored the home page 84 to 90 for performance.

The scenes use a small part of what Motion offers: scroll progress, springs, interpolated tracks and styles written to elements. Most of the rest of the first load is React and the Next.js runtime (about 170 KB gzipped), which every page needs and no setting removes.

## Decision

- **Replace Motion with a scroll engine of our own** in `src/lib/motion/`: motion values, piecewise interpolation, exactly solved springs, scroll offsets, transform shorthands and one shared animation-frame loop (read, then update, then render). `Animated.div/span/li` write moving styles straight to the element without re-rendering React. The scenes keep their springs and tracks; one-off reveals are CSS transitions. The engine is pure functions with unit tests.
- **Budgets checked in CI** (the `audit` job):
  - `pnpm size`: no page may load more than **210 KB** of gzipped JavaScript up front.
  - `pnpm lighthouse` (`lighthouserc.json`, mobile, median of three runs on the home page, a case study and a legal page): performance **≥ 90**, accessibility, best practices and SEO **100**, layout shift **≤ 0.05**. Crawlability is skipped because builds outside production are `noindex` on purpose.

## Consequences

- First-load JavaScript on the home page fell from 243.5 KB to 203.7 KB gzipped, and mobile performance rose to 92 to 94 on every page measured.
- The remaining gap to 100 is the lab's simulated LCP (about 3 s). It counts every script that loads before the largest paint, and most of those bytes are the framework's. The LCP actually observed in the same runs is about 1.3 s, the same moment as the first paint. Real-user numbers come from Vercel Speed Insights.
- The original target (160 KB, Lighthouse 95) is below what Next.js 16 and React 19 need on their own, so the budgets above replace it. They leave a little room above today's numbers, so a regression fails the build without each change having to fight for single kilobytes.
- An animation feature beyond scroll, springs and tracks (layout animations, gestures) has to be added to the engine or come from a library again. Neither is planned.
