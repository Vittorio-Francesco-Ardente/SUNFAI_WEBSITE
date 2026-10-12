import { test, expect, type Page } from "@playwright/test";
import { allRoutes, quickRoutes, withLocales } from "./mobile-routes";

/**
 * Required hooks in the app (add them when building pack 02 / 15):
 *   [data-topbar]        the top menu
 *   [data-dock]          the mobile/desktop dock (visible state: data-visible="true")
 *   [data-dock-more]     the "Altro" button in the mobile dock
 *   [data-menu-sheet]    the full-screen sheet (role="dialog")
 *   [data-bleed]         decorative elements allowed to cross the viewport edge (they must be clipped by overflow-x: clip)
 *   [data-carousel]      transform-based carousels (Motion drag) whose off-screen slides are clipped by their track
 *   [data-hit-area]      small visuals whose hit area is enlarged by a pseudo-element (InfoDot, carousel dots)
 *   ?test                query flag: disables autoplay animations and the loader
 */
const routes = withLocales(process.env.MOBILE_FULL ? allRoutes : quickRoutes);

async function open(page: Page, route: string) {
  await page.goto(`${route}?test`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
}

for (const route of routes) {
  test.describe(route, () => {
    test("no horizontal overflow", async ({ page }) => {
      await open(page, route);
      const res = await page.evaluate(() => {
        // On mobile, innerWidth grows with overflowing content: measure the layout viewport instead.
        const vw = document.documentElement.clientWidth;
        const docOverflow = document.documentElement.scrollWidth - vw;
        const offenders: string[] = [];
        // Exempt: content of horizontal scrollers (rails, chart cards) and decorative shapes.
        // body/section use overflow-x: clip, so "clipped" is NOT an exemption for real content.
        const inScroller = (el: Element) => {
          for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
            const ox = getComputedStyle(p).overflowX;
            if (ox === "auto" || ox === "scroll") return true;
          }
          return false;
        };
        document.querySelectorAll("body *").forEach((el) => {
          if (el.closest("[data-bleed], [data-carousel], [aria-hidden='true'], svg") || inScroller(el)) return;
          const r = el.getBoundingClientRect();
          if (r.width && (r.right > vw + 1 || r.left < -1)) {
            offenders.push(`${el.tagName.toLowerCase()}.${(el.getAttribute("class") || "").split(" ").slice(0, 2).join(".")} [${Math.round(r.left)}→${Math.round(r.right)}]`);
          }
        });
        return { docOverflow, offenders: offenders.slice(0, 10) };
      });
      expect(res.docOverflow, "page scrolls horizontally").toBeLessThanOrEqual(1);
      expect(res.offenders, "elements outside the viewport").toEqual([]);
    });

    test("tap targets ≥ 44 px, dock items ≥ 48 px", async ({ page }) => {
      await open(page, route);
      const small = await page.evaluate(() => {
        const sel = 'a[href], button, [role="button"], input:not([type="hidden"]), select, textarea, summary, [tabindex="0"]';
        const out: string[] = [];
        document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
          const cs = getComputedStyle(el);
          if (cs.visibility === "hidden" || cs.display === "none" || el.closest("[aria-hidden='true'], [inert]")) return;
          const r = el.getBoundingClientRect();
          if (!r.width || !r.height) return;
          // inline links inside running text are exempt (WCAG 2.5.8 inline exception)
          if (el.tagName === "A" && cs.display === "inline" && el.closest("p, li")) return;
          const min = el.closest("[data-dock]") ? 48 : 44;
          const hit = el.hasAttribute("data-hit-area") || el.closest("[data-hit-area]");
          if (!hit && (r.width < min - 0.5 || r.height < min - 0.5)) {
            out.push(`${el.tagName.toLowerCase()} "${(el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 30)}" ${Math.round(r.width)}×${Math.round(r.height)}`);
          }
        });
        return out.slice(0, 15);
      });
      expect(small).toEqual([]);
    });

    test("readable text, inputs ≥ 16 px", async ({ page }) => {
      await open(page, route);
      const bad = await page.evaluate(() => {
        const out: string[] = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          const el = n.parentElement;
          const txt = n.textContent?.trim();
          if (!el || !txt || !el.getClientRects().length || el.closest("svg, [aria-hidden='true'], .sr-only")) continue;
          const fs = parseFloat(getComputedStyle(el).fontSize);
          if (fs < 13) out.push(`text ${fs}px: "${txt.slice(0, 30)}"`);
        }
        document.querySelectorAll<HTMLElement>("input, select, textarea").forEach((el) => {
          const fs = parseFloat(getComputedStyle(el).fontSize);
          if (fs < 16) out.push(`field ${fs}px: ${el.getAttribute("name") || el.id}`);
        });
        return out.slice(0, 15);
      });
      expect(bad).toEqual([]);
    });

    test("footer is not hidden under the dock", async ({ page }) => {
      await open(page, route);
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForTimeout(400);
      const dock = page.locator("[data-dock]:visible").first();
      if (!(await dock.isVisible())) return;
      const dockTop = (await dock.boundingBox())!.y;
      const lastBottom = await page.evaluate(() => {
        const items = [...document.querySelectorAll<HTMLElement>("footer a, footer button")].filter((e) => e.offsetParent);
        const last = items[items.length - 1];
        return last ? last.getBoundingClientRect().bottom : 0;
      });
      expect(lastBottom, "last footer link overlaps the dock").toBeLessThanOrEqual(dockTop);
    });

    test("full-page screenshot", async ({ page }, info) => {
      await open(page, route);
      await page.screenshot({
        path: `reports/mobile/screens/${info.project.name}${route.replace(/\//g, "_") || "_home"}.png`,
        fullPage: true,
        scale: "css", // long pages × DPR would exceed Chromium's 32767 px limit
      });
      // Enable once the client approves a baseline:
      // await expect(page).toHaveScreenshot({ fullPage: true });
    });
  });
}

test.describe("navigation: top bar → dock → sheet", () => {
  test.setTimeout(75_000); // V3 pages are richer; Playwright WebKit on Windows hydrates slowly under parallel load
  test.skip(({ viewport }) => (viewport?.width ?? 0) >= 1024, "phone and tablet only");

  test("dock appears after scroll, sheet traps focus and closes with Esc", async ({ page }) => {
    await open(page, "/");
    await expect(page.locator("[data-topbar]")).toBeVisible();
    await expect(page.locator('[data-dock][data-visible="true"]:visible')).toHaveCount(0);

    await page.evaluate(() => window.scrollTo(0, 400));
    await expect(page.locator('[data-dock][data-visible="true"]:visible').first()).toBeVisible({ timeout: 15_000 }); // docks mount after hydration (slow WebKit-on-Windows under load)

    await page.locator("[data-dock-more]").click();
    const sheet = page.locator("[data-menu-sheet]");
    await expect(sheet).toBeVisible();
    await expect(sheet).toHaveAttribute("role", "dialog");
    for (let i = 0; i < 30; i++) await page.keyboard.press("Tab");
    expect(await page.evaluate(() => !!document.activeElement?.closest("[data-menu-sheet]"))).toBe(true);
    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
  });

  test("language switch keeps the page", async ({ page }) => {
    await open(page, "/team/chiara-crivena/");
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.locator("[data-dock-more]").click();
    await page.getByRole("link", { name: /bergam/i }).click();
    await expect(page).toHaveURL(/\/bergamasch\/team\/chiara-crivena\/?/);
    await expect(page.locator("html")).toHaveAttribute("lang", "lmo");
  });
});
