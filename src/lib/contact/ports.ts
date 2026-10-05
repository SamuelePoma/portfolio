/**
 * The contact pipeline's side effects, behind small interfaces so the handler stays
 * pure and every adapter can be swapped for a fake in tests.
 */

export interface RateLimitResult {
  success: boolean;
  /** When the visitor may try again, as a Unix timestamp in milliseconds. */
  reset: number;
}

export interface RateLimiter {
  limit(key: string): Promise<RateLimitResult>;
}

export interface CaptchaVerifier {
  /** True only when the token is valid for this site. Throws if the check itself fails. */
  verify(token: string, ip: string): Promise<boolean>;
}

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export interface Mailer {
  /** Delivers the message or throws; the same key never sends twice. */
  send(message: ContactMessage, idempotencyKey: string): Promise<void>;
}

/** A structured log line. Never carries the message, the name or an email address. */
export interface LogEntry {
  level: "info" | "warn" | "error";
  event: string;
  requestId: string;
  status?: number;
}

export type Logger = (entry: LogEntry) => void;

/** Logs one JSON line per event, which Vercel's log viewer indexes. */
export const consoleLogger: Logger = (entry) => {
  const line = JSON.stringify({ scope: "contact", ...entry });
  if (entry.level === "error") console.error(line);
  else if (entry.level === "warn") console.warn(line);
  else console.info(line);
};
