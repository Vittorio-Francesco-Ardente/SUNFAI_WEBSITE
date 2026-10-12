#!/usr/bin/env node
/**
 * V3 comparison pages (pack 16.0 style-lab gate, 16.8 feedback pairs, 16.10 QA loop).
 *   npm run dev   (or a build served with SF_DEV_PAGES=1)   then:   node scripts/v3-compare.mjs [--base http://localhost:3000]
 * Writes reports/v3/style-lab-compare.html, concepts-compare.html and feedback-pairs.html: each block = the new build
 * (left) next to the mockup / concept / annotated V2 screenshot (right). Screenshots: reports/v3/compare/*.jpg.
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const base = args.includes("--base") ? args[args.indexOf("--base") + 1] : "http://localhost:3000";
const only = args.includes("--only") ? args[args.indexOf("--only") + 1].split(",") : null;
const PACK = "prompt-packs/16_FIX_VISUAL_OVERHAUL/references";
const OUT = "reports/v3";
const SHOTS = path.join(OUT, "compare");
fs.mkdirSync(SHOTS, { recursive: true });
const ref = (p) => path.relative(OUT, path.join(PACK, p)).replace(/\\/g, "/");

/** [id, route, selector | null (viewport), width, height, reference, note, action?] */
const LAB = [
  ["lab-01", "/dev/style-lab/", "#lab-01 [data-section=hero]", 1440, 900, "mockups/01_home_hero_canvas.webp", "01 · Home hero"],
  ["lab-06", "/dev/style-lab/", "#lab-01 [data-section=hero]", 390, 844, "mockups/06_mobile_home_hero.webp", "06 · Home hero, phone"],
  ["lab-09", "/dev/style-lab/", "#lab-09 [data-section=per-chi]", 1440, 900, "mockups/09_per_chi_e_cards_as_canvases.webp", "09 · Per chi è"],
  ["lab-02", "/dev/style-lab/", "#lab-02 [data-section=numbers]", 1440, 900, "mockups/02_numbers_with_mascot.webp", "02 · Numbers + mascot"],
  ["lab-03", "/dev/style-lab/", "#lab-03 [data-section=hero]", 1440, 900, "mockups/03_member_profile_v3.webp", "03 · Member profile"],
  ["lab-04", "/dev/style-lab/", "#lab-04 [data-section=hero]", 1440, 820, "mockups/04_ardake_hero_v3.webp", "04 · Ardaké hero"],
  ["lab-05", "/dev/style-lab/", "#lab-05 footer", 1440, 900, "mockups/05_footer_v3.webp", "05 · Footer"],
];
const CONCEPTS = [
  ["c-home", "/", "[data-section=hero]", 1440, 900, "concepts/CONCEPT_5.png", "Home hero ↔ CONCEPT_5"],
  ["c-team", "/team/", "[data-section=hero]", 1440, 900, "concepts/CONCEPT_3.jpg", "Team ↔ CONCEPT_3"],
  ["c-profile", "/team/chiara-crivena/", "[data-section=hero]", 1440, 900, "concepts/CONCEPT_PROFILE_V3.webp", "Profile ↔ CONCEPT_PROFILE_V3"],
  ["c-ardake", "/ardake/?test", "[data-section=hero]", 1440, 820, "concepts/CONCEPT_1.jpg", "Ardaké hero ↔ CONCEPT_1"],
  ["c-memory", "/riconoscimenti/", "#stanza-dei-ricordi", 1280, 900, "mockups/07_memory_room_prototype.webp", "Memory room ↔ mockup 07"],
  ["c-memory-m", "/riconoscimenti/", "#stanza-dei-ricordi", 390, 844, "mockups/08_memory_room_mobile.webp", "Memory room, phone ↔ mockup 08"],
];
const FEEDBACK = [
  ["f01", "/", "footer", 1440, 900, "feedback-v2/01_footer_disorganised_giorgio_cut.webp", "Footer: one leafDeep panel, strict grid, mascot, no person"],
  ["f02", "/contatti/", "[data-section=hero]", 1440, 900, "feedback-v2/02_contatti_person_floating_empty_space.webp", "Contatti: piazza photo + Simone on the panel edge, no dashed ring"],
  ["f03", "/", "[data-section=numbers]", 1440, 900, "feedback-v2/03_numbers_rect_crop_broken_shapes.webp", "Numbers: solar panel, cheering mascot, no rectangle photo"],
  ["f04", "/notizie/", "[data-section=hero]", 1440, 900, "feedback-v2/04_notizie_hero_same_template.webp", "Notizie: peach canvas, Nicholas large on the left"],
  ["f05", "/", "[data-section=join-contact]", 1440, 900, "feedback-v2/05_diventa_socio_empty_panel.webp", "Join + contact: two equal panels, people fill the corners"],
  ["f06", "/ardake/?test", "[data-section=hero]", 1440, 820, "feedback-v2/06_ardake_hero_terrible.webp", "Ardaké hero rebuilt (CONCEPT_1)"],
  ["f07", "/ardake/?test", null, 1440, 900, "feedback-v2/07_giorgio_stage_flat_cut.webp", "Giorgio: complete ground pill under him", "giorgio"],
  ["f08", "/ardake/monitoraggio/?test", null, 1440, 900, "feedback-v2/08_ardake_cards_infodot_giorgio_no_stage.webp", "Monitor: InfoDots inline, no floating Giorgio"],
  ["f09", "/", "[data-section=ardake]", 1440, 900, "feedback-v2/09_precisione_micro_text_wrong.webp", "Precisione: no micro text"],
  ["f10", "/riconoscimenti/", "[data-section=hero]", 1440, 900, "feedback-v2/10_riconoscimenti_hero_same_template.webp", "Riconoscimenti: cream canvas, corner sun, Andrea Zonca"],
  ["f11", "/chi-siamo/", "[data-section=hero]", 1440, 900, "feedback-v2/11_chi_siamo_disc_sparks_hills_monotone.webp", "Chi siamo: mint canvas, leaf fan, Francesco; no disc/sparks/hills"],
  ["f12", "/", "[data-section=tre-passaggi]", 1440, 900, "feedback-v2/12_double_hills_monotone.webp", "Tre passaggi: no hills strips, paper gap between panels"],
  ["f13", "/ardake/?test", "[data-section=hero]", 1440, 820, "feedback-v2/13_phone_screen_no_logo_mark.webp", "Phone shows the app UI, no SUN-FAI mark"],
  ["f14", "/cosa-facciamo/", "[data-section=hero]", 1440, 900, "feedback-v2/14_cosa_facciamo_person_over_card_chip.webp", "Cosa facciamo: Stefano on a peach ripple, no card, no chip"],
  ["f15", "/bergamasch/ardake/?test", "[data-section=hero]", 1440, 820, "feedback-v2/15_ardake_hero_bergamasch_chip_in_hero.webp", "No Bergamasque chip in the hero"],
  ["f16", "/", "[data-section=hero]", 390, 844, "feedback-v2/16_mobile_hero_link_underline.webp", "Phone hero: text-decoration underline"],
  ["f17", "/", "[data-section=ardake]", 1440, 900, "feedback-v2/17_ardake_features_deco_over_button_flat_cut.webp", "Features + phone: nothing over the buttons"],
  ["f18", "/", "[data-section=about]", 1440, 900, "feedback-v2/18_person_rect_crop_shapes_cut.webp", "People stand on the panel edge, no rectangle crops"],
  ["f19", "/riconoscimenti/", "#stanza-dei-ricordi", 1280, 900, "feedback-v2/19_memory_room_broken.webp", "Memory room: rigid cards, clean reflection"],
];

const browser = await chromium.launch();
async function shoot([id, route, sel, w, h, , , action]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 768, hasTouch: w < 768 });
  const page = await ctx.newPage();
  await page.goto(`${base}${route}${route.includes("?") ? "&" : "?"}noloader=1`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: "nextjs-portal{display:none!important}" + (sel ? "[data-topbar],[data-dock],.skip-link{visibility:hidden!important}" : "") });
  if (action === "giorgio") {
    await page.locator("button[aria-label^=\"Chiedi a Giorgio\"]").first().click();
    await page.waitForTimeout(1200);
  }
  if (sel) {
    const el = page.locator(sel).first();
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1700);
    await el.screenshot({ path: path.join(SHOTS, `${id}.jpg`), type: "jpeg", quality: 72 });
  } else {
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(SHOTS, `${id}.jpg`), type: "jpeg", quality: 72 });
  }
  await ctx.close();
  console.log("shot", id);
}

const page = (title, intro, rows) => `<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<style>body{margin:0;background:#FAF7F0;font:15px/1.5 Inter,system-ui,sans-serif;color:#052A22}main{max-width:1800px;margin:0 auto;padding:32px 20px}h1{font:800 34px/1.1 "Plus Jakarta Sans",system-ui;letter-spacing:-.03em}
.row{margin:28px 0;padding:18px;background:#fff;border-radius:20px;box-shadow:0 0 0 1px #0001}.row h2{font:700 18px system-ui;margin:0 0 12px}.pair{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}
.pair figure{margin:0}.pair img{width:100%;height:auto;border-radius:12px;box-shadow:0 0 0 1px #0002}.pair figcaption{font-size:13px;color:#4C5F66;margin-top:6px}@media(max-width:800px){.pair{grid-template-columns:1fr}}</style></head>
<body><main><h1>${title}</h1><p>${intro}</p>${rows
  .map(
    ([id, route, , w, h, r, note]) =>
      `<section class="row"><h2>${note}</h2><div class="pair"><figure><img loading="lazy" src="compare/${id}.jpg" alt=""><figcaption>Build V3 · ${route} · ${w}×${h}</figcaption></figure><figure><img loading="lazy" src="${ref(r)}" alt=""><figcaption>Reference · ${r}</figcaption></figure></div></section>`,
  )
  .join("")}</main></body></html>`;

for (const r of [...LAB, ...CONCEPTS, ...FEEDBACK]) {
  if (only && !only.includes(r[0])) continue;
  try {
    await shoot(r);
  } catch (e) {
    console.error("FAILED", r[0], e.message.split("\n")[0]);
  }
}
await browser.close();
fs.writeFileSync(path.join(OUT, "style-lab-compare.html"), page("Style lab ↔ mockups", "Pack 16.0 gate: each mockup rebuilt with the real components (/dev/style-lab).", LAB));
fs.writeFileSync(path.join(OUT, "concepts-compare.html"), page("Pages ↔ concepts", "Home, Team, profile, Ardaké and the memory room next to the concepts/mockups (16.10).", CONCEPTS));
fs.writeFileSync(path.join(OUT, "feedback-pairs.html"), page("Feedback V2 → V3", "Each annotated V2 screenshot (right) next to the same view in V3 (left) — pack 16.8.", FEEDBACK));
console.log("written: reports/v3/style-lab-compare.html, concepts-compare.html, feedback-pairs.html");
