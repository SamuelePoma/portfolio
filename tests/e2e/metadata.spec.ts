import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

import { legalDocuments } from "../../src/content/legal";
import { projects } from "../../src/content/projects";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

const pages = [
  "/",
  ...projects.map((project) => `/work/${project.slug}`),
  ...legalDocuments.map((document) => `/${document.slug}`),
];

const meta = (page: Page, selector: string) =>
  page.locator(selector).first().getAttribute("content");

test.describe("metadata", () => {
  test("every page has a unique title and description, a canonical URL, social cards, one h1 and valid JSON-LD", async ({
    page,
  }) => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();

    for (const path of pages) {
      await page.goto(path);
      const title = await page.title();
      expect(title.length, `${path} title`).toBeGreaterThan(0);
      expect(title.length, `${path} title length`).toBeLessThanOrEqual(60);
      titles.add(title);

      const description = (await meta(page, 'meta[name="description"]')) ?? "";
      expect(description.length, `${path} description`).toBeGreaterThanOrEqual(140);
      expect(description.length, `${path} description`).toBeLessThanOrEqual(160);
      descriptions.add(description);

      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical, `${path} canonical`).toMatch(/^https?:\/\//);
      expect(new URL(canonical ?? "").pathname).toBe(path);

      for (const property of ["og:title", "og:description", "og:url", "og:type", "og:image"]) {
        expect(
          await meta(page, `meta[property="${property}"]`),
          `${path} ${property}`,
        ).toBeTruthy();
      }
      expect(await meta(page, 'meta[name="twitter:card"]')).toBe("summary_large_image");
      await expect(page.locator("h1")).toHaveCount(1);

      const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(scripts, `${path} JSON-LD`).toHaveLength(1);
      const data = JSON.parse(scripts[0] ?? "") as { "@context"?: string };
      expect(data["@context"]).toBe("https://schema.org");
      expect(scripts[0]).not.toMatch(/telephone/i);
    }

    expect(titles.size).toBe(pages.length);
    expect(descriptions.size).toBe(pages.length);
  });

  test("case studies are articles with their own Open Graph image", async ({ page, request }) => {
    const [project] = projects;
    await page.goto(`/work/${project.slug}`);
    expect(await meta(page, 'meta[property="og:type"]')).toBe("article");
    const image = await meta(page, 'meta[property="og:image"]');
    expect(image).toContain(`/work/${project.slug}/opengraph-image`);

    const response = await request.get(new URL(image ?? "").pathname);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe("image/png");
  });

  test("keeps non-production builds out of search engines", async ({ page, request }) => {
    await page.goto("/");
    expect(await meta(page, 'meta[name="robots"]')).toContain("noindex");
    const response = await request.get("/");
    expect(response.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  });
});

test.describe("site files", () => {
  test("robots.txt answers and blocks crawling outside production", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain("Disallow: /");
  });

  test("sitemap.xml lists every page", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const xml = await response.text();
    const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (match) => new URL(match[1] ?? "").pathname,
    );
    expect(locations.sort()).toEqual([...pages].sort());
  });

  test("the manifest names the site and lists its icons", async ({ request }) => {
    const response = await request.get("/manifest.webmanifest");
    expect(response.status()).toBe(200);
    const manifest = (await response.json()) as { short_name: string; icons: { src: string }[] };
    expect(manifest.short_name).toBe("SP");
    for (const icon of manifest.icons) {
      expect((await request.get(icon.src)).status(), icon.src).toBe(200);
    }
  });

  test("serves the icons and security.txt", async ({ request }) => {
    for (const path of [
      "/icon.svg",
      "/apple-icon.png",
      "/favicon.ico",
      "/.well-known/security.txt",
    ]) {
      expect((await request.get(path)).status(), path).toBe(200);
    }
  });

  test("/cv redirects permanently to the résumé file", async ({ request }) => {
    const response = await request.get("/cv", { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(response.headers().location).toBe("/cv/samuele-poma-cv.pdf");
  });
});

test.describe("utility pages", () => {
  test("an unknown address shows the 404 page", async ({ page }) => {
    const response = await page.goto("/no-such-page");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page doesn't exist.");
    await expect(page.getByRole("link", { name: "Back home" })).toHaveAttribute("href", "/");
    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    expect(results.violations).toEqual([]);
  });

  for (const legal of legalDocuments) {
    test(`${legal.slug} is readable, dated and accessible`, async ({ page }) => {
      await page.goto(`/${legal.slug}`);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(legal.title);
      await expect(page.locator(`time[datetime="${legal.updated}"]`)).toBeVisible();
      await expect(page.getByRole("heading", { level: 2 })).toHaveCount(legal.sections.length);
      const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
      expect(results.violations).toEqual([]);
      for (const width of [375, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(0);
      }
    });
  }

  test("the footer links to both legal pages", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("navigation", { name: "Legal" });
    await footer.getByRole("link", { name: "Privacy" }).click();
    await expect(page).toHaveURL(/\/privacy$/);
  });
});
