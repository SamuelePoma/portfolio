import { z } from "zod";

import { isTurnstileTestKey } from "@/lib/env/schema";

import type { CaptchaVerifier } from "./ports";

export const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const siteverifyResponseSchema = z.object({
  success: z.boolean(),
  hostname: z.string().optional(),
});

interface TurnstileConfig {
  secret: string;
  /** Hostnames the widget may run on; any other is rejected. */
  allowedHostnames: readonly string[];
  fetch?: typeof globalThis.fetch;
  timeoutMs?: number;
}

/** Server-side Turnstile check (siteverify), including the visitor's IP and the hostname. */
export function createTurnstileVerifier({
  secret,
  allowedHostnames,
  fetch = globalThis.fetch,
  timeoutMs = 5000,
}: TurnstileConfig): CaptchaVerifier {
  return {
    async verify(token, ip) {
      if (token === "") return false;

      const response = await fetch(SITEVERIFY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret,
          response: token,
          ...(ip === "unknown" ? {} : { remoteip: ip }),
        }),
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!response.ok) throw new Error(`siteverify answered ${String(response.status)}`);

      const result = siteverifyResponseSchema.parse(await response.json());
      if (!result.success) return false;
      // Test secrets report no real hostname; production never uses one (next.config.ts).
      if (isTurnstileTestKey(secret)) return true;
      return result.hostname !== undefined && allowedHostnames.includes(result.hostname);
    },
  };
}
