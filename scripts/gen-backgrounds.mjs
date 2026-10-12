#!/usr/bin/env node
/**
 * V3 background kit (pack 16.1 "Make your own assets"). Regenerates src/assets/generated/*.svg + manifest.json from the
 * pack's generator (prompt-packs/16_FIX_VISUAL_OVERHAUL/code/ripples.mjs): every layout × desktop/tall/mobile × 2
 * seeds, plus one seeded background per page panel (seed = hash(pageSlug + panelIndex)). Never hand-edit the output.
 *
 * The site itself renders the same vocabulary INLINE (src/lib/ripples.ts + components/canvas) so every panel's rings
 * are computed for its real size; this kit is for design work, the style lab and anyone composing new sections.
 *   node scripts/gen-backgrounds.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const gen = await import(pathToFileURL(path.resolve("prompt-packs/16_FIX_VISUAL_OVERHAUL/code/ripples.mjs")).href);
const OUT = path.resolve("src/assets/generated");
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const hash = (s) => [...s].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 7) >>> 0;
const sizes = { desktop: [1600, 900], tall: [1600, 1300], mobile: [390, 760] };
const manifest = [];

for (const layout of Object.keys(gen.LAYOUTS)) {
  for (const [sz, [w, h]] of Object.entries(sizes)) {
    for (const seed of [1, 2]) {
      const id = `ripple-${layout}-${sz}-${seed}`;
      const unit = sz === "mobile" ? w * 1.9 : undefined;
      fs.writeFileSync(path.join(OUT, `${id}.svg`), gen.canvasSVG({ w, h, layout, seed, unit }));
      manifest.push({ id, panel: null, layout, seed, family: "seeded", size: sz });
    }
  }
}

// one background per page panel, deterministic (the order and tones mirror the views)
const PAGES = {
  home: ["hero:paper", "numbers:solar", "per-chi:mint", "about:cream", "tre-passaggi:mint", "ardake:mint", "verifica:peach", "map:mint", "team:paper", "riconoscimenti:cream", "press:paper", "social:mint", "faq:cream", "eventi:paper", "join:peach", "contact:mint"],
  "chi-siamo": ["hero:mint", "in-breve:paper", "storia:cream", "principi:mint", "perche:paper", "territorio:cream", "team:mint", "premio:paper"],
  "cosa-facciamo": ["hero:cream", "sito:paper", "servizi:mint", "comuni:peach", "produttori-dati:paper", "percorso:cream", "oltre:mint"],
  "le-cer": ["hero:paper", "in-sunfai:mint", "cosa-sono:cream", "come:paper", "explainer:mint", "chi:cream", "non-cambia:peach", "norme:paper", "faq:mint"],
  ardake: ["hero:paper", "cosa-fa:mint", "come-funziona:paper", "seleziona:cream", "demo:paper", "fatta-in-casa:peach"],
};
const layouts = Object.keys(gen.LAYOUTS);
const tones = gen.PANEL_TONES;
for (const [page, panels] of Object.entries(PAGES)) {
  panels.forEach((p, i) => {
    const [panel, tone] = p.split(":");
    const seed = hash(page + i);
    const layout = layouts[seed % layouts.length];
    const id = `panel-${page}-${String(i).padStart(2, "0")}-${panel}`;
    fs.writeFileSync(path.join(OUT, `${id}.svg`), gen.canvasSVG({ w: 1408, h: 860, layout, seed, bg: tones[tone] }));
    manifest.push({ id, panel: `${page}/${panel}`, layout, seed, family: tone });
  });
}

fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 1) + "\n");
console.log(`[backgrounds] ${manifest.length} SVGs + manifest.json → ${path.relative(process.cwd(), OUT)}`);
