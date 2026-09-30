@AGENTS.md

# Samuele Poma — portfolio

Personal project showcase for Samuele Poma (software engineer). Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4.

## Read first

- [DESIGN.md](DESIGN.md): how it looks and moves. Wins on anything visual.
- [BUILD_PROMPT.md](BUILD_PROMPT.md): how it's built, the phases, and the definition of done. Wins on engineering. §0 has the ground rules.
- [CONTENT_TODO.md](CONTENT_TODO.md): missing assets and open questions for Samuele.

## Commands (pnpm 12; note: `pnpm -s` does not exist in this version)

| Command                     | What                                                              |
| --------------------------- | ----------------------------------------------------------------- |
| `pnpm dev`                  | Dev server on :3000                                               |
| `pnpm build` / `pnpm start` | Production build / serve it                                       |
| `pnpm check`                | lint + typecheck + format check + unit tests                      |
| `pnpm test:coverage`        | Vitest with coverage (≥ 90% on `src/lib`)                         |
| `pnpm test:e2e`             | Playwright, all 5 browser projects (`--project=chromium` for one) |

## Rules that are easy to forget

- Never invent facts (metrics, architecture, repo links). Missing info → `CONTENT_TODO.md`.
- No phone number anywhere on the site.
- Server Components by default; `"use client"` only for small interactive leaves.
- Modules touching secrets import `server-only`; env access goes through `src/lib/env/`.
- Commits follow Conventional Commits (commitlint runs on commit-msg); hooks are never skipped.
- Verify UI with the Playwright MCP at 375 / 768 / 1280 / 1920 widths.
- Samuele develops on Windows: npm scripts must be cross-platform (Node scripts, no bash-isms).
