#!/usr/bin/env node
/**
 * Static-export image pipeline (pack 12 / 15.1 §6), replacing next/image optimisation.
 *
 * 1. Reads every raster in public/{people,mascot,scenes,landscapes,moduli/previews,memories,news,social,brand,ardake}.
 * 2. Writes WebP variants to public/img/<path>-<w>.webp for the export widths (never upscaled).
 * 3. Writes src/content/media.generated.json: { "/people/x.webp": { w, h, widths: [...] } } so <Img> can
 *    render width/height (no CLS) and a correct srcset.
 *
 * Variants are skipped when they already exist and are newer than the source (fast rebuilds).
 * Usage: node scripts/optimize-images.mjs [--manifest-only]
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const OUT = path.join(PUBLIC, "img");
const MANIFEST = path.join(ROOT, "src", "content", "media.generated.json");
const DIRS = ["people", "mascot", "scenes", "landscapes", "moduli/previews", "memories", "news", "events", "social", "brand", "ardake"];
const WIDTHS = [360, 414, 640, 828, 1080, 1280, 1600, 1920];
const QUALITY = 82;
const manifestOnly = process.argv.includes("--manifest-only");

const walk = (dir) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
        const p = path.join(dir, d.name);
        return d.isDirectory() ? walk(p) : /\.(webp|png|jpe?g)$/i.test(d.name) ? [p] : [];
      })
    : [];

const files = DIRS.flatMap((d) => walk(path.join(PUBLIC, d)));
const manifest = {};
let written = 0;

for (const file of files) {
  const rel = "/" + path.relative(PUBLIC, file).split(path.sep).join("/");
  const meta = await sharp(file).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  const widths = [...WIDTHS.filter((x) => x < w), w].filter((x, i, a) => a.indexOf(x) === i);
  manifest[rel] = { w, h, widths };
  if (manifestOnly) continue;
  const base = path.join(OUT, rel.replace(/\.[a-z]+$/i, ""));
  fs.mkdirSync(path.dirname(base), { recursive: true });
  const srcTime = fs.statSync(file).mtimeMs;
  for (const width of widths) {
    const target = `${base}-${width}.webp`;
    if (fs.existsSync(target) && fs.statSync(target).mtimeMs >= srcTime) continue;
    await sharp(file)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY, alphaQuality: 90, effort: 5, smartSubsample: true })
      .toFile(target);
    written++;
  }
}

fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(MANIFEST, JSON.stringify(sorted, null, 0) + "\n");
console.log(`[images] ${files.length} sources, ${written} variants written, manifest → ${path.relative(ROOT, MANIFEST)}`);
