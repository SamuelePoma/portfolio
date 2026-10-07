import { expect, test } from "@playwright/test";

const ROUTES = ["/", "/work/musetrail", "/privacy", "/legal"];

test.describe("security", () => {
  for (const route of ROUTES) {
    test(`${route} sends the security headers`, async ({ request }) => {
      const response = await request.get(route);
      const headers = response.headers();
      expect(headers["strict-transport-security"]).toContain("max-age=63072000");
      expect(headers["x-content-type-options"]).toBe("nosniff");
      expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
      expect(headers["permissions-policy"]).toContain("camera=()");
      expect(headers["x-frame-options"]).toBe("DENY");
      expect(headers["cross-origin-opener-policy"]).toBe("same-origin");
      expect(headers["cross-origin-resource-policy"]).toBe("same-site");
      expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
      expect(headers["x-powered-by"]).toBeUndefined();
    });

    test(`${route} carries a script policy without unsafe-inline`, async ({ page }) => {
      await page.goto(route);
      const policy = await page
        .locator('meta[http-equiv="Content-Security-Policy"]')
        .getAttribute("content");
      expect(policy).toMatch(/script-src 'self'( 'sha256-[^']+')+/);
      const scriptSources = /script-src ([^;]*)/.exec(policy ?? "")?.[1] ?? "";
      expect(scriptSources).not.toContain("unsafe-inline");
      expect(scriptSources).not.toContain("unsafe-eval");
    });
  }

  test("blocks an inline script the build did not write", async ({ page }) => {
    await page.goto("/");
    const outcome = await page.evaluate(
      () =>
        new Promise<{ ran: boolean; reported: boolean }>((resolve) => {
          let reported = false;
          document.addEventListener("securitypolicyviolation", () => {
            reported = true;
          });
          const script = document.createElement("script");
          script.textContent = "window.__injected = true";
          document.body.append(script);
          setTimeout(() => {
            resolve({ ran: "__injected" in window, reported });
          }, 300);
        }),
    );
    expect(outcome).toEqual({ ran: false, reported: true });
  });
});
