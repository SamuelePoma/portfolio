import { parsePublicEnv, TURNSTILE_TEST_SITE_KEY } from "./schema";

// NEXT_PUBLIC_* values are inlined at build time, so each one must be referenced literally.
export const publicEnv = parsePublicEnv({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  NEXT_PUBLIC_UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
});

/**
 * The Turnstile site key for the contact form. Local development falls back to
 * Cloudflare's always-pass test key; elsewhere a missing key hides the widget, and the
 * API then refuses messages, so a misconfigured deployment can't receive spam.
 */
export const turnstileSiteKey =
  publicEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY ??
  (process.env.NODE_ENV === "development" ? TURNSTILE_TEST_SITE_KEY : undefined);
