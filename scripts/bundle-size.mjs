/**
 * Reports the JavaScript each prerendered page loads up front (every `<script src>`,
 * gzipped) and fails when a page goes over the budget. Run after `pnpm build`.
 *
 * About 170 KB of the total is React and the Next.js runtime, which every page loads;
 * the budget leaves room for the site's own code on top.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";

const BUDGET_KB = 210;
const next = path.join(process.cwd(), ".next");
const app = path.join(next, "server/app");
const SKIP = new Set(["_global-error.html"]);

async function* pages(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* pages(file);
    else if (entry.name.endsWith(".html") && !SKIP.has(entry.name)) yield file;
  }
}

const sizes = new Map();
async function gzipped(src) {
  if (!sizes.has(src)) {
    const file = path.join(next, src.replace(/^\/_next\//, ""));
    sizes.set(src, gzipSync(await readFile(file), { level: 9 }).length);
  }
  return sizes.get(src);
}

const rows = [];
for await (const file of pages(app)) {
  const html = await readFile(file, "utf8");
  const scripts = new Set(
    [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => match[1]),
  );
  let total = 0;
  for (const src of scripts) total += await gzipped(src);
  const route = `/${path
    .relative(app, file)
    .replaceAll("\\", "/")
    .replace(/(index)?\.html$/, "")}`;
  rows.push({ route, kb: total / 1024 });
}

if (rows.length === 0) throw new Error(`No prerendered pages in ${app}: run pnpm build first.`);
rows.sort((a, b) => b.kb - a.kb);
const width = Math.max(...rows.map(({ route }) => route.length));
for (const { route, kb } of rows) {
  const flag = kb > BUDGET_KB ? "  over budget" : "";
  console.log(`${route.padEnd(width)}  ${kb.toFixed(1).padStart(6)} KB${flag}`);
}
const over = rows.filter(({ kb }) => kb > BUDGET_KB);
if (over.length > 0) {
  console.error(
    `\n${String(over.length)} page(s) load more than ${String(BUDGET_KB)} KB of gzipped JavaScript.`,
  );
  process.exitCode = 1;
} else {
  console.log(`\nFirst-load JavaScript: every page within ${String(BUDGET_KB)} KB gzipped.`);
}
