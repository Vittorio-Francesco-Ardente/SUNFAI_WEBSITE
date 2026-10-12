#!/usr/bin/env node
/**
 * V3 screenshot loop helper (pack 16.10). Shoots pages with Chromium into reports/v3/shots/.
 *   node scripts/shoot.mjs [--base http://localhost:3000] [--full] [--w 1440 --h 900] /path/ [/path/ …]
 *   node scripts/shoot.mjs --sel "[data-section=hero]" /     → element screenshot
 * `?test` disables autoplay/loader; reduced motion OFF so entrances complete (we wait for them).
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const args = process.argv.slice(2);
const opt = (k, d) => {
  const i = args.indexOf(k);
  if (i < 0) return d;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const flag = (k) => {
  const i = args.indexOf(k);
  if (i < 0) return false;
  args.splice(i, 1);
  return true;
};
const base = opt("--base", "http://localhost:3000");
const W = Number(opt("--w", 1440));
const H = Number(opt("--h", 900));
const sel = opt("--sel", null);
const scrollTo = opt("--scroll", null);
const tag = opt("--tag", "");
const full = flag("--full");
const out = "reports/v3/shots";
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, isMobile: W < 768, hasTouch: W < 768 });
for (const route of args.length ? args : ["/"]) {
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`${base}${route}${route.includes("?") ? "&" : "?"}noloader=1`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  if (full || sel || scrollTo) {
    // walk the page so every panel gets its one-shot entrance
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 160));
      }
      window.scrollTo(0, 0);
    });
  }
  if (scrollTo) await page.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: "start" }), scrollTo);
  await page.waitForTimeout(1300);
  const name = `${out}/${(route.replace(/[/?=&]+/g, "_").replace(/^_|_$/g, "") || "home")}${sel ? "--" + sel.replace(/[^a-z0-9]+/gi, "-") : ""}${tag ? "--" + tag : ""}-${W}.png`;
  if (sel) {
    await page.addStyleTag({ content: "[data-topbar],[data-dock],.skip-link,nextjs-portal{visibility:hidden!important}" });
    await page.locator(sel).first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(1600); // let the panel's one-shot entrance + headline reveal finish
    await page.locator(sel).first().screenshot({ path: name });
  }
  else await page.screenshot({ path: name, fullPage: full });
  console.log(name, errors.length ? `ERRORS: ${errors.join(" | ").slice(0, 300)}` : "");
  await page.close();
}
await browser.close();
