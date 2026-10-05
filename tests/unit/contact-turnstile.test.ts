import { createTurnstileVerifier, SITEVERIFY_URL } from "@/lib/contact/turnstile";
import { TURNSTILE_TEST_SECRET } from "@/lib/env/schema";

const REAL_SECRET = "0x4AAAAAAAreal-secret";

function siteverify(body: unknown, status = 200) {
  return vi.fn<typeof fetch>().mockResolvedValue(Response.json(body, { status }));
}

describe("createTurnstileVerifier", () => {
  it("posts the secret, the token and the visitor's IP to siteverify", async () => {
    const fetch = siteverify({ success: true, hostname: "samuelepoma.com" });
    const verifier = createTurnstileVerifier({
      secret: REAL_SECRET,
      allowedHostnames: ["samuelepoma.com"],
      fetch,
    });

    await expect(verifier.verify("token", "203.0.113.7")).resolves.toBe(true);
    const [url, init] = fetch.mock.calls[0] ?? [];
    expect(url).toBe(SITEVERIFY_URL);
    expect(init?.method).toBe("POST");
    expect(JSON.parse(init?.body as string)).toEqual({
      secret: REAL_SECRET,
      response: "token",
      remoteip: "203.0.113.7",
    });
  });

  it("leaves the IP out when it isn't known", async () => {
    const fetch = siteverify({ success: true, hostname: "samuelepoma.com" });
    const verifier = createTurnstileVerifier({
      secret: REAL_SECRET,
      allowedHostnames: ["samuelepoma.com"],
      fetch,
    });
    await verifier.verify("token", "unknown");
    expect(JSON.parse(fetch.mock.calls[0]?.[1]?.body as string)).not.toHaveProperty("remoteip");
  });

  it("refuses an empty token without calling Cloudflare", async () => {
    const fetch = siteverify({ success: true });
    const verifier = createTurnstileVerifier({ secret: REAL_SECRET, allowedHostnames: [], fetch });
    await expect(verifier.verify("", "203.0.113.7")).resolves.toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("refuses a token Cloudflare rejects", async () => {
    const verifier = createTurnstileVerifier({
      secret: REAL_SECRET,
      allowedHostnames: ["samuelepoma.com"],
      fetch: siteverify({ success: false, "error-codes": ["timeout-or-duplicate"] }),
    });
    await expect(verifier.verify("token", "203.0.113.7")).resolves.toBe(false);
  });

  it("refuses a valid token solved on another site", async () => {
    const verifier = createTurnstileVerifier({
      secret: REAL_SECRET,
      allowedHostnames: ["samuelepoma.com"],
      fetch: siteverify({ success: true, hostname: "evil.example" }),
    });
    await expect(verifier.verify("token", "203.0.113.7")).resolves.toBe(false);
  });

  it("refuses a valid token without a hostname when using a real secret", async () => {
    const verifier = createTurnstileVerifier({
      secret: REAL_SECRET,
      allowedHostnames: ["samuelepoma.com"],
      fetch: siteverify({ success: true }),
    });
    await expect(verifier.verify("token", "203.0.113.7")).resolves.toBe(false);
  });

  it("skips the hostname check for Cloudflare's test secret", async () => {
    const verifier = createTurnstileVerifier({
      secret: TURNSTILE_TEST_SECRET,
      allowedHostnames: ["localhost"],
      fetch: siteverify({ success: true, hostname: "example.com" }),
    });
    await expect(verifier.verify("XXXX.DUMMY.TOKEN.XXXX", "::1")).resolves.toBe(true);
  });

  it("throws when siteverify itself fails, so the API answers server_error", async () => {
    const verifier = createTurnstileVerifier({
      secret: REAL_SECRET,
      allowedHostnames: [],
      fetch: siteverify({}, 503),
    });
    await expect(verifier.verify("token", "203.0.113.7")).rejects.toThrow(/503/);
  });

  it("throws on an unexpected response shape", async () => {
    const verifier = createTurnstileVerifier({
      secret: REAL_SECRET,
      allowedHostnames: [],
      fetch: siteverify({ unexpected: true }),
    });
    await expect(verifier.verify("token", "203.0.113.7")).rejects.toThrow();
  });

  it("uses the global fetch by default", async () => {
    const fetch = siteverify({ success: true, hostname: "samuelepoma.com" });
    vi.stubGlobal("fetch", fetch);
    try {
      const verifier = createTurnstileVerifier({
        secret: REAL_SECRET,
        allowedHostnames: ["samuelepoma.com"],
      });
      await expect(verifier.verify("token", "203.0.113.7")).resolves.toBe(true);
      expect(fetch).toHaveBeenCalledOnce();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
