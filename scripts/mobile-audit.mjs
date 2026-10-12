#!/usr/bin/env node
/**
 * Fast mobile audit (same checks as tests/mobile/mobile-layout.spec.ts) with Chromium only, for quick iteration.
 * Usage: npm run build && npx serve out -l 4173 & node scripts/mobile-audit.mjs [width]
 */
import { chromium } from "@playwright/test";

const W = Number(process.argv[2] ?? 320);
const base = "http://localhost:4173";
const team = ["francesco-crivena", "benedetta-petro", "giorgio-venezia"];
const routes = ["/", "/chi-siamo/", "/cosa-facciamo/", "/team/", "/le-cer/", "/riconoscimenti/", "/notizie/", "/notizie/ciserano-supera-esame-corte-dei-conti/", "/ardake/", "/ardake/demo/", "/ardake/monitoraggio/", "/diventa-socio/", "/diventa-socio/compilazione/", "/contatti/", "/note-legali/", ...team.map((s) => `/team/${s}/`)];
const all = routes.flatMap((r) => [r, r === "/" ? "/bergamasch/" : `/bergamasch${r}`]);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: W, height: 640 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
let problems = 0;
for (const r of all) {
  const page = await ctx.newPage();
  await page.goto(`${base}${r}?test`, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  const res = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const out = { overflow: document.documentElement.scrollWidth - vw, outside: [], small: [], text: [] };
    const inScroller = (el) => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const ox = getComputedStyle(p).overflowX;
        if (ox === "auto" || ox === "scroll") return true;
      }
      return false;
    };
    document.querySelectorAll("body *").forEach((el) => {
      if (el.closest("[data-bleed], [data-carousel], [aria-hidden='true'], svg") || inScroller(el)) return;
      const b = el.getBoundingClientRect();
      if (b.width && (b.right > vw + 1 || b.left < -1)) out.outside.push(`${el.tagName.toLowerCase()}.${(el.getAttribute("class") || "").split(" ").slice(0, 3).join(".")} [${Math.round(b.left)}→${Math.round(b.right)}]`);
    });
    document.querySelectorAll('a[href], button, [role="button"], input:not([type="hidden"]), select, textarea, summary, [tabindex="0"]').forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none" || el.closest("[aria-hidden='true'], [inert]")) return;
      const b = el.getBoundingClientRect();
      if (!b.width || !b.height) return;
      if (el.tagName === "A" && cs.display === "inline" && el.closest("p, li")) return;
      const min = el.closest("[data-dock]") ? 48 : 44;
      if (!(el.hasAttribute("data-hit-area") || el.closest("[data-hit-area]")) && (b.width < min - 0.5 || b.height < min - 0.5))
        out.small.push(`${el.tagName.toLowerCase()} "${(el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 28)}" ${Math.round(b.width)}×${Math.round(b.height)}`);
    });
    const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = tw.nextNode(); n; n = tw.nextNode()) {
      const el = n.parentElement;
      const t = n.textContent?.trim();
      if (!el || !t || !el.getClientRects().length || el.closest("svg, [aria-hidden='true'], .sr-only")) continue;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs < 13) out.text.push(`${fs}px "${t.slice(0, 28)}"`);
    }
    document.querySelectorAll("input, select, textarea").forEach((el) => {
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs < 16) out.text.push(`field ${fs}px ${el.getAttribute("name") || el.id}`);
    });
    return out;
  });
  const bad = res.overflow > 1 || res.outside.length || res.small.length || res.text.length;
  if (bad) {
    problems++;
    console.log(`\n✗ ${r}  overflow=${res.overflow}`);
    for (const [k, v] of Object.entries({ outside: res.outside, tap: res.small, text: res.text })) if (v.length) console.log(`  ${k}: ${[...new Set(v)].slice(0, 8).join(" | ")}`);
  }
  await page.close();
}
await browser.close();
console.log(problems ? `\n${problems} routes with problems at ${W}px` : `\nall ${all.length} routes clean at ${W}px`);
