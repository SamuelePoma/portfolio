# ADR 0002 — Contact form pipeline

- **Status:** superseded on 2026-10-06: the form and its API were removed. Visitors reach Samuele by email (a `mailto:` link that copies the address), so the site has no server code, no input from strangers and no secrets. This record stays as the design of the pipeline, should a form ever come back; the code is in the git history.
- **Date:** 2026-10-05

## Context

The contact form is the site's only server code and its only input from strangers. It has to stop spam and abuse, keep personal data out of logs, never leak provider errors, and still be easy to run locally without any accounts.

## Decision

- **One pure handler.** `handleContactRequest(request, deps)` in `src/lib/contact/handler.ts` takes a Web `Request` and returns a `Response`. The route file only wires it to real services. Every side effect (rate limit, Turnstile, email, logging) sits behind a small interface in `ports.ts`, so the integration tests drive the real handler with fakes.
- **Order of checks, cheapest first:** method, content type and declared size; origin; rate limit; body size while reading; validation; honeypot and timing; Turnstile; sanitising and re-validation; sending.
- **Generic answers.** The API only ever returns `invalid_input`, `rate_limited`, `captcha_failed` or `server_error`. Logs are one JSON line per event with the event name, status and request id: never the message, the name, an email address or an IP.
- **Spam signals answer "ok".** A filled honeypot or a form sent faster than 3 seconds gets a fake success, so a bot learns nothing.
- **Time on page, not a timestamp.** The form sends `elapsedMs`, measured by the browser's own clock (`performance.now()`), rather than a `startedAt` timestamp compared with the server's clock. A visitor whose clock is a few minutes off would otherwise be taken for a bot and silently dropped.
- **Forms posted without JavaScript** (`application/x-www-form-urlencoded` or `multipart/form-data`) get a `303` back to `/#contact`, where the `<noscript>` note offers email. Turnstile needs JavaScript, so such a post could never pass anyway; a redirect is friendlier than a raw `415`.
- **Rate limiting** uses two Upstash sliding windows (3 per 10 minutes, 10 per day) keyed on a salted SHA-256 of the IP. If Redis can't be reached within the library's timeout, requests pass: blocking every visitor during an outage is worse than letting a few extra messages through.
- **Idempotent sending.** Resend's idempotency key is a hash of the email and the message, so a double click or a retry delivers once.
- **Local development needs no accounts.** With `NODE_ENV=development`, missing keys fall back to Cloudflare's always-pass test keys, an in-memory rate limit and an email printed to the console. Production builds on Vercel fail if any secret is missing or if a Turnstile test key is configured (`assertProductionEnv`, run from `next.config.ts`).

## Consequences

- A real email is only sent once Resend, Upstash and Turnstile keys are set; until then the whole flow can be tried locally.
- The origin check is the CSRF defence; there are no cookies or sessions to protect, so no tokens are needed.
- Turnstile's script loads only when the form comes near the viewport, so most visitors never contact Cloudflare.
