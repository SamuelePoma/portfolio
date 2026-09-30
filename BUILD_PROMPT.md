# BUILD_PROMPT.md — Technical brief for samuelepoma.com

> You are the engineer building Samuele Poma's portfolio website from scratch.
> This file defines **how** to build it. [`DESIGN.md`](DESIGN.md) defines **how it looks and moves**.
> Read both files completely before writing any code. If they conflict, DESIGN.md wins on visuals and this file wins on engineering.

---

## 0. Ground rules for the agent

1. **Work in phases (§14).** At the end of each phase, run every check listed for it, commit, write a short report (what was done, what was checked, open questions) and **stop for Samuele's approval** before the next phase.
2. **Check the docs, don't rely on memory.** Before using any framework API (Next.js, React, Tailwind, Motion, Resend, Upstash, Turnstile, Playwright), look up the current docs with the Context7 MCP for the **installed** version. APIs change often; for example, recent Next.js renamed `middleware` to `proxy` and removed `next lint`.
3. **Never invent facts.** All content comes from §3 and the résumé. Do not invent metrics, architecture details, repository links, dates or quotes. If a case study needs a fact you don't have, write less and add a question to `CONTENT_TODO.md`. No lorem ipsum, ever: production must not show filler text.
4. **Keep it truthful about skills.** Only list technologies from §3.3. (C# is **not** on the résumé, so it is not mentioned unless Samuele confirms it.)
5. **Keep it small.** Every dependency must justify itself. Prefer platform features (CSS, the View Transitions API, native `<dialog>`) over libraries.
6. **Keep it green.** Never commit with failing lint, types or tests. Never skip hooks.
7. **Environment:** Samuele develops on **Windows 11** (PowerShell). All npm scripts must be cross-platform: use Node scripts, not bash, and no `rm -rf` in `package.json`.

---

## 1. Tooling for the agent (Phase 0)

Install these at **project scope** so they are versioned with the repo:

| Tool | Purpose | Install (check the repo README for the current command) |
|---|---|---|
| **Taste Skill** (`design-taste-frontend`) | Generating the UI | `github.com/Leonxlnx/taste-skill`. Dials: **`DESIGN_VARIANCE: 5`, `MOTION_INTENSITY: 5`, `VISUAL_DENSITY: 3`**. Two overrides: never generate stock or AI photography (use the DESIGN.md §8.6 placeholders instead), and no perpetual loops or magnetic effects beyond DESIGN.md §7.3. |
| **Impeccable** | Auditing and polishing the UI | `npx skills add https://github.com/pbakaus/impeccable --skill impeccable`. Run in **brand** mode (a marketing/portfolio site). |
| **Emil Kowalski skills** | Motion and polish | `emil-design-eng`, `animate`, `review-animations`, `ask-sonner`, `mobile-native`, `apple-design` from `github.com/emilkowalski/skills` |
| **Playwright MCP** | Visual verification in a real browser | `claude mcp add playwright -- npx @playwright/mcp@latest` |
| **Context7 MCP** | Up-to-date library docs | `claude mcp add --transport http context7 https://mcp.context7.com/mcp` |

**When to use each skill:**
- Building (Phases 2–5): Taste Skill, constrained by DESIGN.md.
- Motion (Phase 7): Emil skills. Write with `animate`, then audit with `review-animations`.
- Review (Phase 8): Impeccable `audit` → `critique` → `polish`, plus `typeset` if typography needs work.
- Verification (every phase with UI): Playwright MCP screenshots at 375, 768, 1280 and 1920 widths.

**Precedence:** skills give guidance, but they never override DESIGN.md. If a skill suggests something DESIGN.md forbids (extra colors, bounce easing, weight 700, and so on), DESIGN.md wins.

---

## 2. Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Runtime | **Node.js 24 LTS** | Pinned in `.nvmrc` and `package.json#engines` |
| Package manager | **pnpm** (latest 10.x) | Pinned via `packageManager`; `pnpm-lock.yaml` is committed |
| Framework | **Next.js**, latest stable, **App Router**, with **React 19** | Static generation for every page; the only server code is the contact route |
| Language | **TypeScript**, `strict: true`, plus `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` | No `any`, no `@ts-ignore` without a comment explaining why |
| Styling | **Tailwind CSS v4** | Tokens from DESIGN.md defined in `@theme` in `globals.css`; no hard-coded hex values in components |
| Fonts | **Geist** and **Geist Mono** via the `geist` package (`next/font`) | Self-hosted, variable, `display: swap` |
| Motion | **Motion** (`motion/react`) with `LazyMotion` + `m` components, plus **CSS** | Use CSS first; Motion only for springs, the pointer, `layoutId` and presence |
| Icons | **lucide-react** | Imported one by one (tree-shaken) |
| Toast | **Sonner** | Styled per DESIGN.md §8.11 |
| Validation | **Zod** | One schema shared by client and server |
| Email | **Resend** (free tier) | Server-side only |
| Rate limiting | **Upstash Redis** plus `@upstash/ratelimit` (free tier) | |
| Anti-spam | **Cloudflare Turnstile** (free) plus a honeypot and a timing check | |
| Analytics | **Umami Cloud** (free, cookieless, EU region) | See §9 |
| Web Vitals monitoring | **Vercel Speed Insights** | Cookieless |
| Hosting | **Vercel** (Hobby), Git integration | Preview deployment per PR, production on `main` |
| Unit/integration tests | **Vitest** plus Testing Library | |
| E2E, accessibility and visual tests | **Playwright** plus `@axe-core/playwright` | |
| Quality gates | ESLint (flat config), Prettier, Lighthouse CI, linkinator, html-validate | |

Do **not** add: a CSS-in-JS library, a component kit (shadcn, MUI…), jQuery, GSAP, three.js/WebGL, a state manager, or an analytics tool that uses cookies.

---

## 3. Content (the single source of truth)

All content lives in typed files in `src/content/`, validated with Zod at build time (a unit test fails the build if the content is invalid). Components never hard-code copy.

### 3.1 `site.ts`
```ts
name: "Samuele Poma"
role: "Software Engineer"
location: "Middelburg, Netherlands"
timezone: "Europe/Amsterdam"
email: "samuelepoma45@gmail.com"         // switch to contact@samuelepoma.com once the domain exists (§12)
github: "https://github.com/SamuelePoma"
linkedin: "https://www.linkedin.com/in/samuele-poma-547120242/"
cv: "/cv/samuele-poma-cv.pdf"
url: process.env.NEXT_PUBLIC_SITE_URL   // e.g. https://samuelepoma.com
heroLead: "I build full-stack software, from Go services to React interfaces, and take projects from the first requirement to the final release."
languages: Italian (native), English (C1)
```
**Never publish the phone number** anywhere: not in the site, not in the metadata, not in the JSON-LD.

### 3.2 Projects: `projects.ts`
Each project follows this type. Every field shown in the case study is required unless marked optional.

```ts
type Project = {
  slug: string;                 // URL: /work/[slug]
  title: string;                // "MuseTrail"
  tagline: string;              // one-liner for the card and the <meta description>
  seo: { title: string; description: string };   // title ≤ 60 chars, description 140–160 chars
  period: { start: string; end?: string };       // ISO "2024-11"; no end means "now"
  status: "completed" | "in-progress";
  context: string;              // "University project · team of 5"
  role: string;                 // Samuele's role
  team?: number;
  stack: string[];
  problem: string;              // the problem solved
  approach: string[];           // what was done, 1–3 paragraphs
  architecture: { summary: string; diagram?: "progmatic" | "conneqtech" | ... };
  outcome: string;              // the result
  highlights?: string[];        // e.g. "Grand prize, Dragons' Den competition"
  learnings: string[];          // what Samuele learned (ask him, see CONTENT_TODO)
  links?: { repo?: string; demo?: string };  // only if public
  media: { hero: MediaSlotId; gallery?: MediaSlotId[] };
  featured?: boolean;
};
```

Projects, in display order (the facts come from the résumé; the prose is yours, but no new facts):

| Slug | Title | Facts |
|---|---|---|
| `musetrail` | MuseTrail | Nov 2024 – Jan 2025 · team project · SvelteKit and Docker · a web app promoting sustainable digital habits among young adults · Samuele worked on frontend and backend development and led the team · **won the grand prize in a Dragons' Den competition** · featured |
| `conneqtech-gps-dashboard` | GPS monitoring dashboard (Conneqtech) | Sep 2024 – Jan 2025 · internship · Go, frontend and backend · a dashboard for tracking cars and bicycles and seeing their GPS data and vehicle info in one place · Samuele took it from problem analysis and requirements through implementation to final delivery |
| `stedin-grid-monitoring` | Grid monitoring (Stedin) | University project · team · Laravel, PHP, MySQL · visualising power usage and monitoring faulty transformers across regions of the Netherlands |
| `progmatic-ai-knowledge-assistant` | AI knowledge assistant (Progmatic) | Sep 2026 – now · research · team of 5 · an internal AI assistant for technical and organisational knowledge · investigating document retrieval, FileMaker integration, access control and data confidentiality through client meetings and requirements analysis · status `in-progress` |
| `chess-game-java` | ChessGame | Dec 2024 – Jan 2025 · Java · a text-based chess game built with object-oriented programming and design patterns |

### 3.3 Other content files
- `experience.ts`: Conneqtech (Software Engineering Intern, Sep 2024 – Jan 2025) · Rondinella & Partners S.R.L. (web development and marketing, 2020 – 2022) · Artemis S.R.L. (administrative support, 2019 – 2020; shown only in the résumé, not on the site).
- `education.ts`: HZ University of Applied Sciences, BSc ICT (Software Engineering), Middelburg, 2023 – 2027 · English C1 course, Morgan School (2022) · Introduction to Web Development, Raspberry Pi Foundation (2023).
- `skills.ts`: **Languages** Go, TypeScript, JavaScript, Java, PHP, SQL · **Frameworks** React, SvelteKit, Laravel, Tailwind CSS · **Tools** Git, GitHub, Docker, MySQL · **Practices** frontend and backend development, OOP, design patterns, domain-driven design, Agile teamwork.
- `media.ts`: the registry of image slots from DESIGN.md §10 (`id`, `file`, `alt`, `ratio`, `placeholder` text).

### 3.4 `CONTENT_TODO.md`
Create it in Phase 1 and keep it updated. It lists every missing asset (image slots, the CV PDF) and every question for Samuele (for example: *What did you learn on MuseTrail? Are any repos public? What was the architecture of the Conneqtech dashboard? Can the Stedin screenshots be published?*).

---

## 4. Information architecture and routes

| Route | Page | Rendering |
|---|---|---|
| `/` | Home: Hero · Selected work · Stack · About (experience, education) · Contact | Static |
| `/work/[slug]` | Case study (5 pages, `generateStaticParams`, `dynamicParams = false`) | Static |
| `/privacy` | Privacy and cookie policy | Static |
| `/legal` | Legal notice: terms of use, copyright, licenses, credits | Static |
| `/cv` | 308 redirect → `/cv/samuele-poma-cv.pdf` | Config redirect |
| `/api/contact` | `POST` only | Node runtime |
| `not-found.tsx` | Custom 404 | Static |
| `error.tsx`, `global-error.tsx` | Error boundaries (the 500 page) | Client |

- URLs are lowercase, use hyphens, have no trailing slash (`trailingSlash: false`) and no file extensions.
- The home sections have anchor IDs: `#work`, `#stack`, `#about`, `#contact`. The nav links to them, and from other pages it links to `/#work` and so on.
- **Internal linking:** each case study links to the next project (in a loop) and back to `/#work`; project cards link to the case studies; the footer links to Privacy and Legal.
- **Breadcrumbs** (visible, plus JSON-LD) on case studies and legal pages: `Home / Work / MuseTrail`.

---

## 5. Architecture and code quality

### 5.1 Folder structure
```
.
├─ .github/                 workflows, dependabot.yml, PULL_REQUEST_TEMPLATE.md
├─ .claude/                 project skills + settings
├─ docs/
│  ├─ ARCHITECTURE.md
│  └─ adr/                  architecture decision records (0001-nextjs.md, 0002-csp-strategy.md, …)
├─ public/
│  ├─ images/               project media (DESIGN.md §10)
│  ├─ cv/                   samuele-poma-cv.pdf
│  └─ .well-known/security.txt
├─ src/
│  ├─ app/                  routes only; thin files that compose components
│  │  ├─ layout.tsx, page.tsx, not-found.tsx, error.tsx, global-error.tsx
│  │  ├─ work/[slug]/page.tsx, work/[slug]/opengraph-image.tsx
│  │  ├─ privacy/page.tsx, legal/page.tsx
│  │  ├─ api/contact/route.ts
│  │  ├─ sitemap.ts, robots.ts, manifest.ts, opengraph-image.tsx, icon.svg, apple-icon.png
│  ├─ components/
│  │  ├─ ui/                Button, Tag, MonoLabel, MediaFrame, MediaSlot, Placeholder, Breadcrumbs
│  │  ├─ layout/            Nav, MobileMenu, Footer, Section, Container, LocalTime
│  │  ├─ home/              Hero, SelectedWork, FeaturedProject, ProjectCard, StackSection, About, Contact
│  │  ├─ work/              CaseStudyHeader, MetaRow, CaseStudyBody, NextProject
│  │  ├─ visuals/           TerminalChess, ProgmaticDiagram, MeshGradient
│  │  ├─ motion/            Reveal, Spotlight, MotionProvider
│  │  └─ contact/           ContactForm, CopyEmail, Turnstile
│  ├─ content/              site.ts, projects.ts, experience.ts, education.ts, skills.ts, media.ts, schema.ts
│  ├─ lib/
│  │  ├─ seo/               metadata builders, jsonld.ts
│  │  ├─ contact/           schema.ts (shared), sanitize.ts, rate-limit.ts, turnstile.ts, send.ts
│  │  ├─ env.ts             Zod-validated env (server-only)
│  │  └─ utils/
│  └─ styles/globals.css    Tailwind + DESIGN.md tokens
├─ tests/
│  ├─ unit/  integration/  e2e/
├─ scripts/                 Node scripts (e.g. third-party-licenses.mjs, check-images.mjs)
├─ DESIGN.md  BUILD_PROMPT.md  CLAUDE.md  CONTENT_TODO.md  README.md  LICENSE  THIRD_PARTY_LICENSES.md
```

### 5.2 Principles
- **Server Components by default.** A component gets `"use client"` only if it needs state, effects or browser APIs: Nav (scroll state), MobileMenu, MeshGradient (pointer), Spotlight, Reveal, ContactForm, CopyEmail, LocalTime, the error boundaries. Keep client components small, as leaves of the tree.
- **Separation of concerns:** `content/` holds data, `components/` presentation, `lib/` logic, and `app/` composition and routing. Business logic (validation, sanitising, rate limiting) is pure, framework-free and unit-tested.
- **SOLID where it helps:** small single-purpose components, props typed with explicit interfaces, and side-effect adapters (email, Redis, Turnstile) behind interfaces so they can be mocked in tests.
- **Naming:** `PascalCase` components and files for components, `camelCase` functions and variables, `kebab-case` routes and slugs, `SCREAMING_SNAKE` env vars. One component per file.
- **No duplicate markup:** repeated patterns (section header with a mono eyebrow, media frame, tag list) are components.
- `import "server-only"` in every module that touches secrets.

### 5.3 Linting and formatting
- ESLint flat config: `typescript-eslint` (strict-type-checked), `@next/eslint-plugin-next`, `eslint-plugin-jsx-a11y` (strict), `eslint-plugin-react-hooks`, and import sorting.
- Prettier with `prettier-plugin-tailwindcss`.
- `.editorconfig`, plus `.gitattributes` with `* text=auto eol=lf` (important on Windows).
- **Husky** and **lint-staged** on pre-commit (eslint --fix, prettier, and type-check of staged files). **commitlint** on commit-msg (Conventional Commits).

---

## 6. SEO

### 6.1 Metadata (Next.js Metadata API)
- `metadataBase` = `NEXT_PUBLIC_SITE_URL`.
- Title template: `%s | Samuele Poma`. Home: **`Samuele Poma | Software Engineer — Go, React & Full-Stack`**. Case studies: `MuseTrail — Case study | Samuele Poma`. Every title is unique and ≤ 60 characters where possible.
- A unique `description` per page (140–160 characters, keywords used naturally).
- `alternates.canonical` on every page (an absolute URL, no query string).
- `robots`: `index, follow` in production. **Preview and development deployments send `noindex`** (checked via `VERCEL_ENV !== "production"`), both in metadata and as an `X-Robots-Tag` header.
- **Open Graph** (`og:title`, `og:description`, `og:url`, `og:type` = `website` for home and `article` for case studies, `og:image` 1200×630, `og:locale` = `en_US`, `og:site_name`) and **Twitter card** `summary_large_image`.
- **OG images generated in code** with `opengraph-image.tsx` (`ImageResponse`): the name or project title in Geist 600, the mesh gradient, and a mono URL. One for home and one per case study. They must look right on LinkedIn, WhatsApp and Slack; test them with the LinkedIn Post Inspector after deploy.
- `<html lang="en">`.

### 6.2 Files
- `robots.ts`: allow `/`, disallow `/api/`, point to the sitemap. In non-production: disallow all.
- `sitemap.ts`: home, 5 case studies, privacy and legal, with `lastModified` taken from the content.
- `manifest.ts`: name, `short_name: "SP"`, `theme_color: #fafafa`, `background_color: #fafafa`, `display: browser`, icons 192 and 512 (plus maskable).
- `icon.svg`: the **SP** monogram in Geist Mono, ink on canvas, with a `prefers-color-scheme` swap inside the SVG. Also `apple-icon.png` 180×180 and `favicon.ico` 32×32.
- `public/.well-known/security.txt` (RFC 9116): contact email, `Expires` one year ahead, `Preferred-Languages: en, it`, and a canonical URL.

### 6.3 Structured data (JSON-LD, one `<script type="application/ld+json">` per page)
- Home: `WebSite` plus `ProfilePage` with `mainEntity` a **`Person`**: `name`, `url`, `jobTitle: "Software Engineer"`, `address` (Middelburg, NL), `affiliation`/`alumniOf` (HZ University of Applied Sciences), `knowsAbout` (skills), `knowsLanguage`, `sameAs` [GitHub, LinkedIn]. **No telephone.**
- Case studies: **`CreativeWork`** (or `SoftwareSourceCode` if a public repo exists) with `author` → Person, `dateCreated`, `keywords`, `image`, plus a **`BreadcrumbList`**.
- Validate with the Schema.org validator and the Google Rich Results Test.

### 6.4 Keywords (used naturally, never stuffed)
Primary: **Software Engineer**, **Full-Stack Developer**, **Go Developer**, **React Developer**, **Software Engineer Netherlands**.
Secondary: Backend Developer, TypeScript, Java Developer, API development, software architecture, domain-driven design, design patterns, Agile, Software Engineering student (HZ University, Middelburg).
Where they go: the home `<title>` and description, the hero eyebrow and lead, the section intros, the About paragraph, project taglines, case-study `approach`/`architecture` text, image alt text (only when it's accurate), and slugs. **No `<meta name="keywords">`** (search engines ignore it). **No C#** unless confirmed.

### 6.5 Semantics
One `h1` per page (the hero name on home, the project title on case studies), a correct `h2`/`h3` hierarchy, `<article>` for each project card and case study, `<time datetime>` for dates, and descriptive link text (never "click here").

---

## 7. Performance

**Budgets (enforced by Lighthouse CI, see §11):**
- Lighthouse on mobile: **Performance ≥ 95, Accessibility 100, Best Practices 100, SEO 100** for `/`, one case study, and `/privacy`.
- **LCP < 2.0s, CLS < 0.05, INP < 150ms, TBT < 150ms.**
- First-load JS on `/` ≤ **160 KB gzipped**. Report it with `@next/bundle-analyzer` in the Phase 9 report.

**Techniques:**
- Static generation for every page; the Vercel CDN serves HTML and assets, with Brotli handled automatically.
- `next/image` for all raster media: AVIF/WebP, correct `sizes`, explicit dimensions, `priority` only for the hero or LCP image, lazy loading for everything else. Source files are pre-compressed (≤ 400 KB each); `scripts/check-images.mjs` fails CI on oversized files.
- Fonts via `next/font` (preloaded automatically). Only Geist and Geist Mono; no Google Fonts requests.
- **The mesh gradient is pure CSS** (blurred radial gradients animated with `transform`), paused off-screen with IntersectionObserver. No canvas, no WebGL.
- Motion loaded with `LazyMotion` + `domAnimation` features, only inside client islands.
- Load Turnstile **only when the contact form scrolls into view** (dynamic import plus IntersectionObserver).
- Load the Umami script with `next/script` `strategy="afterInteractive"`.
- Immutable caching for hashed assets (Next.js default). `public/images/*`: `Cache-Control: public, max-age=31536000, immutable` (file names include a version, e.g. `musetrail-01.v1.webp`).
- **Hero LCP:** the hero `h1` is the likely LCP element. Its entrance animation must not delay LCP. If Lighthouse shows a regression, animate only `transform`/`filter` on the `h1` and keep `opacity: 1`.
- Scroll reveals must not hide content before JavaScript runs: see §8.3.

---

## 8. Motion implementation

Follow DESIGN.md §7 exactly. Engineering rules:

1. **Tokens:** easing and durations are CSS custom properties (DESIGN.md §7.1), mirrored in `src/lib/motion.ts` for Motion.
2. **Reduced motion:** a global `@media (prefers-reduced-motion: reduce)` block, plus `MotionConfig reducedMotion="user"`, plus a check inside every custom hook. The Playwright suite runs one project with `reducedMotion: "reduce"` and asserts that nothing translates.
3. **Scroll reveals (progressive enhancement):** content is visible by default in the SSR HTML. The `<Reveal>` client component sets `data-reveal="pending"` on hydration **only for elements below the fold**, then an IntersectionObserver flips them to `"done"` once (threshold 0.15). Elements already in the viewport on hydration are never hidden. Crawlers and users without JS see everything.
4. **Hero entrance:** CSS keyframes (no JS needed), staggered with `animation-delay`.
5. **Case-study transition:** use the **View Transitions API** (React `<ViewTransition>` / the Next.js `viewTransition` option **if stable in the installed versions**; otherwise the native `document.startViewTransition` in a link wrapper) with a `view-transition-name` on the card media and the case-study hero. Browsers without support get an instant navigation; nothing breaks.
6. **Spotlight:** a CSS radial gradient positioned via CSS variables (`--x`, `--y`) updated in `pointermove` with rAF throttling. Only under `(hover: hover) and (pointer: fine)`.
7. **Terminal typing** (ChessGame) and **diagram path drawing** (Progmatic): run once on reveal, and are skipped under reduced motion.
8. Nothing animates `width`, `height`, `top`, `left`, `margin` or `box-shadow` on a large surface. Hover shadows are crossfaded with a pseudo-element's opacity.

---

## 9. Privacy, cookies and legal (GDPR, the Netherlands)

### 9.1 Data strategy: privacy by design
- **No cookies at all**, and no `localStorage`/`sessionStorage` for tracking.
- **Umami Cloud** is cookieless and doesn't store personal data, so no consent is needed. Configure it with `data-domains="samuelepoma.com"` (so previews and dev are never tracked) and respect `Do Not Track` (`data-do-not-track="true"`).
- **Vercel Speed Insights:** cookieless and aggregated.
- **Cloudflare Turnstile:** loaded only near the form; used only for spam protection (legitimate interest). Disclose it.
- **Therefore there is no cookie banner.** This is intentional, and the privacy policy explains it. `docs/adr/0003-no-cookie-banner.md` documents it. **Any future tool that sets non-essential cookies or does tracking must first get a consent manager** with separate opt-in per category, "reject all" as prominent as "accept all", and a persistent "Cookie preferences" link in the footer. The ADR states this rule.

### 9.2 `/privacy`: Privacy & cookie policy
Written in plain English, with sections:
1. Who is responsible (the controller): Samuele Poma, Middelburg, Netherlands, the contact email.
2. What data is collected and why:
   - **Contact form:** name, email, message. Purpose: replying. Legal basis: Art. 6(1)(f) legitimate interest / (b) steps at the request of the data subject.
   - **Server logs** (Vercel): IP address, user agent, timestamps, for security and operation.
   - **Rate limiting:** a salted SHA-256 hash of the IP, kept for the rate-limit window only (≤ 24h).
   - **Analytics** (Umami): anonymous, aggregated page views, referrer, device type and country; no cookies and no personal data.
   - **Anti-spam** (Turnstile).
3. **Retention:** contact messages deleted 12 months after the conversation ends; rate-limit keys ≤ 24h; Vercel logs per Vercel's retention; analytics aggregated.
4. **Recipients and processors:** Vercel (hosting, US: EU-US Data Privacy Framework), Resend (email delivery), Upstash (rate limiting, EU region), Cloudflare (Turnstile), Umami (analytics, EU region). Each links to its privacy policy.
5. **International transfers:** DPF / Standard Contractual Clauses.
6. **Your rights:** access, rectification, erasure, restriction, objection, portability; how to exercise them (email); the right to complain to the **Autoriteit Persoonsgegevens**.
7. **Cookies:** "This site does not use cookies." What the third parties do, and the rule from §9.1.
8. No automated decision-making. No sale of data. Children's data.
9. Changes to the policy, and a "Last updated" date.

### 9.3 `/legal`: Legal notice
1. Site owner and contact.
2. **Terms of use** (short): the content is for information only, and there is no liability for external links.
3. **Copyright:** © {current year} Samuele Poma. Text, images, the résumé, the name and the monogram: all rights reserved. Project screenshots are shown with permission from the companies/institutions involved (Samuele must confirm this for Conneqtech and Stedin; it's in `CONTENT_TODO.md`).
4. **Source code licence:** MIT, with a link to the repository.
5. **Third-party licences and credits:** Geist and Geist Mono (SIL Open Font License 1.1, Vercel), Lucide icons (ISC), Next.js/React (MIT), Motion (MIT), Tailwind CSS (MIT), and a link to the full `THIRD_PARTY_LICENSES.md` generated by `scripts/third-party-licenses.mjs` (from `pnpm licenses list --prod --json`). Include attribution wherever a license requires it.

### 9.4 Repository licences
- `LICENSE`: MIT for the **code**, with a note that the content (`src/content/`, `public/images/`, `public/cv/`) is excluded and all rights are reserved.
- `THIRD_PARTY_LICENSES.md` is regenerated in CI. CI fails if a production dependency has a copyleft licence (GPL, AGPL) not on the allowlist.

> ⚠️ The privacy text is a well-informed template, not legal advice. Flag this in the Phase 6 report.

---

## 10. Security

### 10.1 HTTP headers (`next.config.ts` `headers()`, all routes)
```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=(), browsing-topics=()
X-Frame-Options: DENY
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-site
Content-Security-Policy: (below)
```
Also `poweredByHeader: false`.

### 10.2 Content Security Policy
Target policy (adjust the hosts to what is actually loaded):
```
default-src 'self';
script-src 'self' <nonce-or-hashes> 'strict-dynamic' https://challenges.cloudflare.com https://cloud.umami.is;
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob:;
font-src 'self';
connect-src 'self' https://cloud.umami.is https://api-gateway.umami.dev;
frame-src https://challenges.cloudflare.com;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
object-src 'none';
upgrade-insecure-requests;
```
**Strategy:** check the Next.js CSP guide for the installed version. Prefer an approach that **keeps pages static** (hash/SRI-based, if supported). If only nonces are available (via `proxy`, which forces dynamic rendering), measure the performance impact. Choose the stricter option that still meets §7, and record the choice in `docs/adr/0002-csp-strategy.md`. **Never ship `script-src 'unsafe-inline'` without a nonce or hash.** Start by deploying it as `Content-Security-Policy-Report-Only` on the preview, verify there are no violations, then enforce it.

### 10.3 XSS
- React escaping only. **No `dangerouslySetInnerHTML`**, except for JSON-LD, which is serialized with a safe serializer that escapes `<` as `<`.
- External links use `rel="noopener noreferrer"` and `target="_blank"` with a visually hidden "(opens in new tab)" label.

### 10.4 Contact endpoint (`POST /api/contact`)
Processing order; fail fast with generic errors:
1. **Method and content type:** only `POST` with `application/json`; body ≤ 10 KB. Otherwise 405 / 415 / 413.
2. **Origin check (CSRF mitigation):** the `Origin` header must equal the site origin (or the preview origin in non-production). Otherwise 403. There are no cookies or auth, so no CSRF tokens are needed; document this.
3. **Rate limit** (Upstash sliding window) keyed on `sha256(ip + IP_HASH_SALT)`: **3 per 10 minutes and 10 per day.** Otherwise 429 with `Retry-After`.
4. **Zod validation** (the same schema as the client): `name` 2–100 characters, `email` a valid address ≤ 254, `message` 10–2000, `turnstileToken` required, `company` (the honeypot) must be empty, `startedAt` (a timestamp) at least 3 seconds ago. If the honeypot or timing check fails, **return 200 with a fake success** (don't tip off bots).
5. **Turnstile verification** server-side (`siteverify`, including `remoteip` and checking `hostname`). Otherwise 400.
6. **Sanitising:** trim, Unicode-normalize (NFKC), strip control characters (except `\n`), collapse repeated newlines, and reject messages with more than 3 URLs. Strip CR/LF from `name` and `email` (email header injection).
7. **Send via Resend:** a plain-text email to `CONTACT_TO_EMAIL`, from `CONTACT_FROM_EMAIL`, with `replyTo` the visitor's email; the subject `Portfolio contact — {name}` (sanitized). An idempotency key avoids duplicates.
8. **Response:** `{ ok: true }` or `{ ok: false, error: "<code>" }` with the codes `invalid_input | rate_limited | captcha_failed | server_error`. **Never return stack traces, provider errors or internal messages.** Log the details server-side (structured JSON, **with no message body and no email address**, only the error code and request ID).

The client form mirrors the validation (the same Zod schema), shows errors per DESIGN.md §8.12, disables double submission, and handles network failures.

**In development without keys:** Turnstile uses Cloudflare's always-pass test keys; if `RESEND_API_KEY` is missing and `NODE_ENV=development`, the email is logged to the console instead of sent. In production, missing env vars **fail the build** (`lib/env.ts`).

### 10.5 Secrets and the supply chain
- All secrets live in environment variables (Vercel project settings for Production and Preview, `.env.local` locally). **`.env*` is git-ignored except `.env.example`**, which lists every variable with a comment:
  ```
  NEXT_PUBLIC_SITE_URL=http://localhost:3000
  NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA   # Cloudflare test key
  TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
  RESEND_API_KEY=
  CONTACT_TO_EMAIL=
  CONTACT_FROM_EMAIL=
  UPSTASH_REDIS_REST_URL=
  UPSTASH_REDIS_REST_TOKEN=
  IP_HASH_SALT=
  NEXT_PUBLIC_UMAMI_WEBSITE_ID=
  ```
- No `NEXT_PUBLIC_` prefix on anything secret. `lib/env.ts` validates everything with Zod and is `server-only`.
- GitHub: enable **secret scanning plus push protection**, **Dependabot** (weekly, grouped minor/patch updates), **CodeQL** (default setup), and `gitleaks` in CI.
- CI runs `pnpm audit --prod --audit-level=high` and fails on high/critical issues.

---

## 11. Testing and quality gates

| Level | Tool | What |
|---|---|---|
| Unit | Vitest | Content schemas (every project is valid, slugs are unique, every media slot exists in the registry), `sanitize`, the contact Zod schema (edge cases), IP hashing, SEO/JSON-LD builders (no phone number, absolute URLs), date formatting |
| Component | Vitest + Testing Library | `ContactForm` (validation messages, disabled while sending, success and error states, labels linked), `MediaSlot` (placeholder vs image), `CopyEmail` |
| Integration | Vitest | The `/api/contact` route handler with mocked Resend, Upstash and Turnstile adapters: happy path, 405, 413, 415, 403 origin, 429, honeypot → fake 200, captcha failure, provider failure → generic 500 with no leak |
| E2E | Playwright | Navigation (nav anchors, card → case study → next project → back), 404 for an unknown slug, contact form happy path and errors (API mocked with `page.route`), copy email plus toast, mobile menu (open, focus trap, Esc to close), the `/cv` redirect, `robots.txt`, `sitemap.xml` and the manifest respond correctly, security headers are present |
| Accessibility | `@axe-core/playwright` | Every route in desktop and mobile: **0 violations** (WCAG 2.2 AA tags). Keyboard-only walkthrough test. Focus visible on every interactive element |
| Visual/responsive | Playwright screenshots | 375, 768, 1280 and 1920 widths × every route; assert there is **no horizontal overflow** (`scrollWidth <= clientWidth`) |
| Reduced motion | Playwright | A project with `reducedMotion: "reduce"` |
| Cross-browser | Playwright projects | **Chromium, Firefox, WebKit, Pixel 7 (Chrome Android), iPhone 15 (Safari iOS)**; Edge is Chromium. Plus a manual check on a real iPhone before launch |
| HTML validity | `html-validate` | On the rendered HTML of every route (from E2E) |
| Links | `linkinator` | Crawls the built site; **0 broken links** (internal and external) |
| Performance | Lighthouse CI (`@lhci/cli`) | The budgets from §7, as assertions |
| Metadata | Playwright | Every page has a unique title, a description, a canonical URL, OG tags, one `h1`, and valid JSON-LD |

Coverage target: at least 90% for `src/lib/**`. No coverage theatre on presentational components.

---

## 12. Repository, CI/CD and deployment

### 12.1 Git
- `git init`, default branch `main`. Remote: `github.com/SamuelePoma/portfolio` (public).
- **Branch strategy:** `main` is production and protected (PR required, CI green, linear history). Work happens on `feat/*`, `fix/*`, `chore/*`, `docs/*`. **Squash merge.**
- **Conventional Commits** (`feat(hero): add mesh gradient`), enforced by commitlint.
- `.gitignore` (Next.js, env, OS files, Playwright reports, `.vercel`), `.gitattributes`, `.nvmrc`, and `pnpm-lock.yaml` committed.
- `PULL_REQUEST_TEMPLATE.md` with a checklist (tests, a11y, screenshots, DESIGN.md compliance).

### 12.2 GitHub Actions (`.github/workflows/ci.yml`, on PRs and pushes to `main`)
Jobs (pnpm cache, Node from `.nvmrc`):
1. **quality:** `pnpm install --frozen-lockfile` → lint → typecheck → prettier check → unit and integration tests with coverage.
2. **security:** `pnpm audit --prod`, gitleaks, a licence check.
3. **build:** `next build` (with dummy-but-valid public env; secrets are not needed to build).
4. **e2e:** start the built app → Playwright (all browser projects) → axe → html-validate; upload the report as an artifact on failure.
5. **lighthouse:** LHCI against the started app, with budget assertions.
6. **links:** linkinator against the started app.

Plus a `codeql.yml` (default setup) and `dependabot.yml`.

### 12.3 Vercel
- Git integration: **every PR gets a Preview deployment** (noindex), and **`main` deploys to Production**. CI must pass before merging.
- **Environments:** Development (`.env.local`), Preview and Production each have their own env vars in Vercel. Resend/Upstash/Turnstile keys for production are set only in Production.
- **Rollback:** Vercel Instant Rollback (documented in the README).
- **Logging and monitoring:** structured server logs in Vercel, Speed Insights (Core Web Vitals from real users), and **UptimeRobot** (free) on `/` and `/api/contact` (a `HEAD` request returns 405, which is expected) with email alerts. Errors caught by error boundaries are logged with `console.error` (visible in Vercel), with no PII.

### 12.4 Domain (Phase 10, needs Samuele)
- Buy **`samuelepoma.com`** (about €10–15/year; this is the only non-free item). Recommended registrar: Cloudflare Registrar (at cost) or Porkbun.
- DNS: apex `A`/`ALIAS` → Vercel, `www` `CNAME` → Vercel. **The canonical domain is the apex `samuelepoma.com`; `www` redirects to it with a 308.** HTTP → HTTPS is automatic (Vercel certificate). Submit the domain to the HSTS preload list after verifying everything works.
- **Professional email:** `contact@samuelepoma.com` via **Cloudflare Email Routing** (free), forwarding to Gmail. Verify the domain in Resend (SPF, DKIM, DMARC `p=quarantine`) so form emails are sent from `noreply@samuelepoma.com`.
- Until the domain exists, use the `*.vercel.app` URL as `NEXT_PUBLIC_SITE_URL`.
- After launch: register with Google Search Console (submit the sitemap) and Bing Webmaster Tools, test the OG preview with the LinkedIn Post Inspector, and add the URL to the GitHub profile and LinkedIn.

---

## 13. Documentation

- **README.md:** a hero screenshot, a one-paragraph overview, the tech stack, a feature list (a11y, SEO, security headers, tests), **Getting started** (Node, pnpm, `.env.example` → `.env.local`, `pnpm dev`), a script reference, testing, deployment and rollback, the project structure, a link to DESIGN.md, and the licence. This README is itself portfolio material: it should read like a senior engineer wrote it.
- **docs/ARCHITECTURE.md:** a component and data-flow diagram (Mermaid), the rendering strategy, the contact pipeline and the security model.
- **docs/adr/:** short ADRs for each non-obvious decision (framework, CSP, no cookie banner, analytics choice, image strategy).
- **CLAUDE.md:** a short summary for future agent sessions, pointing to DESIGN.md, BUILD_PROMPT.md, CONTENT_TODO.md, the commands, and the Ground rules in §0.
- Code comments explain the *why*, not the *what*. TSDoc on exported `lib/` functions.

---

## 14. Phases and definition of done

Each phase ends with its checks green, a commit (or PR), a Playwright screenshot set where there is UI, a short report, and a **stop for approval**.

| # | Phase | Deliverables | Done when |
|---|---|---|---|
| 0 | **Tooling** | Skills and MCPs installed (§1), `git init` | The skills are listed and the Playwright MCP opens a page |
| 1 | **Scaffold** | Next.js + TS strict + Tailwind v4 + ESLint/Prettier/Husky/commitlint, the folder structure, `CLAUDE.md`, `CONTENT_TODO.md`, `.env.example`, `lib/env.ts`, Vitest and Playwright configured, **the CI workflow running**, the README skeleton, LICENSE | CI green on the first PR; `pnpm dev` runs on Windows |
| 2 | **Design system** | The DESIGN.md tokens in `@theme`, fonts, the primitives (Button, Tag, MonoLabel, Section, Container, MediaFrame, MediaSlot/Placeholder), a hidden `/_styleguide` route (dev only, `noindex`, excluded from the sitemap and removed from the production build) showing every primitive | Screenshots match DESIGN.md; axe shows 0 violations |
| 3 | **Content and home** | Content files and schemas, then Nav, Hero (static first), Selected work (featured and bento), Stack, About, Contact layout, Footer, the mobile menu | Every section is responsive at the 4 widths with no overflow; content tests pass |
| 4 | **Case studies** | `/work/[slug]` for all 5 projects, the meta row, breadcrumbs, next project, TerminalChess, ProgmaticDiagram | All routes are statically generated; the E2E navigation passes |
| 5 | **Contact backend** | The route handler, adapters, rate limiting, Turnstile, Resend, and the form's client states | Integration and E2E tests pass; a manual test email is received (with keys) |
| 6 | **SEO, legal and errors** | Metadata, OG images, JSON-LD, sitemap, robots, manifest, icons, security.txt, `/privacy`, `/legal`, 404, error boundaries, the `/cv` redirect, licences | The metadata E2E test passes; the Rich Results Test is valid; there are no broken links |
| 7 | **Motion** | Everything in DESIGN.md §7 via the Emil skills (`animate`), then a `review-animations` audit | The reduced-motion test passes; there is no CLS; INP is within budget |
| 8 | **Design review** | Impeccable `audit` → `critique` → `polish`; fix the findings | Impeccable reports no major issues; Samuele approves the screenshots |
| 9 | **Hardening and QA** | Security headers and CSP (report-only → enforce), analytics, the full test matrix, Lighthouse CI budgets, the bundle report, a README with screenshots, ARCHITECTURE and ADRs | **Every gate in §11 is green**; Lighthouse meets §7 |
| 10 | **Launch** | Vercel production, domain and DNS, email routing, Resend domain, UptimeRobot, Search Console, the LinkedIn OG check | The pre-launch checklist (§15) is fully ticked |

---

## 15. Pre-launch checklist

- [ ] No lorem ipsum, no `TODO` visible in the UI, no placeholder shown for an image that is in `CONTENT_TODO.md` as "Samuele has it"
- [ ] The CV PDF is present, **without the phone number**, and downloads correctly
- [ ] Title, description, canonical, OG and Twitter tags are correct on every page; the OG preview has been checked on LinkedIn and WhatsApp
- [ ] `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, favicon and apple icon, `security.txt`
- [ ] `www` → apex (308), HTTP → HTTPS, a valid certificate, HSTS
- [ ] All security headers present and CSP enforced with no violations (check securityheaders.com: grade **A+**)
- [ ] Lighthouse budgets met on mobile and desktop; Core Web Vitals green in Speed Insights
- [ ] axe shows 0 violations; keyboard-only walkthrough done; VoiceOver (iOS) and NVDA (Windows) spot-check done
- [ ] Tested on Chrome, Firefox, Safari, Edge, Safari iOS (a real device) and Chrome Android
- [ ] Contact form: a real email received, the rate limit triggers, the honeypot works, and errors are friendly
- [ ] Privacy and Legal pages are complete, dated, and linked from the footer; there are no cookies (check DevTools → Application → Cookies: empty)
- [ ] 0 broken links (linkinator)
- [ ] README, LICENSE, THIRD_PARTY_LICENSES, `.env.example` and ADRs are present; no secrets in the git history (gitleaks)
- [ ] The footer shows © with the current year; GitHub and LinkedIn links work
- [ ] Search Console has the sitemap submitted; UptimeRobot is active
