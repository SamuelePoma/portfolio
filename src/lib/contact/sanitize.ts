import type { ContactFields } from "./schema";

/** More links than this reads as spam, not as a message to a person. */
export const MAX_URLS_IN_MESSAGE = 3;

/** Control characters (Unicode category Cc), except the newline we keep in messages. */
const CONTROL_CHARACTERS = /(?!\n)\p{Cc}/gu;
const LINE_BREAKS = /[\r\n]+/g;
const URLS = /\b(?:https?:\/\/|www\.)\S+/gi;

/**
 * A single-line value (name, email): NFKC-normalised, every line break removed so it
 * can never inject an email header, then stripped of other control characters.
 */
export function sanitizeLine(value: string): string {
  return value
    .normalize("NFKC")
    .replace(LINE_BREAKS, " ")
    .replace(CONTROL_CHARACTERS, "")
    .replace(/ {2,}/g, " ")
    .trim();
}

/**
 * The message: NFKC-normalised, Windows and old Mac line endings unified to `\n`,
 * control characters stripped (newlines kept), and runs of blank lines collapsed to
 * one, so the email stays readable.
 */
export function sanitizeMessage(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/\r\n?/g, "\n")
    .replace(CONTROL_CHARACTERS, "")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Counts links, written with a scheme or starting with `www.`. */
export function countUrls(value: string): number {
  return value.match(URLS)?.length ?? 0;
}

export type SanitizeResult =
  { ok: true; fields: ContactFields } | { ok: false; reason: "too_many_urls" };

/** Cleans every field and rejects link-heavy messages. */
export function sanitizeContactFields(fields: ContactFields): SanitizeResult {
  const message = sanitizeMessage(fields.message);
  if (countUrls(message) > MAX_URLS_IN_MESSAGE) return { ok: false, reason: "too_many_urls" };
  return {
    ok: true,
    fields: { name: sanitizeLine(fields.name), email: sanitizeLine(fields.email), message },
  };
}
