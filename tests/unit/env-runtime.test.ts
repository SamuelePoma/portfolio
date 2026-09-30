const validServerEnv = {
  RESEND_API_KEY: "re_test_123",
  CONTACT_TO_EMAIL: "to@example.com",
  CONTACT_FROM_EMAIL: "noreply@example.com",
  TURNSTILE_SECRET_KEY: "1x0000000000000000000000000000000AA",
  UPSTASH_REDIS_REST_URL: "https://example.upstash.io",
  UPSTASH_REDIS_REST_TOKEN: "token",
  IP_HASH_SALT: "a-long-random-salt-value",
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("publicEnv", () => {
  it("reads NEXT_PUBLIC_* variables from process.env", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://samuelepoma.com");
    const { publicEnv } = await import("@/lib/env/public");
    expect(publicEnv.NEXT_PUBLIC_SITE_URL).toBe("https://samuelepoma.com");
  });
});

describe("getServerEnv", () => {
  it("parses process.env once and caches the result", async () => {
    for (const [key, value] of Object.entries(validServerEnv)) vi.stubEnv(key, value);
    const { getServerEnv } = await import("@/lib/env/server");

    const first = getServerEnv();
    vi.stubEnv("RESEND_API_KEY", "changed");
    expect(getServerEnv()).toBe(first);
    expect(first.RESEND_API_KEY).toBe("re_test_123");
  });

  it("throws when a secret is missing", async () => {
    const { getServerEnv } = await import("@/lib/env/server");
    expect(() => getServerEnv()).toThrow(/Invalid server environment variables/);
  });
});
