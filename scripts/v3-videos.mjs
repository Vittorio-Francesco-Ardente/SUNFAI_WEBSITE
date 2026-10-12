#!/usr/bin/env node
/**
 * V3 QA videos (pack 16.10): a 30-second scroll of the Home and a recording of the Giorgio tour on a first visit to
 * /ardake (tour walks every marked section, says goodbye, disappears; on reload it does NOT start again; the
 * "Fammi fare un giro" pill restarts it; an InfoDot opens a single topic with no cycling).
 *   npm run build && npx serve out -l 4173   then   node scripts/v3-videos.mjs [--base http://localhost:4173]
 * Output: reports/v3/videos/*.webm + assertions printed to the console (exit 1 on failure).
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";

const args = process.argv.slice(2);
const base = args.includes("--base") ? args[args.indexOf("--base") + 1] : "http://localhost:4173";
const DIR = "reports/v3/videos";
fs.mkdirSync(DIR, { recursive: true });
const fails = [];
const check = (ok, msg) => (console.log(`${ok ? "✓" : "✗"} ${msg}`), ok || fails.push(msg));

const browser = await chromium.launch();
const rec = (name) => browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: DIR, size: { width: 1280, height: 800 } } }).then((c) => ((c.__name = name), c));
const save = async (ctx, page) => {
  const v = page.video();
  await ctx.close();
  if (v) fs.renameSync(await v.path(), `${DIR}/${ctx.__name}.webm`);
};

// 1. Home scroll, ~30 s
{
  const ctx = await rec("home-scroll");
  const page = await ctx.newPage();
  await page.goto(`${base}/?noloader=1`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const h = await page.evaluate(() => document.body.scrollHeight - innerHeight);
  const steps = 140;
  for (let i = 1; i <= steps; i++) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), (h * i) / steps);
    await page.waitForTimeout(200);
  }
  await page.waitForTimeout(1200);
  await save(ctx, page);
  console.log("video: home-scroll.webm");
}

// 2. Giorgio tour on a first visit
{
  const ctx = await rec("giorgio-tour");
  const page = await ctx.newPage();
  await page.goto(`${base}/ardake/?noloader=1`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.mouse.wheel(0, 1100);
  const dialog = page.locator('[role="dialog"][aria-labelledby="giorgio-title"]');
  await dialog.waitFor({ timeout: 8000 });
  check(true, "tour auto-starts after the hero has scrolled out");
  const total = Number((await dialog.innerText()).match(/\d+ di (\d+)/)?.[1] ?? 0);
  check(total >= 4, `tour has ${total} steps`);
  const titles = [];
  for (let i = 0; i < total; i++) {
    await page.waitForTimeout(2200);
    titles.push(await page.locator("#giorgio-title").innerText());
    await dialog.getByRole("button", { name: i + 1 === total ? /Ho finito/ : /Avanti/ }).click();
  }
  check(new Set(titles).size === total, `each step explains a different topic: ${titles.join(" → ")}`);
  await page.waitForTimeout(800);
  check((await page.locator("#giorgio-title").innerText()) === "Ora sai tutto!", "outro: “Ora sai tutto!”");
  await page.waitForTimeout(4000);
  check((await dialog.count()) === 0, "Giorgio disappears after the outro");

  await page.reload({ waitUntil: "networkidle" });
  await page.mouse.wheel(0, 1400);
  await page.waitForTimeout(3000);
  check((await dialog.count()) === 0, "after reload the tour does not start again");

  await page.locator('button[aria-label^="Chiedi a Giorgio"]').first().click();
  await page.waitForTimeout(1200);
  const single = await dialog.innerText();
  check(!/Avanti|Indietro|\d+ di \d+/.test(single), "InfoDot opens a single topic, no cycling");
  await dialog.getByRole("button", { name: /Ho capito/ }).click();

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  await page.getByRole("button", { name: /Fammi fare un giro/ }).click();
  await page.waitForTimeout(1500);
  check(/1 di \d+/.test(await dialog.innerText()), "“Fammi fare un giro” restarts the tour from step 1");
  await page.waitForTimeout(1500);
  await save(ctx, page);
  console.log("video: giorgio-tour.webm");
}

await browser.close();
if (fails.length) {
  console.error(`\n${fails.length} check(s) failed`);
  process.exit(1);
}
