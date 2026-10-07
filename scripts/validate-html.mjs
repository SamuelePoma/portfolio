/**
 * Validates every prerendered page with html-validate (rules in .htmlvalidate.mjs).
 * Run after `pnpm build`. `_global-error.html` is skipped: it is the empty shell Next.js
 * keeps for its error boundary, and the real document (with `lang`) comes from
 * `src/app/global-error.tsx` when it renders.
 */
import { readdir } from "node:fs/promises";
import path from "node:path";

import { FileSystemConfigLoader, formatterFactory, HtmlValidate } from "html-validate";

const root = path.join(process.cwd(), ".next/server/app");
const SKIP = new Set(["_global-error.html"]);

async function* pages(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* pages(file);
    else if (entry.name.endsWith(".html") && !SKIP.has(entry.name)) yield file;
  }
}

const validator = new HtmlValidate(new FileSystemConfigLoader());
const results = [];
let count = 0;
for await (const file of pages(root)) {
  const report = await validator.validateFile(file);
  results.push(...report.results);
  count += 1;
}

if (count === 0) throw new Error(`No prerendered pages in ${root}: run pnpm build first.`);
if (results.length > 0) {
  console.error(formatterFactory("text")(results));
  process.exitCode = 1;
} else {
  console.log(`HTML: ${String(count)} pages valid.`);
}
