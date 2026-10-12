#!/usr/bin/env node
/**
 * After `next build` (static export → out/):
 *  - out/.nojekyll (GitHub Pages must serve the _next folder);
 *  - out/CNAME when PAGES_CNAME is set (custom domain www.sun-fai.org);
 *  - QA guard: no CSS gradient anywhere except functional masks (QA checklist A) → fails the build;
 *  - removes the dev-only pages from the export unless SF_DEV_PAGES=1.
 */
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "out");
if (!fs.existsSync(OUT)) {
  console.error("[postbuild] out/ not found — did `next build` run with output: 'export'?");
  process.exit(1);
}
fs.writeFileSync(path.join(OUT, ".nojekyll"), "");
if (process.env.PAGES_CNAME) fs.writeFileSync(path.join(OUT, "CNAME"), `${process.env.PAGES_CNAME}\n`);

if (process.env.SF_DEV_PAGES !== "1") {
  for (const p of ["dev", "bergamasch/dev"]) fs.rmSync(path.join(OUT, p), { recursive: true, force: true });
}

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const css = walk(OUT).filter((f) => f.endsWith(".css") && !f.includes("maplibre"));
const offenders = [];
for (const f of css) {
  const s = fs.readFileSync(f, "utf8");
  for (const m of s.matchAll(/[^;{}]*gradient\([^;{}]*/g)) {
    if (/mask|reflect/.test(m[0])) continue; // functional masks are allowed
    offenders.push(`${path.relative(OUT, f)}: ${m[0].trim().slice(0, 120)}`);
  }
}
if (offenders.length) {
  console.error("[postbuild] gradients found in CSS (not allowed, pack 01.1 §6):\n - " + offenders.join("\n - "));
  process.exit(1);
}
console.log(`[postbuild] ok — .nojekyll written, ${css.length} CSS files without gradients`);
