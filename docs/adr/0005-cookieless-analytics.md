# ADR 0005 — Cookieless analytics, no cookie banner

- **Status:** accepted
- **Date:** 2026-10-07

## Context

Samuele wants to know whether the portfolio is visited and whether it is fast for real visitors. Under the GDPR and the Dutch Telecommunications Act, analytics that set cookies or identify visitors need prior consent, which means a consent banner in front of every first visit. A banner is the first thing a recruiter would see, and it would exist only to serve the tooling.

## Decision

- **Umami Cloud** (servers in the EU and the US, GDPR-compliant) counts page views, referrers, device types and countries in aggregate. It sets no cookies, stores no personal data and respects Do Not Track. The script loads only when `NEXT_PUBLIC_UMAMI_WEBSITE_ID` is set, only after the page is interactive, and counts only the site's own domain (`data-domains`), so local builds and previews never add to the numbers.
- **Vercel Speed Insights** reports Core Web Vitals from real visits, without cookies. Its script is served by Vercel, so it is rendered only in the production deployment there; previews are left out of the numbers.
- **No cookies at all, so no banner.** The privacy page says so, names both tools, and commits to a proper consent manager (opt-in per category, "reject all" as prominent as "accept all") before any tool that needs one is added.
- The Content-Security-Policy allows Umami's script origin and the endpoint it sends page views to only when analytics are on (ADR 0003). The site passes that endpoint to the script (`data-host-url`), so the two can't drift apart.

## Consequences

- No banner, and the privacy page can be short and exact.
- Aggregate numbers only: no funnels or per-visitor journeys, which a portfolio doesn't need.
- Visitors with Do Not Track switched on, or with Umami blocked, are not counted. The numbers are a lower bound.
