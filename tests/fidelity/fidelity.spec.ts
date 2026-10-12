import { test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

/** Concept ↔ build pairs (05_CONCEPT_FIDELITY_SPEC_V2). Screenshots use ?test (no loader, final frames). */
const CONCEPTS = path.join(process.cwd(), "prompt-packs/00_START_HERE_MASTER_BRIEF_V2/references/concepts");
const OUT = path.join(process.cwd(), "reports/fidelity");

const cases = [
  { name: "home-hero", url: "/", concept: "CONCEPT_5.png", w: 1672, h: 941 },
  { name: "team", url: "/team/", concept: "CONCEPT_3.jpg", w: 1600, h: 763, scrollTo: '[data-section="hero"]' },
  { name: "member-profile", url: "/team/alceste-persico/", concept: "CONCEPT_3.jpg", w: 1600, h: 763 },
  { name: "member-initials", url: "/team/benedetta-petro/", concept: "CONCEPT_4.jpg", w: 1600, h: 763 },
  { name: "ardake-hero", url: "/ardake/", concept: "CONCEPT_1.jpg", w: 1672, h: 941 },
];

for (const c of cases) {
  test(`fidelity · ${c.name}`, async ({ page }) => {
    fs.mkdirSync(OUT, { recursive: true });
    await page.setViewportSize({ width: c.w, height: c.h });
    await page.goto(`${c.url}?test`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    const shot = await page.screenshot();
    const concept = await sharp(path.join(CONCEPTS, c.concept)).resize(c.w, c.h, { fit: "cover" }).png().toBuffer();
    const gap = 24;
    await sharp({ create: { width: c.w * 2 + gap, height: c.h, channels: 3, background: "#ffffff" } })
      .composite([
        { input: concept, left: 0, top: 0 },
        { input: shot, left: c.w + gap, top: 0 },
      ])
      .png()
      .toFile(path.join(OUT, `${c.name}.png`));
  });
}
