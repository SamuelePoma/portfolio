import {
  type ContactDeps,
  handleContactRequest,
  MAX_BODY_BYTES,
  MIN_ELAPSED_MS,
} from "@/lib/contact/handler";
import type { LogEntry } from "@/lib/contact/ports";
import { MailerError } from "@/lib/contact/send";

const ORIGIN = "https://samuelepoma.com";

const validBody = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "I'd like to talk about a project.",
  turnstileToken: "token",
  company: "",
  elapsedMs: 12_000,
};

function makeDeps(overrides: Partial<ContactDeps> = {}) {
  const logs: LogEntry[] = [];
  const send = vi.fn<ContactDeps["mailer"]["send"]>().mockResolvedValue(undefined);
  const verify = vi.fn<ContactDeps["captcha"]["verify"]>().mockResolvedValue(true);
  const limit = vi
    .fn<ContactDeps["rateLimiter"]["limit"]>()
    .mockResolvedValue({ success: true, reset: Date.now() + 60_000 });
  const deps: ContactDeps = {
    allowedOrigins: [ORIGIN],
    ipSalt: "a-test-salt-of-16+chars",
    rateLimiter: { limit },
    captcha: { verify },
    mailer: { send },
    log: (entry) => logs.push(entry),
    requestId: () => "req-1",
    ...overrides,
  };
  return { deps, logs, send, verify, limit };
}

function post(body: unknown, init: { headers?: Record<string, string>; raw?: string } = {}) {
  return new Request(`${ORIGIN}/api/contact`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: ORIGIN,
      "x-forwarded-for": "203.0.113.7, 10.0.0.1",
      ...init.headers,
    },
    body: init.raw ?? JSON.stringify(body),
  });
}

async function call(request: Request, deps: ContactDeps) {
  const response = await handleContactRequest(request, deps);
  const text = await response.text();
  return { response, body: text === "" ? undefined : (JSON.parse(text) as unknown) };
}

describe("POST /api/contact", () => {
  it("sends a valid message and answers ok", async () => {
    const { deps, send, verify, logs } = makeDeps();
    const { response, body } = await call(post(validBody), deps);

    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true });
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(verify).toHaveBeenCalledWith("token", "203.0.113.7");
    expect(send).toHaveBeenCalledWith(
      { name: "Ada Lovelace", email: "ada@example.com", message: validBody.message },
      expect.stringMatching(/^contact-[0-9a-f]{64}$/),
    );
    expect(logs).toEqual([{ level: "info", event: "sent", requestId: "req-1", status: 200 }]);
  });

  it("uses the same idempotency key for the same message, so a retry sends once", async () => {
    const { deps, send } = makeDeps();
    await call(post(validBody), deps);
    await call(post(validBody), deps);
    expect(send.mock.calls[0]?.[1]).toBe(send.mock.calls[1]?.[1]);
  });

  it("rate-limits on a salted hash of the IP, never the IP itself", async () => {
    const { deps, limit } = makeDeps();
    await call(post(validBody), deps);
    const key = limit.mock.calls[0]?.[0] ?? "";
    expect(key).toMatch(/^[0-9a-f]{64}$/);
    expect(key).not.toContain("203.0.113.7");
  });

  it("answers 405 to anything but POST", async () => {
    const { deps } = makeDeps();
    const request = new Request(`${ORIGIN}/api/contact`, { method: "GET" });
    const { response, body } = await call(request, deps);
    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("POST");
    expect(body).toEqual({ ok: false, error: "invalid_input" });
  });

  it("answers 415 to a body that isn't JSON", async () => {
    const { deps } = makeDeps();
    const request = post(validBody, { headers: { "content-type": "text/plain" } });
    const { response, body } = await call(request, deps);
    expect(response.status).toBe(415);
    expect(body).toEqual({ ok: false, error: "invalid_input" });
  });

  it("sends a form posted without JavaScript back to the form, unprocessed", async () => {
    const { deps, send } = makeDeps();
    const request = post(undefined, {
      headers: { "content-type": "application/x-www-form-urlencoded" },
      raw: "name=Ada&email=ada%40example.com&message=hello",
    });
    const { response } = await call(request, deps);
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/#contact");
    expect(send).not.toHaveBeenCalled();
  });

  it("answers 413 when the declared size is too large", async () => {
    const { deps } = makeDeps();
    const request = post(validBody, { headers: { "content-length": String(MAX_BODY_BYTES + 1) } });
    const { response } = await call(request, deps);
    expect(response.status).toBe(413);
  });

  it("answers 413 when the body is too large, whatever the headers say", async () => {
    const { deps, send } = makeDeps();
    const request = post(undefined, {
      raw: JSON.stringify({ ...validBody, message: "x".repeat(MAX_BODY_BYTES) }),
    });
    const { response, body } = await call(request, deps);
    expect(response.status).toBe(413);
    expect(body).toEqual({ ok: false, error: "invalid_input" });
    expect(send).not.toHaveBeenCalled();
  });

  it.each([
    ["a missing origin", undefined],
    ["another site", "https://evil.example"],
    ["a lookalike", "https://samuelepoma.com.evil.example"],
  ])("answers 403 to %s", async (_, origin) => {
    const { deps, send } = makeDeps();
    const request = new Request(`${ORIGIN}/api/contact`, {
      method: "POST",
      headers: { "content-type": "application/json", ...(origin ? { origin } : {}) },
      body: JSON.stringify(validBody),
    });
    const { response, body } = await call(request, deps);
    expect(response.status).toBe(403);
    expect(body).toEqual({ ok: false, error: "invalid_input" });
    expect(send).not.toHaveBeenCalled();
  });

  it("answers 429 with Retry-After when the visitor is over the limit", async () => {
    const reset = Date.now() + 90_000;
    const { deps, send } = makeDeps({
      rateLimiter: { limit: () => Promise.resolve({ success: false, reset }) },
    });
    const { response, body } = await call(post(validBody), deps);
    expect(response.status).toBe(429);
    expect(body).toEqual({ ok: false, error: "rate_limited" });
    expect(Number(response.headers.get("retry-after"))).toBeGreaterThanOrEqual(89);
    expect(send).not.toHaveBeenCalled();
  });

  it("asks for at least one second, even when the window has just reset", async () => {
    const { deps } = makeDeps({
      rateLimiter: { limit: () => Promise.resolve({ success: false, reset: Date.now() - 5 }) },
    });
    const { response } = await call(post(validBody), deps);
    expect(response.headers.get("retry-after")).toBe("1");
  });

  it.each([
    ["malformed JSON", "{not json"],
    ["a missing field", JSON.stringify({ ...validBody, message: undefined })],
    ["a short message", JSON.stringify({ ...validBody, message: "Hi" })],
    ["an invalid email", JSON.stringify({ ...validBody, email: "ada@" })],
    ["a negative time", JSON.stringify({ ...validBody, elapsedMs: -1 })],
  ])("answers 400 to %s", async (_, raw) => {
    const { deps, send } = makeDeps();
    const { response, body } = await call(post(undefined, { raw }), deps);
    expect(response.status).toBe(400);
    expect(body).toEqual({ ok: false, error: "invalid_input" });
    expect(send).not.toHaveBeenCalled();
  });

  it("pretends to succeed when the honeypot is filled, and sends nothing", async () => {
    const { deps, send, verify } = makeDeps();
    const { response, body } = await call(post({ ...validBody, company: "ACME" }), deps);
    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true });
    expect(send).not.toHaveBeenCalled();
    expect(verify).not.toHaveBeenCalled();
  });

  it("pretends to succeed when the form was sent too fast to be human", async () => {
    const { deps, send } = makeDeps();
    const { body } = await call(post({ ...validBody, elapsedMs: MIN_ELAPSED_MS - 1 }), deps);
    expect(body).toEqual({ ok: true });
    expect(send).not.toHaveBeenCalled();
  });

  it("answers 400 captcha_failed when Turnstile says no", async () => {
    const { deps, send } = makeDeps({ captcha: { verify: () => Promise.resolve(false) } });
    const { response, body } = await call(post(validBody), deps);
    expect(response.status).toBe(400);
    expect(body).toEqual({ ok: false, error: "captcha_failed" });
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects a message with more than three links", async () => {
    const { deps, send } = makeDeps();
    const message = "See https://a.example https://b.example https://c.example www.d.example";
    const { response, body } = await call(post({ ...validBody, message }), deps);
    expect(response.status).toBe(400);
    expect(body).toEqual({ ok: false, error: "invalid_input" });
    expect(send).not.toHaveBeenCalled();
  });

  it("strips header injection from the name and the email", async () => {
    const { deps, send } = makeDeps();
    const { response } = await call(
      post({ ...validBody, name: "Ada\r\nBcc: victim@example.com" }),
      deps,
    );
    expect(response.status).toBe(200);
    expect(send.mock.calls[0]?.[0].name).toBe("Ada Bcc: victim@example.com");

    const injected = await call(
      post({ ...validBody, email: "ada@example.com\r\nBcc: x@y.z" }),
      deps,
    );
    expect(injected.response.status).toBe(400);
  });

  it("rejects a message that is only control characters once cleaned", async () => {
    const { deps, send } = makeDeps();
    const { response } = await call(post({ ...validBody, message: "\u0007".repeat(12) }), deps);
    expect(response.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it("hides a provider failure behind a generic 500", async () => {
    const { deps, logs } = makeDeps({
      mailer: { send: () => Promise.reject(new MailerError("invalid_from_address")) },
    });
    const { response, body } = await call(post(validBody), deps);
    expect(response.status).toBe(500);
    expect(body).toEqual({ ok: false, error: "server_error" });
    expect(JSON.stringify(body)).not.toContain("invalid_from_address");
    expect(logs).toEqual([
      { level: "error", event: "send_failed", requestId: "req-1", status: 500 },
    ]);
  });

  it("turns any unexpected error into a generic 500", async () => {
    const { deps, logs } = makeDeps({
      captcha: { verify: () => Promise.reject(new Error("siteverify answered 503")) },
    });
    const { response, body } = await call(post(validBody), deps);
    expect(response.status).toBe(500);
    expect(body).toEqual({ ok: false, error: "server_error" });
    expect(logs[0]?.event).toBe("unexpected_error");
  });

  it("never logs the message, the name or an email address", async () => {
    const { deps, logs } = makeDeps({ captcha: { verify: () => Promise.resolve(false) } });
    await call(post(validBody), deps);
    await call(post({ ...validBody, company: "x" }), deps);
    const logged = JSON.stringify(logs);
    expect(logged).not.toContain("Ada");
    expect(logged).not.toContain("ada@example.com");
    expect(logged).not.toContain("project");
    expect(logged).not.toContain("203.0.113.7");
  });

  it("generates a request id when none is injected", async () => {
    const { deps, logs } = makeDeps();
    delete deps.requestId;
    await call(post(validBody), deps);
    expect(logs[0]?.requestId).toMatch(/^[0-9a-f-]{36}$/);
  });
});
