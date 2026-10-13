import { test, expect } from "@playwright/test";

// Floating dock must exist on every breakpoint once the user scrolls,
// and must hide only when returning to the top. It must not leave tablet
// widths without any bottom navigation between md and 2xl.
for (const width of [390, 768, 820, 1024, 1280, 1440, 1536, 1800]) {
  test(`floating navigation persists while scrolling at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 820 });
    await page.goto('/?test', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-dock]:visible')).toHaveCount(0);
    await page.evaluate(() => window.scrollTo(0, 550));
    await expect(page.locator('[data-dock]:visible')).toHaveCount(1);
    await page.evaluate(() => window.scrollTo(0, 850));
    await expect(page.locator('[data-dock]:visible')).toHaveCount(1);
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(page.locator('[data-dock]:visible')).toHaveCount(0);
  });
}
