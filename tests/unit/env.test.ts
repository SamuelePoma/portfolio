import {
  assertProductionEnv,
  isTurnstileTestKey,
  parseDevelopmentServerEnv,
  parsePublicEnv,
  parseServerEnv,
  TURNSTILE_TEST_SECRET,
  TURNSTILE_TEST_SITE_KEY,
} from "@/lib/env/schema";

const validServerEnv = {
  RESEND_API_KEY: "re_test_123",
  CONTACT_TO_EMAIL: "to@example.com",
  CONTACT_FROM_EMAIL: "noreply@example.com",
  TURNSTILE_SECRET_KEY: "1x0000000000000000000000000000000AA",
  UPSTASH_REDIS_REST_URL: "https://example.upstash.io",
  UPSTASH_REDIS_REST_TOKEN: "token",
  IP_HASH_SALT: "a-long-random-salt-value",
};

describe("parsePublicEnv", () => {
  it("defaults the site URL to localhost", () => {
    expect(parsePublicEnv({}).NEXT_PUBLIC_SITE_URL).toBe("http://localhost:3000");
  });

  it("treats empty strings as unset", () => {
    const env = parsePublicEnv({ NEXT_PUBLIC_SITE_URL: "", NEXT_PUBLIC_UMAMI_WEBSITE_ID: "" });
    expect(env.NEXT_PUBLIC_SITE_URL).toBe("http://localhost:3000");
    expect(env.NEXT_PUBLIC_UMAMI_WEBSITE_ID).toBeUndefined();
  });

  it("rejects a malformed site URL", () => {
    expect(() => parsePublicEnv({ NEXT_PUBLIC_SITE_URL: "not a url" })).toThrow(
      /NEXT_PUBLIC_SITE_URL/,
    );
  });

  it("rejects a malformed Umami website id", () => {
    expect(() => parsePublicEnv({ NEXT_PUBLIC_UMAMI_WEBSITE_ID: "abc" })).toThrow(
      /NEXT_PUBLIC_UMAMI_WEBSITE_ID/,
    );
  });
});

describe("parseServerEnv", () => {
  it("accepts a complete configuration", () => {
    expect(parseServerEnv(validServerEnv)).toEqual(validServerEnv);
  });

  it("lists every missing variable in one error", () => {
    expect(() => parseServerEnv({})).toThrow(/RESEND_API_KEY[\s\S]*IP_HASH_SALT/);
  });

  it("rejects a short IP hash salt", () => {
    expect(() => parseServerEnv({ ...validServerEnv, IP_HASH_SALT: "short" })).toThrow(
      /at least 16 characters/,
    );
  });

  it("rejects an invalid contact email", () => {
    expect(() => parseServerEnv({ ...validServerEnv, CONTACT_TO_EMAIL: "nope" })).toThrow(
      /CONTACT_TO_EMAIL/,
    );
  });

  it("does not echo secret values in error messages", () => {
    const secret = "super-secret-value";
    try {
      parseServerEnv({ ...validServerEnv, UPSTASH_REDIS_REST_URL: secret });
      expect.unreachable();
    } catch (error) {
      expect(String(error)).not.toContain(secret);
    }
  });
});

describe("parseDevelopmentServerEnv", () => {
  it("needs no secrets, defaulting to Cloudflare's test secret and a local salt", () => {
    expect(parseDevelopmentServerEnv({})).toEqual({
      TURNSTILE_SECRET_KEY: TURNSTILE_TEST_SECRET,
      IP_HASH_SALT: "development-only-salt",
    });
  });

  it("still validates the values that are set", () => {
    expect(() => parseDevelopmentServerEnv({ CONTACT_TO_EMAIL: "nope" })).toThrow(
      /CONTACT_TO_EMAIL/,
    );
  });
});

describe("isTurnstileTestKey", () => {
  it.each([
    TURNSTILE_TEST_SITE_KEY,
    TURNSTILE_TEST_SECRET,
    "2x00000000000000000000AB",
    "3x0000000000000000000000000000000AA",
  ])("recognises the test key %s", (key) => {
    expect(isTurnstileTestKey(key)).toBe(true);
  });

  it("does not flag a real key", () => {
    expect(isTurnstileTestKey("0x4AAAAAAABkMYinukE8nzY")).toBe(false);
  });
});

describe("assertProductionEnv", () => {
  const production = {
    ...validServerEnv,
    TURNSTILE_SECRET_KEY: "0x4AAAAAAAreal-secret",
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: "0x4AAAAAAAreal-site-key",
  };

  it("accepts a complete production configuration", () => {
    expect(() => {
      assertProductionEnv(production);
    }).not.toThrow();
  });

  it("requires every secret", () => {
    expect(() => {
      assertProductionEnv({ ...production, RESEND_API_KEY: undefined });
    }).toThrow(/RESEND_API_KEY/);
  });

  it("requires the Turnstile site key", () => {
    expect(() => {
      assertProductionEnv({ ...production, NEXT_PUBLIC_TURNSTILE_SITE_KEY: "" });
    }).toThrow(/NEXT_PUBLIC_TURNSTILE_SITE_KEY/);
  });

  it.each([
    ["site key", { NEXT_PUBLIC_TURNSTILE_SITE_KEY: TURNSTILE_TEST_SITE_KEY }],
    ["secret", { TURNSTILE_SECRET_KEY: TURNSTILE_TEST_SECRET }],
  ])("refuses Cloudflare's test %s", (_, override) => {
    expect(() => {
      assertProductionEnv({ ...production, ...override });
    }).toThrow(/test keys/);
  });
});
