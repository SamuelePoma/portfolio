/**
 * Writes the document half of the Content-Security-Policy into every prerendered page
 * (docs/adr/0003-csp-strategy.md): a <meta> tag with the page's whole policy, which
 * allows this origin's scripts and, by their SHA-256 hash, exactly the inline scripts
 * Next.js put in that page. Runs right after `next build` (the `build` script), so
 * pages stay static and no inline script runs unless the build itself wrote it.
 *
 * Where the pages are depends on how the app is built: `next start` serves them from
 * `.next/server/app`, while a deployment adapter (Vercel's) has Next.js keep them in
 * `.next/server/route-cache` and copies them into its own output under `.next`. So
 * every HTML document under `.next` is patched, wherever it is; the copies of a page
 * are identical, so they get the same policy.
 */
import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { documentPolicy, inlineScripts, withDocumentPolicy } from "../src/lib/security/headers.ts";

const root = path.join(process.cwd(), ".next");
/** Build caches and reports, not pages that are served. */
const SKIP = new Set(["cache", "diagnostics"]);
const analytics = Boolean(process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID);

async function* documents(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP.has(entry.name)) yield* documents(file);
    } else if (entry.name.endsWith(".html")) {
      yield file;
    }
  }
}

const pages = new Set();
let files = 0;
let scripts = 0;
for await (const file of documents(root)) {
  const html = await readFile(file, "utf8");
  const hashes = [
    ...new Set(
      inlineScripts(html).map(
        (body) => `sha256-${createHash("sha256").update(body, "utf8").digest("base64")}`,
      ),
    ),
  ];
  await writeFile(file, withDocumentPolicy(html, documentPolicy({ hashes, analytics })));
  files += 1;
  scripts += hashes.length;
  pages.add(html);
}

if (files === 0) throw new Error(`No prerendered pages under ${root}: run next build first.`);
console.log(
  `CSP: hashed ${String(scripts)} inline scripts in ${String(files)} files (${String(pages.size)} distinct pages).`,
);
