import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// The styleguide exists only on the dev server (`page.dev.tsx`). CI tests the
// production build, where it must not exist; locally it is checked for quality.
const isProductionBuild = Boolean(process.env.CI);

test.describe("styleguide", () => {
  test("is not shipped in production builds", async ({ request }) => {
    test.skip(!isProductionBuild, "Only meaningful against `next start`.");
    const response = await request.get("/styleguide");
    expect(response.status()).toBe(404);
  });

  test.describe("on the dev server", () => {
    test.skip(isProductionBuild, "The route is dev-only.");

    test("has no accessibility violations in light and night tones", async ({ page }) => {
      await page.goto("/styleguide");
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(results.violations).toEqual([]);
    });

    test("is excluded from search engines", async ({ page }) => {
      await page.goto("/styleguide");
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        "content",
        "noindex, nofollow",
      );
    });

    for (const width of [375, 768, 1280, 1920]) {
      test(`has no horizontal overflow at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto("/styleguide");
        const { scrollWidth, clientWidth } = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
      });
    }
  });
});
