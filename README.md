# samuelepoma.com

Source code of the personal portfolio of **Samuele Poma**, a software engineer based in Middelburg, Netherlands. The site presents his projects as case studies and is built to production standards: static rendering, strict TypeScript, accessibility (WCAG 2.2 AA), security headers, and automated tests across five browsers.

> 🚧 Work in progress.

## Tech stack

| Area       | Tools                                                                                        |
| ---------- | -------------------------------------------------------------------------------------------- |
| Framework  | [Next.js 16](https://nextjs.org) (App Router), React 19                                      |
| Language   | TypeScript (strict)                                                                          |
| Styling    | Tailwind CSS v4, Geist and Geist Mono                                                        |
| Validation | Zod                                                                                          |
| Testing    | Vitest, Testing Library, Playwright, axe-core                                                |
| Quality    | ESLint (typescript-eslint strict, jsx-a11y strict), Prettier, Husky, lint-staged, commitlint |
| CI/CD      | GitHub Actions, Vercel                                                                       |

## Getting started

**Requirements:** Node.js 24 (see `.nvmrc`) and pnpm 12.

```bash
pnpm install
cp .env.example .env.local   # Windows PowerShell: Copy-Item .env.example .env.local
pnpm dev                     # http://localhost:3000
```

The site runs without any secrets. The contact form's external services (Resend, Upstash, Turnstile) are only needed to actually send messages; see [`.env.example`](.env.example).

## Scripts

| Script                              | Description                                                      |
| ----------------------------------- | ---------------------------------------------------------------- |
| `pnpm dev`                          | Start the development server                                     |
| `pnpm build`                        | Create a production build                                        |
| `pnpm start`                        | Serve the production build                                       |
| `pnpm lint` / `pnpm lint:fix`       | Lint (zero warnings allowed) / autofix                           |
| `pnpm typecheck`                    | Type-check the project                                           |
| `pnpm format` / `pnpm format:check` | Format with Prettier / check formatting                          |
| `pnpm test` / `pnpm test:coverage`  | Unit and integration tests / with coverage                       |
| `pnpm test:e2e`                     | End-to-end tests (Chromium, Firefox, WebKit, Pixel 7, iPhone 15) |
| `pnpm check`                        | Lint, types, formatting and unit tests in one go                 |

First run of the end-to-end tests: `pnpm exec playwright install`.

## Project structure

```
src/
  app/          Routes (thin: they compose components)
  components/   UI, layout, sections, motion
  content/      Typed site content (single source of truth)
  lib/          Pure logic: env, SEO, contact pipeline
tests/
  unit/  integration/  e2e/
docs/
  adr/          Architecture decision records
```

## Documentation

- [DESIGN.md](DESIGN.md): design system (color, type, motion, components)
- [docs/adr/](docs/adr/): architecture decisions

## Contributing workflow

`main` is production. Work happens on `feat/*`, `fix/*`, `chore/*` or `docs/*` branches and lands through pull requests that need green CI. Commit messages follow [Conventional Commits](https://www.conventionalcommits.org); a commit hook enforces it.

## License

The source code is released under the [MIT License](LICENSE). The site's content (text, images, résumé, name and monogram) is **not** covered by that license; all rights are reserved.
