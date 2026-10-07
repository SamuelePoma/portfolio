import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { projects } from "../../src/content/projects";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

test.describe("case studies", () => {
  for (const [index, project] of projects.entries()) {
    const next = projects[(index + 1) % projects.length];

    test(`${project.slug} renders its content and links to the next project`, async ({ page }) => {
      const response = await page.goto(`/work/${project.slug}`);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(`${project.title} case study | Samuele Poma`);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(project.title);

      const breadcrumb = page.getByRole("navigation", { name: "Breadcrumb" });
      await expect(breadcrumb.getByRole("link", { name: "Work" })).toHaveAttribute(
        "href",
        "/#work",
      );
      await expect(breadcrumb.locator('[aria-current="page"]')).toHaveText(project.title);

      const nextLink = page.getByRole("navigation", { name: "Next project" }).getByRole("link");
      await expect(nextLink).toHaveAttribute("href", `/work/${next?.slug ?? ""}`);
    });

    test(`${project.slug} has no accessibility violations`, async ({ page }) => {
      await page.goto(`/work/${project.slug}`);
      const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
      expect(results.violations).toEqual([]);
    });

    test(`${project.slug} has no horizontal overflow at common widths`, async ({ page }) => {
      await page.goto(`/work/${project.slug}`);
      for (const width of [375, 768, 1280, 1920]) {
        await page.setViewportSize({ width, height: 900 });
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, `overflow at ${String(width)}px`).toBeLessThanOrEqual(0);
      }
    });
  }

  test("answers 404 for an unknown project", async ({ page }) => {
    const response = await page.goto("/work/not-a-project");
    expect(response?.status()).toBe(404);
  });
});

test.describe("navigation through the work", () => {
  test("goes from a card to its case study, on to the next one and back to the list", async ({
    page,
  }) => {
    const [first, second] = projects;
    await page.goto("/");

    // The first project's scene, wherever it sits in the work.
    await page
      .locator(`#work a[href="/work/${first.slug}"]`)
      .filter({ hasText: "Read the case study" })
      .click();
    await expect(page).toHaveURL(`/work/${first.slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(first.title);

    await page.getByRole("navigation", { name: "Next project" }).getByRole("link").click();
    await expect(page).toHaveURL(`/work/${second.slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(second.title);

    await page
      .getByRole("navigation", { name: "Breadcrumb" })
      .getByRole("link", { name: "Work" })
      .click();
    await expect(page).toHaveURL(/\/#work$/);
    await expect(page.locator("#work")).toBeInViewport();
  });

  test("opens a rail card's case study from its title link", async ({ page }) => {
    // The first three projects have scenes of their own; the fourth rides the rail.
    const [, , , project] = projects;
    await page.goto("/");
    await page.locator("#work").getByRole("link", { name: project.title, exact: true }).click();
    await expect(page).toHaveURL(`/work/${project.slug}`);
  });

  test("loops from the last case study back to the first", async ({ page }) => {
    const last = projects[projects.length - 1];
    const [first] = projects;
    await page.goto(`/work/${last?.slug ?? ""}`);
    await page.getByRole("navigation", { name: "Next project" }).getByRole("link").click();
    await expect(page).toHaveURL(`/work/${first.slug}`);
  });
});
