import { z } from "zod";

/**
 * Environment schemas. Kept free of `server-only` so they can be imported by
 * `next.config.ts` (build-time validation) and by unit tests.
 */

export const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_UMAMI_WEBSITE_ID: z.uuid().optional(),
});

export const serverEnvSchema = z.object({
  RESEND_API_KEY: z.string().min(1),
  CONTACT_TO_EMAIL: z.email(),
  CONTACT_FROM_EMAIL: z.email(),
  TURNSTILE_SECRET_KEY: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  IP_HASH_SALT: z.string().min(16, "IP_HASH_SALT must be at least 16 characters"),
});

/** Cloudflare's always-pass test keys, as in `.env.example`. */
export const TURNSTILE_TEST_SITE_KEY = "1x00000000000000000000AA";
export const TURNSTILE_TEST_SECRET = "1x0000000000000000000000000000000AA";

/**
 * Cloudflare's documented test keys (always pass, always fail, already spent, …). They
 * only accept a dummy token, so they must never reach production.
 */
export function isTurnstileTestKey(key: string): boolean {
  return /^[1-3]x0+A[AB]$/.test(key);
}

/**
 * Local development needs no accounts: without Resend the email is printed, without
 * Upstash the rate limit is kept in memory, and Turnstile uses the test secret.
 */
export const developmentServerEnvSchema = serverEnvSchema.partial().extend({
  TURNSTILE_SECRET_KEY: z.string().min(1).default(TURNSTILE_TEST_SECRET),
  IP_HASH_SALT: z.string().min(16).default("development-only-salt"),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type DevelopmentServerEnv = z.infer<typeof developmentServerEnvSchema>;

/** Treats empty strings as missing, so `FOO=` in a .env file behaves like an unset variable. */
function withoutEmptyStrings(source: Record<string, string | undefined>) {
  return Object.fromEntries(Object.entries(source).filter(([, value]) => value !== ""));
}

function formatIssues(error: z.ZodError): string {
  return error.issues.map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`).join("\n");
}

export function parsePublicEnv(source: Record<string, string | undefined>): PublicEnv {
  const result = publicEnvSchema.safeParse(withoutEmptyStrings(source));
  if (!result.success) {
    throw new Error(`Invalid public environment variables:\n${formatIssues(result.error)}`);
  }
  return result.data;
}

export function parseServerEnv(source: Record<string, string | undefined>): ServerEnv {
  const result = serverEnvSchema.safeParse(withoutEmptyStrings(source));
  if (!result.success) {
    throw new Error(`Invalid server environment variables:\n${formatIssues(result.error)}`);
  }
  return result.data;
}

export function parseDevelopmentServerEnv(
  source: Record<string, string | undefined>,
): DevelopmentServerEnv {
  const result = developmentServerEnvSchema.safeParse(withoutEmptyStrings(source));
  if (!result.success) {
    throw new Error(`Invalid server environment variables:\n${formatIssues(result.error)}`);
  }
  return result.data;
}

/**
 * The production build's gate (`next.config.ts`, when `VERCEL_ENV=production`): every
 * secret present, a Turnstile site key, and no Cloudflare test key, so a misconfigured
 * deployment fails before going live.
 */
export function assertProductionEnv(source: Record<string, string | undefined>): void {
  const server = parseServerEnv(source);
  const siteKey = source.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey) {
    throw new Error(
      "Invalid public environment variables:\n  - NEXT_PUBLIC_TURNSTILE_SITE_KEY: required in production",
    );
  }
  if (isTurnstileTestKey(siteKey) || isTurnstileTestKey(server.TURNSTILE_SECRET_KEY)) {
    throw new Error("Cloudflare's Turnstile test keys can't be used in production");
  }
}
