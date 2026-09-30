import { parsePublicEnv, parseServerEnv } from "@/lib/env/schema";

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
