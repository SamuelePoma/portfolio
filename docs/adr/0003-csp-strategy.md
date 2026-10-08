# ADR 0003 — Content-Security-Policy for static pages

- **Status:** accepted
- **Date:** 2026-10-07

## Context

Every page is statically generated and served from the CDN. A strict Content-Security-Policy must not allow `'unsafe-inline'` scripts, but Next.js writes inline scripts into every page (the `self.__next_f.push(…)` calls that carry the React Server Components payload for hydration): between 2 and 7 per page here.

Next.js offers two ways to allow them:

- **Nonces**, generated per request in `proxy.ts`. Every page then has to be rendered on every request: no static HTML, no CDN cache, a slower first byte.
- **Subresource Integrity** (`experimental.sri`). It adds `integrity` hashes to the `<script src>` tags, but the inline scripts still need `'unsafe-inline'`, a nonce or their own hash.

## Decision

Hash the inline scripts after the build, page by page.

- `pnpm build` runs `next build`, then `scripts/csp-hashes.mjs`. The script reads every prerendered page under `.next`, wherever the build put it (`next start` serves them from `.next/server/app`; on Vercel, the deployment adapter has them in `.next/server/route-cache` and copies them into its own output), computes the SHA-256 of each inline script the browser would execute (JSON-LD and other data blocks are skipped, since they never run) and writes the policy into the page as `<meta http-equiv="Content-Security-Policy">`, right after the charset and before any script.
- That **document policy** is the whole policy for what a page may load: `default-src 'self'`; `script-src 'self'` plus the page's hashes (and Umami's origin when analytics are on); inline styles (React writes `style` attributes, and styles can't run code); `data:` images (the grain texture, the icons); no frames, no plugins.
- The **header** policy, sent by `next.config.ts` on every response, holds what a `<meta>` tag can't: `frame-ancestors 'none'`, plus `base-uri`, `form-action`, `object-src` and, when deployed, `upgrade-insecure-requests`. Browsers enforce both policies, so a resource must pass each.
- The other security headers (HSTS with preload, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options: DENY`, COOP, CORP) are sent on every route.
- `src/lib/security/headers.ts` builds both policies and does the HTML work as plain functions with unit tests. Setting `CSP_REPORT_ONLY=1` at build time sends the header as Report-Only, for checking a deployment first.

## Consequences

- Pages stay static and cacheable, and an injected inline script is blocked (an end-to-end test checks this, along with the headers and the absence of `'unsafe-inline'` for scripts).
- The hashes are tied to the build: a page edited by hand after the build would no longer match its policy. The post-build step is idempotent and fails the build if it finds no pages.
- Client-side navigation fetches React Server Components payloads, not HTML, so it adds no inline scripts; the policy of the first page loaded stays in force, and every page's policy has the same shape.
- If Next.js one day ships hash-based CSP for inline scripts, the post-build step can go.
