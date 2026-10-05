import { z } from "zod";

/**
 * Contact form fields, shared by the browser (instant feedback) and the API route
 * (the real gate). Messages are written for people, not for developers.
 */

export const NAME_MAX_LENGTH = 100;
export const EMAIL_MAX_LENGTH = 254;
export const MESSAGE_MIN_LENGTH = 10;
export const MESSAGE_MAX_LENGTH = 2000;

export const contactFieldsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please enter your name.")
    .min(2, "Your name needs at least 2 characters.")
    .max(NAME_MAX_LENGTH, `Please keep your name under ${NAME_MAX_LENGTH} characters.`),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .max(EMAIL_MAX_LENGTH, "This email address is too long.")
    .pipe(z.email("Please enter a valid email address, like name@example.com.")),
  message: z
    .string()
    .trim()
    .min(1, "Please write a message.")
    .min(MESSAGE_MIN_LENGTH, `Please write at least ${MESSAGE_MIN_LENGTH} characters.`)
    .max(MESSAGE_MAX_LENGTH, `Please keep your message under ${MESSAGE_MAX_LENGTH} characters.`),
});

/** Turnstile tokens are at most 2048 characters (Cloudflare's documented limit). */
export const TURNSTILE_TOKEN_MAX_LENGTH = 2048;

/**
 * What the form posts: the fields plus the anti-spam signals. `company` is the
 * honeypot (people never see it, so it stays empty); `elapsedMs` is how long the page
 * had been open, measured by the browser itself, so a visitor's clock being off can
 * never turn a real message into "spam".
 */
export const contactRequestSchema = contactFieldsSchema.extend({
  turnstileToken: z.string().max(TURNSTILE_TOKEN_MAX_LENGTH),
  company: z.string().max(200),
  elapsedMs: z.number().int().nonnegative(),
});

export type ContactRequest = z.infer<typeof contactRequestSchema>;

/** The only error codes the API ever returns; details stay in the server logs. */
export const contactErrorCodes = [
  "invalid_input",
  "rate_limited",
  "captcha_failed",
  "server_error",
] as const;
export type ContactErrorCode = (typeof contactErrorCodes)[number];

export type ContactResponse = { ok: true } | { ok: false; error: ContactErrorCode };

export type ContactFields = z.infer<typeof contactFieldsSchema>;
export type ContactFieldName = keyof ContactFields;
export type ContactFieldErrors = Partial<Record<ContactFieldName, string>>;

export const contactFieldNames = Object.keys(contactFieldsSchema.shape) as ContactFieldName[];

type ValidationResult =
  { success: true; data: ContactFields } | { success: false; errors: ContactFieldErrors };

/** Validates every field and returns the first message per field. */
export function validateContactFields(values: Record<ContactFieldName, string>): ValidationResult {
  const result = contactFieldsSchema.safeParse(values);
  if (result.success) return { success: true, data: result.data };

  const errors: ContactFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && field in contactFieldsSchema.shape) {
      errors[field as ContactFieldName] ??= issue.message;
    }
  }
  return { success: false, errors };
}

/** Validates a single field, for feedback on blur. Returns the message, if any. */
export function validateContactField(field: ContactFieldName, value: string): string | undefined {
  const result = contactFieldsSchema.shape[field].safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}
