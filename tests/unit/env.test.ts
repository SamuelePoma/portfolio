import { assertProductionEnv, parsePublicEnv } from "@/lib/env/schema";

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

describe("assertProductionEnv", () => {
  it("accepts a public site URL", () => {
    expect(() => {
      assertProductionEnv({ NEXT_PUBLIC_SITE_URL: "https://samuelepoma.com" });
    }).not.toThrow();
  });

  it("requires the site URL instead of falling back to localhost", () => {
    expect(() => {
      assertProductionEnv({});
    }).toThrow(/NEXT_PUBLIC_SITE_URL/);
  });

  it("refuses localhost", () => {
    expect(() => {
      assertProductionEnv({ NEXT_PUBLIC_SITE_URL: "http://localhost:3000" });
    }).toThrow(/not localhost/);
  });

  it("still rejects a malformed URL", () => {
    expect(() => {
      assertProductionEnv({ NEXT_PUBLIC_SITE_URL: "not a url" });
    }).toThrow(/NEXT_PUBLIC_SITE_URL/);
  });
});
