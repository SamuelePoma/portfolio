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

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

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
