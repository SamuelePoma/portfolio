import { clientIp, hashIp } from "@/lib/contact/ip";
import { contactOrigins } from "@/lib/contact/origins";

describe("clientIp", () => {
  it("takes the first address of x-forwarded-for", () => {
    expect(clientIp(new Headers({ "x-forwarded-for": " 203.0.113.7 , 10.0.0.1" }))).toBe(
      "203.0.113.7",
    );
  });

  it("falls back to x-real-ip", () => {
    expect(clientIp(new Headers({ "x-real-ip": "198.51.100.2" }))).toBe("198.51.100.2");
  });

  it("returns 'unknown' without proxy headers", () => {
    expect(clientIp(new Headers())).toBe("unknown");
    expect(clientIp(new Headers({ "x-forwarded-for": "", "x-real-ip": " " }))).toBe("unknown");
  });
});

describe("hashIp", () => {
  it("is a stable SHA-256 hex digest", () => {
    const hash = hashIp("203.0.113.7", "a-salt-of-sixteen");
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    expect(hashIp("203.0.113.7", "a-salt-of-sixteen")).toBe(hash);
  });

  it("depends on the salt and never contains the IP", () => {
    const hash = hashIp("203.0.113.7", "salt-one-16-chars");
    expect(hashIp("203.0.113.7", "salt-two-16-chars")).not.toBe(hash);
    expect(hash).not.toContain("203.0.113.7");
  });
});

describe("contactOrigins", () => {
  it("allows only the site itself in production", () => {
    expect(
      contactOrigins({
        siteUrl: "https://samuelepoma.com",
        vercelEnv: "production",
        vercelUrl: "portfolio-abc.vercel.app",
      }),
    ).toEqual({ origins: ["https://samuelepoma.com"], hostnames: ["samuelepoma.com"] });
  });

  it("adds the deployment and branch URLs on previews", () => {
    expect(
      contactOrigins({
        siteUrl: "https://samuelepoma.com",
        vercelEnv: "preview",
        vercelUrl: "portfolio-abc.vercel.app",
        vercelBranchUrl: "portfolio-git-feat.vercel.app",
      }),
    ).toEqual({
      origins: [
        "https://samuelepoma.com",
        "https://portfolio-abc.vercel.app",
        "https://portfolio-git-feat.vercel.app",
      ],
      hostnames: ["samuelepoma.com", "portfolio-abc.vercel.app", "portfolio-git-feat.vercel.app"],
    });
  });

  it("keeps the port of a local site and skips missing preview URLs", () => {
    expect(contactOrigins({ siteUrl: "http://localhost:3000", vercelEnv: "preview" })).toEqual({
      origins: ["http://localhost:3000"],
      hostnames: ["localhost"],
    });
  });
});
