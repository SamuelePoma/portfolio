import {
  documentPolicy,
  headerPolicy,
  inlineScripts,
  securityHeaders,
  withDocumentPolicy,
} from "@/lib/security/headers";

const page = (head: string, body = "") =>
  `<!DOCTYPE html><html><head><meta charSet="utf-8"/>${head}</head><body>${body}</body></html>`;

describe("headerPolicy", () => {
  it("keeps the site out of frames and leaves scripts to the document policy", () => {
    const policy = headerPolicy({ https: false });
    expect(policy).toContain("frame-ancestors 'none'");
    expect(policy).toContain("object-src 'none'");
    expect(policy).not.toContain("script-src");
    expect(policy).not.toContain("default-src");
    expect(policy).not.toContain("upgrade-insecure-requests");
  });

  it("upgrades insecure requests once deployed over HTTPS", () => {
    expect(headerPolicy({ https: true })).toMatch(/; upgrade-insecure-requests$/);
  });
});

describe("documentPolicy", () => {
  it("allows this origin and exactly the hashed inline scripts", () => {
    const policy = documentPolicy({ hashes: ["sha256-abc", "sha256-def"], analytics: false });
    expect(policy).toContain("default-src 'self'");
    expect(policy).toContain("script-src 'self' 'sha256-abc' 'sha256-def';");
    expect(policy).not.toMatch(/script-src[^;]*unsafe/);
    expect(policy).not.toContain("umami");
  });

  it("allows Umami only when analytics are on", () => {
    const policy = documentPolicy({ hashes: [], analytics: true });
    expect(policy).toContain("script-src 'self' https://cloud.umami.is;");
    expect(policy).toContain("connect-src 'self' https://gateway.umami.is;");
  });
});

describe("securityHeaders", () => {
  it("enforces the policy, or only reports it", () => {
    const keys = (enforce: boolean) =>
      securityHeaders({ https: true, enforce }).map((header) => header.key);
    expect(keys(true)).toContain("Content-Security-Policy");
    expect(keys(false)).toContain("Content-Security-Policy-Report-Only");
    expect(keys(true)).toEqual(
      expect.arrayContaining([
        "Strict-Transport-Security",
        "X-Content-Type-Options",
        "Referrer-Policy",
        "Permissions-Policy",
        "X-Frame-Options",
        "Cross-Origin-Opener-Policy",
        "Cross-Origin-Resource-Policy",
      ]),
    );
  });
});

describe("inlineScripts", () => {
  it("finds the inline scripts a browser runs, and skips external scripts and data", () => {
    const html = page(
      '<script src="/app.js" async=""></script>',
      [
        "<script>self.__next_f.push([0])</script>",
        '<script type="application/ld+json">{"@type":"Person"}</script>',
        '<script type="module">import "./x.js"</script>',
        '<script id="boot">run()</script>',
      ].join(""),
    );
    expect(inlineScripts(html)).toEqual(["self.__next_f.push([0])", 'import "./x.js"', "run()"]);
  });
});

describe("withDocumentPolicy", () => {
  it("writes the policy right after the charset, before any script", () => {
    const html = withDocumentPolicy(page("<script>a()</script>"), "default-src 'self'");
    expect(html).toContain(
      '<meta charSet="utf-8"/><meta http-equiv="Content-Security-Policy" data-csp="document" content="default-src \'self\'"/><script>',
    );
  });

  it("falls back to the start of the head", () => {
    const html = withDocumentPolicy("<html><head><title>x</title></head></html>", "p");
    expect(html).toMatch(/^<html><head><meta http-equiv="Content-Security-Policy"/);
  });

  it("leaves a page that already has a policy unchanged", () => {
    const once = withDocumentPolicy(page(""), "p");
    expect(withDocumentPolicy(once, "q")).toBe(once);
  });

  it("refuses a page without a head", () => {
    expect(() => withDocumentPolicy("<p>no head</p>", "p")).toThrow(/no <head>/);
  });
});
