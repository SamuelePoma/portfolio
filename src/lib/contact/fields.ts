/**
 * The contact form's shape without its rules: limits, field names, error codes and
 * types. Kept apart from `schema.ts` so the form can render (`maxLength`, the
 * character counter) without loading Zod; the rules load when someone uses it.
 */

export const NAME_MAX_LENGTH = 100;
export const EMAIL_MAX_LENGTH = 254;
export const MESSAGE_MIN_LENGTH = 10;
export const MESSAGE_MAX_LENGTH = 2000;

/** Turnstile tokens are at most 2048 characters (Cloudflare's documented limit). */
export const TURNSTILE_TOKEN_MAX_LENGTH = 2048;

/** In the order the form shows them, which is also the order errors take focus. */
export const contactFieldNames = ["name", "email", "message"] as const;
export type ContactFieldName = (typeof contactFieldNames)[number];
export type ContactFields = Record<ContactFieldName, string>;
export type ContactFieldErrors = Partial<Record<ContactFieldName, string>>;

/** The only error codes the API ever returns; details stay in the server logs. */
export const contactErrorCodes = [
  "invalid_input",
  "rate_limited",
  "captcha_failed",
  "server_error",
] as const;
export type ContactErrorCode = (typeof contactErrorCodes)[number];

export type ContactResponse = { ok: true } | { ok: false; error: ContactErrorCode };
