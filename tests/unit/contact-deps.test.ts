vi.mock("@/lib/contact/rate-limit", () => ({
  createUpstashRateLimiter: vi.fn(() => ({ kind: "upstash" })),
  createMemoryRateLimiter: vi.fn(() => ({ kind: "memory" })),
}));
vi.mock("@/lib/contact/send", () => ({
  createResendMailer: vi.fn(() => ({ kind: "resend" })),
  createConsoleMailer: vi.fn(() => ({ kind: "console" })),
}));
vi.mock("@/lib/contact/turnstile", () => ({
  createTurnstileVerifier: vi.fn(() => ({ kind: "turnstile" })),
}));

import { createContactDeps, getContactDeps } from "@/lib/contact/deps";
import { createMemoryRateLimiter, createUpstashRateLimiter } from "@/lib/contact/rate-limit";
import { createConsoleMailer, createResendMailer } from "@/lib/contact/send";
import { createTurnstileVerifier } from "@/lib/contact/turnstile";
import { TURNSTILE_TEST_SECRET } from "@/lib/env/schema";

const secrets = {
  RESEND_API_KEY: "re_123",
  CONTACT_TO_EMAIL: "contact@samuelepoma.com",
  CONTACT_FROM_EMAIL: "noreply@samuelepoma.com",
  TURNSTILE_SECRET_KEY: "0x4AAAAAAAreal-secret",
  UPSTASH_REDIS_REST_URL: "https://eu1.upstash.io",
  UPSTASH_REDIS_REST_TOKEN: "token",
  IP_HASH_SALT: "a-long-random-salt-value",
};

describe("createContactDeps", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses every real service in production", () => {
    const deps = createContactDeps({ NODE_ENV: "production", ...secrets });

    expect(deps.ipSalt).toBe(secrets.IP_HASH_SALT);
    expect(createUpstashRateLimiter).toHaveBeenCalledWith({
      url: secrets.UPSTASH_REDIS_REST_URL,
      token: secrets.UPSTASH_REDIS_REST_TOKEN,
    });
    expect(createTurnstileVerifier).toHaveBeenCalledWith({
      secret: secrets.TURNSTILE_SECRET_KEY,
      allowedHostnames: ["localhost"],
    });
    expect(createResendMailer).toHaveBeenCalledWith({
      apiKey: secrets.RESEND_API_KEY,
      from: secrets.CONTACT_FROM_EMAIL,
      to: secrets.CONTACT_TO_EMAIL,
    });
    expect(createMemoryRateLimiter).not.toHaveBeenCalled();
    expect(createConsoleMailer).not.toHaveBeenCalled();
  });

  it("refuses to start in production without its secrets", () => {
    expect(() => createContactDeps({ NODE_ENV: "production" })).toThrow(/RESEND_API_KEY/);
  });

  it("works without any account in development", () => {
    const deps = createContactDeps({ NODE_ENV: "development" });

    expect(deps.allowedOrigins).toEqual(["http://localhost:3000"]);
    expect(deps.ipSalt).toBe("development-only-salt");
    expect(createMemoryRateLimiter).toHaveBeenCalledOnce();
    expect(createConsoleMailer).toHaveBeenCalledOnce();
    expect(createTurnstileVerifier).toHaveBeenCalledWith({
      secret: TURNSTILE_TEST_SECRET,
      allowedHostnames: ["localhost"],
    });
  });

  it("uses the real services in development when their keys are set", () => {
    createContactDeps({ NODE_ENV: "development", ...secrets });
    expect(createUpstashRateLimiter).toHaveBeenCalledOnce();
    expect(createResendMailer).toHaveBeenCalledOnce();
  });

  it("accepts posts from preview deployments on previews only", () => {
    const preview = createContactDeps({
      NODE_ENV: "production",
      VERCEL_ENV: "preview",
      VERCEL_URL: "portfolio-abc.vercel.app",
      ...secrets,
    });
    expect(preview.allowedOrigins).toContain("https://portfolio-abc.vercel.app");

    const production = createContactDeps({
      NODE_ENV: "production",
      VERCEL_ENV: "production",
      VERCEL_URL: "portfolio-abc.vercel.app",
      ...secrets,
    });
    expect(production.allowedOrigins).not.toContain("https://portfolio-abc.vercel.app");
  });
});

describe("getContactDeps", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("creates the services once per server instance", () => {
    for (const [key, value] of Object.entries(secrets)) vi.stubEnv(key, value);
    const first = getContactDeps();
    expect(getContactDeps()).toBe(first);
  });
});
