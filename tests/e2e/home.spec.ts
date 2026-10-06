import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const EMAIL = "samuelepoma45@gmail.com";

/** Scrolls so the top of the first match sits `offset`px above the top of the viewport. */
async function scrollPast(page: Page, selector: string, offset: number) {
  await page.evaluate(
    ([target, by]) => {
      const element = document.querySelector(target);
      if (!element) return;
      // "instant" overrides the CSS smooth scrolling without touching the DOM.
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY + by,
        behavior: "instant",
      });
    },
    [selector, offset] as const,
  );
}

/** Phone-like: 8+ digits with at most one separator between them (a chess board is not). */
const PHONE_PATTERN = /\+?\d(?:[\s.-]?\d){7,}/;

test.describe("home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has one h1 and a section heading for each part of the page", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Samuele Poma.");
    const sectionHeadings = page.getByRole("heading", { level: 2 });
    await expect(sectionHeadings).toHaveText([
      "Things I've built.",
      "Tools I reach for.",
      "About me.",
      "Let's talk.",
    ]);
  });

  test("links every project to its case study", async ({ page }) => {
    const hrefs = await page
      .locator('#work a[href^="/work/"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    expect(new Set(hrefs)).toEqual(
      new Set([
        "/work/musetrail",
        "/work/progmatic-ai-knowledge-assistant",
        "/work/young-dcc-platform",
        "/work/veterinary-practice-system",
        "/work/conneqtech-gps-dashboard",
        "/work/stedin-grid-monitoring",
        "/work/chess-game-java",
        "/work/dnd-character-sheet-generator",
        "/work/tower-defense-typescript",
      ]),
    );
  });

  test("nav links jump to their sections", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Main" });
    for (const [label, id] of [
      ["Work", "work"],
      ["About", "about"],
      ["Contact", "contact"],
    ] as const) {
      await nav.getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(page.locator(`#${id}`)).toBeInViewport();
    }
  });

  test("opens external links safely in a new tab", async ({ page }) => {
    const rels = await page
      .locator('a[target="_blank"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute("rel") ?? ""));
    expect(rels.length).toBeGreaterThan(0);
    for (const rel of rels) {
      expect(rel).toContain("noopener");
      expect(rel).toContain("noreferrer");
    }
  });

  test("never shows a phone number or template dashes", async ({ page }) => {
    const text = await page.locator("body").innerText();
    expect(text).not.toMatch(/[\u2013\u2014]/);
    expect(text).not.toMatch(PHONE_PATTERN);
    await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
  });

  test("loads without console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      // The favicon arrives with the SEO phase; any other error fails the test.
      if (message.type() === "error" && !message.text().includes("favicon")) {
        errors.push(message.text());
      }
    });
    await page.reload();
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });

  test("matches the nav to the band behind it", async ({ page }) => {
    const nav = page.locator("#site-nav");
    // The opening scene is dark, so the nav starts in the night tone...
    await expect(nav).toHaveClass(/tone-night/);
    // ...and turns light over a light section.
    await scrollPast(page, "#stack", 200);
    await expect(nav).not.toHaveClass(/tone-night/);
    await scrollPast(page, "#contact", 200);
    await expect(nav).toHaveClass(/tone-night/);
  });

  test("has no horizontal overflow at common widths", async ({ page }) => {
    for (const width of [375, 768, 1280, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `overflow at ${width}px`).toBeLessThanOrEqual(0);
    }
  });

  test("lets keyboard users skip to the main content", async ({ page, browserName }) => {
    // Skipped on WebKit only: like Safari, it leaves links out of the Tab order by default.
    test.skip(browserName === "webkit", "WebKit leaves links out of the Tab order by default.");
    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: "Skip to content" });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main")).toBeFocused();
  });
});

test.describe("contact", () => {
  test("offers email and profiles, and no form", async ({ page }) => {
    await page.goto("/#contact");
    const contact = page.locator("#contact");
    await expect(contact.locator("form, input, textarea")).toHaveCount(0);
    await expect(
      contact.getByRole("link", { name: `${EMAIL} (copy to clipboard)` }),
    ).toHaveAttribute("href", `mailto:${EMAIL}`);
    await expect(contact.getByRole("link", { name: /GitHub/ })).toHaveAttribute(
      "href",
      "https://github.com/SamuelePoma",
    );
    await expect(contact.getByRole("link", { name: /LinkedIn/ })).toBeVisible();

    const results = await new AxeBuilder({ page })
      .include("#contact")
      .withTags(WCAG_TAGS)
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test("has no form endpoint", async ({ request }) => {
    const response = await request.post("/api/contact", { data: {} });
    expect(response.status()).toBe(404);
  });
});

test.describe("copy email", () => {
  test("copies the address and shows a toast", async ({ page, context, browserName }) => {
    // Skipped outside Chromium: only Chromium lets tests grant clipboard permissions.
    test.skip(browserName !== "chromium", "Clipboard permissions can only be granted in Chromium.");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/#contact");

    await page.getByRole("link", { name: `${EMAIL} (copy to clipboard)` }).click();

    await expect(page.getByText("Email copied")).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(EMAIL);
  });
});
