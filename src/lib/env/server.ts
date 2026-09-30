import "server-only";

import { parseServerEnv, type ServerEnv } from "./schema";

let cached: ServerEnv | undefined;

/**
 * Secrets are read lazily, on first use, so pages can be built without them.
 * Production builds on Vercel are validated up front in `next.config.ts`.
 */
export function getServerEnv(): ServerEnv {
  cached ??= parseServerEnv(process.env);
  return cached;
}
