import "server-only";

import { existsSync } from "node:fs";
import path from "node:path";

/**
 * True when a file exists under `public/` (e.g. "/cv/samuele-poma-cv.pdf").
 * Checked at build time, so optional assets never render as broken links.
 */
export function publicFileExists(publicPath: string): boolean {
  const relative = publicPath.replace(/^\/+/, "");
  if (relative.split(/[\\/]/).includes("..")) return false;
  return existsSync(path.join(process.cwd(), "public", relative));
}
