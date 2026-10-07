/**
 * Runs Prettier on exactly the files git considers part of the project: tracked and
 * untracked, minus everything git ignores, including local excludes.
 * Usage: `pnpm format` (writes) or `pnpm format:check`.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";

const mode = process.argv.includes("--check") ? "--check" : "--write";
const prettierBin = createRequire(import.meta.url).resolve("prettier/bin/prettier.cjs");

const listed = ["ls-files", "--cached", "--others", "--exclude-standard", "-z"];
const files = execFileSync("git", listed, { encoding: "utf8" })
  .split("\0")
  .filter((file) => file && existsSync(file));

// Chunk to stay under the Windows command-line length limit.
const CHUNK_SIZE = 100;
let failed = false;
for (let i = 0; i < files.length; i += CHUNK_SIZE) {
  const chunk = files.slice(i, i + CHUNK_SIZE);
  const result = spawnSync(process.execPath, [prettierBin, mode, "--ignore-unknown", ...chunk], {
    stdio: "inherit",
  });
  if (result.status !== 0) failed = true;
}

process.exit(failed ? 1 : 0);
