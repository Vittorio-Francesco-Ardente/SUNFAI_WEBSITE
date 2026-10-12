#!/usr/bin/env node
/**
 * Link checker for the static export (pack 12 acceptance): every internal href/src in out/**.html must resolve
 * to a file in out/ (folder/index.html with trailingSlash). Works with and without NEXT_PUBLIC_BASE_PATH.
 * Usage: npm run build && npm run check:links
 */
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "out");
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const html = walk(OUT).filter((f) => f.endsWith(".html"));
const missing = new Map();

const exists = (url) => {
  let p = url.split("#")[0].split("?")[0];
  if (!p) return true;
  if (BASE && p.startsWith(BASE)) p = p.slice(BASE.length) || "/";
  else if (BASE) return false; // an internal URL without the base path would 404 on GitHub Pages
  p = decodeURIComponent(p);
  const f = path.join(OUT, p);
  return fs.existsSync(f) && fs.statSync(f).isFile() ? true : fs.existsSync(path.join(f, "index.html")) || fs.existsSync(`${f}.html`);
};

for (const file of html) {
  const s = fs.readFileSync(file, "utf8");
  for (const m of s.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const url = m[1].replace(/&amp;/g, "&");
    if (!url.startsWith("/") || url.startsWith("//")) continue;
    if (!exists(url)) {
      const k = url.split("#")[0];
      missing.set(k, [...(missing.get(k) ?? []), path.relative(OUT, file)]);
    }
  }
  for (const m of s.matchAll(/srcSet="([^"]+)"/gi)) {
    for (const part of m[1].split(",")) {
      const url = part.trim().split(" ")[0];
      if (url.startsWith("/") && !exists(url)) missing.set(url, [...(missing.get(url) ?? []), path.relative(OUT, file)]);
    }
  }
}

if (missing.size) {
  console.error(`[links] ${missing.size} broken internal URLs:`);
  for (const [u, where] of [...missing].slice(0, 60)) console.error(` - ${u}  (in ${[...new Set(where)].slice(0, 3).join(", ")}${where.length > 3 ? "…" : ""})`);
  process.exit(1);
}
console.log(`[links] ok — ${html.length} HTML files, no broken internal links${BASE ? ` (basePath ${BASE})` : ""}`);
