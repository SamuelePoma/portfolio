# ADR 0001 — Framework and toolchain

- **Status:** accepted
- **Date:** 2026-09-30

## Context

The site is a React portfolio that needs per-page SEO (unique titles, canonical URLs, Open Graph images, sitemap), a small server endpoint for the contact form, and excellent performance. Samuele wants it written in React.

## Decision

- **Next.js 16 (App Router) with React 19.** Every page is statically generated; the contact form is the only server code. The Metadata API, file-based `sitemap`/`robots`/`opengraph-image` and route handlers cover the SEO and backend needs without extra libraries. A plain Vite SPA was rejected because per-page metadata and OG previews would need a separate prerendering setup.
- **TypeScript 5.x and ESLint 9.x**, not the newest majors (TypeScript 7, ESLint 10). `create-next-app@16.3.7` pins these, and `eslint-config-next` / `typescript-eslint` are tested against them. Revisit when Next.js moves its template forward.
- **pnpm 12**, pinned via `packageManager`.
- **Vitest** for unit and integration tests, **Playwright** for end-to-end, accessibility (axe) and cross-browser tests.
- **ESLint:** `eslint-config-next` plus the rules of `typescript-eslint` strict-type-checked and `jsx-a11y` strict. Only the rules are borrowed, because `eslint-config-next` already registers those plugins and registering them twice throws.

## Consequences

- Hosting on Vercel is the natural fit (preview deployments, image optimisation, instant rollback).
- Next.js ships an `AGENTS.md` that points agents to the version-matched docs in `node_modules/next/dist/docs/`. We keep it and import it from `CLAUDE.md`.
- The production build validates server secrets in `next.config.ts` (only when `VERCEL_ENV=production`), so a misconfigured deployment fails before going live.
