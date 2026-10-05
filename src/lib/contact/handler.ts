import { createHash, randomUUID } from "node:crypto";

import { clientIp, hashIp } from "./ip";
import type { CaptchaVerifier, Logger, Mailer, RateLimiter } from "./ports";
import { sanitizeContactFields } from "./sanitize";
import {
  type ContactErrorCode,
  contactFieldsSchema,
  contactRequestSchema,
  type ContactResponse,
} from "./schema";

/** Larger bodies are refused before parsing: a real message is a few kilobytes at most. */
export const MAX_BODY_BYTES = 10 * 1024;

/** A form filled and sent faster than this is a script, not a person. */
export const MIN_ELAPSED_MS = 3000;

export interface ContactDeps {
  /** Exact origins (scheme, host, port) allowed to post. */
  allowedOrigins: readonly string[];
  ipSalt: string;
  rateLimiter: RateLimiter;
  captcha: CaptchaVerifier;
  mailer: Mailer;
  log: Logger;
  requestId?: () => string;
}

function json(status: number, body: ContactResponse, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

/** The media type without parameters, e.g. "application/json". */
function mediaType(request: Request): string {
  return (request.headers.get("content-type") ?? "").split(";")[0]?.trim().toLowerCase() ?? "";
}

/** Reads the body as text, giving up as soon as it exceeds `limit` bytes. */
async function readBody(request: Request, limit: number): Promise<string | undefined> {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      return undefined;
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
}

type Fail = (
  status: number,
  error: ContactErrorCode,
  event: string,
  headers?: Record<string, string>,
) => Response;

/**
 * Steps 1 and 2: method, content type, declared size and origin. Returns the response
 * to send when the request is turned away, or nothing when it may go on.
 */
function checkRequest(
  request: Request,
  deps: ContactDeps,
  fail: Fail,
  requestId: string,
): Response | undefined {
  if (request.method !== "POST") {
    return fail(405, "invalid_input", "method_not_allowed", { Allow: "POST" });
  }
  const type = mediaType(request);
  if (type === "application/x-www-form-urlencoded" || type === "multipart/form-data") {
    // A form posted without JavaScript: nothing is processed. Back to the form,
    // whose <noscript> note offers email instead.
    deps.log({ level: "info", event: "no_js_post", requestId, status: 303 });
    return new Response(null, {
      status: 303,
      headers: { Location: "/#contact", "Cache-Control": "no-store" },
    });
  }
  if (type !== "application/json") return fail(415, "invalid_input", "unsupported_media_type");
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return fail(413, "invalid_input", "payload_too_large");
  }
  // No cookies or sessions exist, so checking the origin is all the CSRF defence needed.
  const origin = request.headers.get("origin");
  if (origin === null || !deps.allowedOrigins.includes(origin)) {
    return fail(403, "invalid_input", "origin_rejected");
  }
  return undefined;
}

/**
 * `POST /api/contact`, as a plain function of a Web `Request` (docs/adr/0002):
 * method, content type and size; origin; rate limit; validation, honeypot and timing;
 * Turnstile; sanitising; sending. It fails fast with a generic code, never a provider
 * message or a stack trace, and logs only the event, the status and a request id.
 */
export async function handleContactRequest(request: Request, deps: ContactDeps): Promise<Response> {
  const requestId = deps.requestId?.() ?? randomUUID();

  const fail: Fail = (status, error, event, headers = {}) => {
    deps.log({ level: status >= 500 ? "error" : "warn", event, requestId, status });
    return json(status, { ok: false, error }, headers);
  };

  try {
    const rejected = checkRequest(request, deps, fail, requestId);
    if (rejected) return rejected;

    // 3. Rate limit on a salted hash of the IP.
    const ip = clientIp(request.headers);
    const limit = await deps.rateLimiter.limit(hashIp(ip, deps.ipSalt));
    if (!limit.success) {
      const retryAfter = Math.max(1, Math.ceil((limit.reset - Date.now()) / 1000));
      return fail(429, "rate_limited", "rate_limited", { "Retry-After": String(retryAfter) });
    }

    // 4. Validation, then the honeypot and the timing check.
    const body = await readBody(request, MAX_BODY_BYTES);
    if (body === undefined) return fail(413, "invalid_input", "payload_too_large");
    const parsed = contactRequestSchema.safeParse(parseJson(body));
    if (!parsed.success) return fail(400, "invalid_input", "validation_failed");

    const { turnstileToken, company, elapsedMs, ...fields } = parsed.data;
    if (company !== "" || elapsedMs < MIN_ELAPSED_MS) {
      // Looks like a bot: answer as if it worked, so it learns nothing.
      deps.log({ level: "warn", event: "spam_suspected", requestId, status: 200 });
      return json(200, { ok: true });
    }

    // 5. Turnstile.
    if (!(await deps.captcha.verify(turnstileToken, ip))) {
      return fail(400, "captcha_failed", "captcha_failed");
    }

    // 6. Sanitising, then the same rules again on the cleaned values.
    const sanitized = sanitizeContactFields(fields);
    if (!sanitized.ok) return fail(400, "invalid_input", sanitized.reason);
    const clean = contactFieldsSchema.safeParse(sanitized.fields);
    if (!clean.success) return fail(400, "invalid_input", "validation_failed");

    // 7. Send. The same message sent twice (a double click, a retry) is delivered once.
    const key = createHash("sha256")
      .update(`${clean.data.email}\n${clean.data.message}`)
      .digest("hex");
    await deps.mailer.send(clean.data, `contact-${key}`);

    deps.log({ level: "info", event: "sent", requestId, status: 200 });
    return json(200, { ok: true });
  } catch (error) {
    // The provider's own error stays out of the logs too: only which step failed.
    const sendFailed = error instanceof Error && error.name === "MailerError";
    return fail(500, "server_error", sendFailed ? "send_failed" : "unexpected_error");
  }
}
