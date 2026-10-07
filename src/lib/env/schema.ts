import { z } from "zod";

/**
 * Environment schema. Kept free of `server-only` so it can be imported by
 * `next.config.ts` (build-time validation) and by unit tests. The site has no secrets:
 * visitors reach Samuele by email, so there is no form, mail service or captcha.
 */

export const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_UMAMI_WEBSITE_ID: z.uuid().optional(),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

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

/**
 * The production build's gate (`next.config.ts`, when `VERCEL_ENV=production`): the
 * canonical URL must be set and public, or every canonical link, sitemap entry and
 * social card would point at localhost.
 */
export function assertProductionEnv(source: Record<string, string | undefined>): void {
  const { NEXT_PUBLIC_SITE_URL: siteUrl } = parsePublicEnv(source);
  if (!source.NEXT_PUBLIC_SITE_URL || new URL(siteUrl).hostname === "localhost") {
    throw new Error(
      "Invalid public environment variables:\n  - NEXT_PUBLIC_SITE_URL: required in production, and not localhost",
    );
  }
}
