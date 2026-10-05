import "server-only";

import { publicEnv } from "@/lib/env/public";
import { parseDevelopmentServerEnv, parseServerEnv } from "@/lib/env/schema";

import type { ContactDeps } from "./handler";
import { contactOrigins } from "./origins";
import { consoleLogger } from "./ports";
import { createMemoryRateLimiter, createUpstashRateLimiter } from "./rate-limit";
import { createConsoleMailer, createResendMailer } from "./send";
import { createTurnstileVerifier } from "./turnstile";

type Source = Record<string, string | undefined>;

/**
 * Wires the contact pipeline to its real services. Production requires every secret
 * (parsing throws otherwise); local development falls back to the console, an
 * in-memory rate limit and Cloudflare's test secret, so it works without accounts.
 */
export function createContactDeps(source: Source = process.env): ContactDeps {
  const { origins, hostnames } = contactOrigins({
    siteUrl: publicEnv.NEXT_PUBLIC_SITE_URL,
    vercelEnv: source.VERCEL_ENV,
    vercelUrl: source.VERCEL_URL,
    vercelBranchUrl: source.VERCEL_BRANCH_URL,
  });
  const shared = { allowedOrigins: origins, log: consoleLogger };

  if (source.NODE_ENV !== "development") {
    const env = parseServerEnv(source);
    return {
      ...shared,
      ipSalt: env.IP_HASH_SALT,
      rateLimiter: createUpstashRateLimiter({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
      }),
      captcha: createTurnstileVerifier({
        secret: env.TURNSTILE_SECRET_KEY,
        allowedHostnames: hostnames,
      }),
      mailer: createResendMailer({
        apiKey: env.RESEND_API_KEY,
        from: env.CONTACT_FROM_EMAIL,
        to: env.CONTACT_TO_EMAIL,
      }),
    };
  }

  const env = parseDevelopmentServerEnv(source);
  const { RESEND_API_KEY, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL } = env;
  const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = env;
  return {
    ...shared,
    ipSalt: env.IP_HASH_SALT,
    rateLimiter:
      UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN
        ? createUpstashRateLimiter({ url: UPSTASH_REDIS_REST_URL, token: UPSTASH_REDIS_REST_TOKEN })
        : createMemoryRateLimiter(),
    captcha: createTurnstileVerifier({
      secret: env.TURNSTILE_SECRET_KEY,
      allowedHostnames: hostnames,
    }),
    mailer:
      RESEND_API_KEY && CONTACT_FROM_EMAIL && CONTACT_TO_EMAIL
        ? createResendMailer({
            apiKey: RESEND_API_KEY,
            from: CONTACT_FROM_EMAIL,
            to: CONTACT_TO_EMAIL,
          })
        : createConsoleMailer(),
  };
}

let cached: ContactDeps | undefined;

/** The services for this server instance, created on the first message. */
export function getContactDeps(): ContactDeps {
  cached ??= createContactDeps();
  return cached;
}
