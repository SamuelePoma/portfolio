import * as z from "zod/mini";

import {
  type ContactFieldErrors,
  type ContactFieldName,
  contactFieldNames,
  type ContactFields,
  EMAIL_MAX_LENGTH,
  MESSAGE_MAX_LENGTH,
  MESSAGE_MIN_LENGTH,
  NAME_MAX_LENGTH,
  TURNSTILE_TOKEN_MAX_LENGTH,
} from "./fields";

export * from "./fields";

/**
 * Contact form fields, shared by the browser (instant feedback) and the API route
 * (the real gate). Messages are written for people, not for developers.
 *
 * Built with `zod/mini`: the same rules as Zod, but only the checks used here reach
 * the browser bundle (the full library would add about 100 KB, gzipped). Checks run in
 * order and the first failing message per field is the one shown. The browser loads
 * this module only once someone uses the form; limits and types live in `fields.ts`.
 */

/** `satisfies` keeps the rules and `fields.ts` naming exactly the same fields. */
export const contactFieldsSchema = z.object({
  name: z
    .string()
    .check(
      z.trim(),
      z.minLength(1, "Please enter your name."),
      z.minLength(2, "Your name needs at least 2 characters."),
      z.maxLength(
        NAME_MAX_LENGTH,
        `Please keep your name under ${String(NAME_MAX_LENGTH)} characters.`,
      ),
    ),
  email: z
    .string()
    .check(
      z.trim(),
      z.minLength(1, "Please enter your email address."),
      z.maxLength(EMAIL_MAX_LENGTH, "This email address is too long."),
      z.email("Please enter a valid email address, like name@example.com."),
    ),
  message: z
    .string()
    .check(
      z.trim(),
      z.minLength(1, "Please write a message."),
      z.minLength(
        MESSAGE_MIN_LENGTH,
        `Please write at least ${String(MESSAGE_MIN_LENGTH)} characters.`,
      ),
      z.maxLength(
        MESSAGE_MAX_LENGTH,
        `Please keep your message under ${String(MESSAGE_MAX_LENGTH)} characters.`,
      ),
    ),
} satisfies Record<ContactFieldName, z.ZodMiniString>);

/**
 * What the form posts: the fields plus the anti-spam signals. `company` is the
 * honeypot (people never see it, so it stays empty); `elapsedMs` is how long the page
 * had been open, measured by the browser itself, so a visitor's clock being off can
 * never turn a real message into "spam".
 */
export const contactRequestSchema = z.extend(contactFieldsSchema, {
  turnstileToken: z.string().check(z.maxLength(TURNSTILE_TOKEN_MAX_LENGTH)),
  company: z.string().check(z.maxLength(200)),
  elapsedMs: z.number().check(z.int(), z.nonnegative()),
});

export type ContactRequest = z.infer<typeof contactRequestSchema>;

type ValidationResult =
  { success: true; data: ContactFields } | { success: false; errors: ContactFieldErrors };

/** Validates every field and returns the first message per field. */
export function validateContactFields(values: Record<ContactFieldName, string>): ValidationResult {
  const result = contactFieldsSchema.safeParse(values);
  if (result.success) return { success: true, data: result.data };

  const errors: ContactFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    const name = contactFieldNames.find((candidate) => candidate === field);
    if (name) errors[name] ??= issue.message;
  }
  return { success: false, errors };
}

/** Validates a single field, for feedback on blur. Returns the message, if any. */
export function validateContactField(field: ContactFieldName, value: string): string | undefined {
  const result = contactFieldsSchema.shape[field].safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}
