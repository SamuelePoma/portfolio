import { expect, test } from "@playwright/test";

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("shows every scene in its final state, unpinned", async ({ page }) => {
    await page.goto("/");
    // Pinning is CSS: prefers-reduced-motion turns the sticky stages back to static.
    const positions = await page
      .locator(".scene-stage")
      .evaluateAll((stages) => stages.map((stage) => getComputedStyle(stage).position));
    expect(positions.length).toBeGreaterThan(0);
    expect(positions.filter((position) => position === "sticky")).toEqual([]);
    const viewport = page.viewportSize()?.height ?? 900;
    const heights = await page
      .locator(".scene")
      .evaluateAll((scenes) => scenes.map((scene) => scene.getBoundingClientRect().height));
    expect(heights.length).toBeGreaterThan(0);
    // Pinned scenes are several screens tall; still ones only as tall as their content.
    for (const height of heights) expect(height).toBeLessThan(viewport * 3);
  });

  test("hydrates without errors", async ({ page }) => {
    // The server can't know the preference, so the page must hydrate as rendered and
    // only then settle into its still state, never discard the server HTML.
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    // NavTone marks the nav once its effects have run, so hydration is over by then.
    await page.locator("#site-nav[data-tone-ready]").waitFor({ state: "attached" });
    expect(errors).toEqual([]);
  });

  test("keeps the hero name and the open laptop visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByAltText(/Young DCC home page/).first()).toBeVisible();
  });

  test("turns the project rail into a row you scroll yourself", async ({ page }) => {
    await page.goto("/");
    const row = page.locator(".overflow-x-auto").filter({ has: page.locator("article") });
    await expect(row).toHaveCount(1);
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("shows every piece a scroll animation would bring in", async ({ page }) => {
    await page.goto("/");
    const pieces = page.locator("[data-reveal]");
    expect(await pieces.count()).toBeGreaterThan(0);
    // Playwright counts opacity 0 as visible, so check the computed style itself.
    const hidden = await pieces.evaluateAll(
      (elements) => elements.filter((element) => getComputedStyle(element).opacity === "0").length,
    );
    expect(hidden).toBe(0);
  });
});

test.describe("with motion", () => {
  test("pins the opening, then opens the laptop as you scroll through its scene", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "One engine is enough to check the choreography.");
    await page.goto("/");
    const viewport = page.viewportSize()?.height ?? 900;
    const opening = page.locator(".scene").first();
    const openingHeight = await opening.evaluate(
      (element) => element.getBoundingClientRect().height,
    );
    expect(openingHeight).toBeGreaterThan(viewport * 2);

    // The laptop belongs to the Young DCC scene, inside the work.
    const scene = page.locator(".scene", { has: page.locator("#project-young-dcc-platform") });
    const box = await scene.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { top: rect.top + window.scrollY, height: rect.height };
    });
    expect(box.height).toBeGreaterThan(viewport * 2);

    const screenOff = () =>
      scene.evaluate((element) => {
        const overlay = element.querySelector(".absolute.inset-0.bg-black");
        return overlay ? Number(getComputedStyle(overlay).opacity) : -1;
      });
    const scrollTo = (top: number) =>
      page.evaluate((y) => {
        window.scrollTo({ top: y, behavior: "instant" });
      }, top);

    await scrollTo(box.top);
    await expect.poll(screenOff).toBe(1);
    await scrollTo(box.top + box.height - viewport);
    await expect.poll(screenOff).toBe(0);
  });
});
