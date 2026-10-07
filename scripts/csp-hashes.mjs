/**
 * Writes the document half of the Content-Security-Policy into every prerendered page
 * (docs/adr/0003-csp-strategy.md): a <meta> tag with the page's whole policy, which
 * allows this origin's scripts and, by their SHA-256 hash, exactly the inline scripts
 * Next.js put in that page. Runs right after `next build` (the `build` script), so
 * pages stay static and no inline script runs unless the build itself wrote it.
 */
import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { documentPolicy, inlineScripts, withDocumentPolicy } from "../src/lib/security/headers.ts";

const root = path.join(process.cwd(), ".next/server/app");
const analytics = Boolean(process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID);

async function* pages(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* pages(file);
    else if (entry.name.endsWith(".html")) yield file;
  }
}

let count = 0;
let scripts = 0;
for await (const file of pages(root)) {
  const html = await readFile(file, "utf8");
  const hashes = [
    ...new Set(
      inlineScripts(html).map(
        (body) => `sha256-${createHash("sha256").update(body, "utf8").digest("base64")}`,
      ),
    ),
  ];
  await writeFile(file, withDocumentPolicy(html, documentPolicy({ hashes, analytics })));
  count += 1;
  scripts += hashes.length;
}

if (count === 0) throw new Error(`No prerendered pages in ${root}: run next build first.`);
console.log(`CSP: hashed ${String(scripts)} inline scripts across ${String(count)} pages.`);
