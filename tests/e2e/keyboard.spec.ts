import { expect, test } from "@playwright/test";

interface Stop {
  name: string;
  visible: boolean;
  indicator: boolean;
}

/**
 * A keyboard-only walk through the home page: every Tab stop must be on screen and show
 * a focus indicator, and the walk must reach the footer without getting trapped.
 */
test("every stop on the home page is visible and shows focus", async ({ page, browserName }) => {
  // WebKit leaves links out of the Tab order by default, like Safari.
  test.skip(browserName === "webkit", "WebKit leaves links out of the Tab order by default.");
  test.setTimeout(120_000);
  await page.goto("/");

  const stops: Stop[] = [];
  for (let index = 0; index < 80; index += 1) {
    await page.keyboard.press("Tab");
    // Smooth scrolling takes the page to the new stop: wait until it has stopped
    // moving, then for the scene springs to catch up.
    await page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          let last = -1;
          let still = 0;
          const tick = () => {
            if (window.scrollY === last) still += 1;
            else {
              still = 0;
              last = window.scrollY;
            }
            if (still > 8) resolve();
            else requestAnimationFrame(tick);
          };
          tick();
        }),
    );
    await page.waitForTimeout(400);
    const stop = await page.evaluate((): Stop | null => {
      const element = document.activeElement;
      if (!(element instanceof HTMLElement) || element === document.body) return null;
      const box = element.getBoundingClientRect();
      // Seen: on screen, and neither it nor a parent faded out.
      let opacity = 1;
      for (let node: HTMLElement | null = element; node; node = node.parentElement) {
        opacity *= Number(getComputedStyle(node).opacity);
      }
      const onScreen =
        box.width > 0 &&
        box.height > 0 &&
        box.bottom > 0 &&
        box.top < window.innerHeight &&
        box.right > 0 &&
        box.left < window.innerWidth;
      return {
        name: (element.getAttribute("aria-label") ?? element.textContent).trim().slice(0, 60),
        visible: onScreen && opacity > 0.5,
        // On the element, or on the card a stretched link covers (`has-[a:focus-visible]`).
        indicator: [element, element.closest("article")].some((node) => {
          if (!node) return false;
          const style = getComputedStyle(node);
          return style.outlineStyle !== "none" && Number.parseFloat(style.outlineWidth) > 0;
        }),
      };
    });
    if (!stop) break;
    stops.push(stop);
    if (stop.name === "Legal") break;
  }

  expect(stops.map((stop) => stop.name)).toEqual(
    expect.arrayContaining([
      "Skip to content",
      "Work",
      "View work",
      "Read the case study",
      "Legal",
    ]),
  );
  expect(stops.filter((stop) => !stop.visible).map((stop) => stop.name)).toEqual([]);
  expect(stops.filter((stop) => !stop.indicator).map((stop) => stop.name)).toEqual([]);
});
