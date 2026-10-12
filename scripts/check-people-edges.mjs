#!/usr/bin/env node
/** QA (16.2): which people cut-outs are cropped flat on their own left/right edge (opaque pixels on the side columns). Such an edge must sit on a panel/card edge, never in mid-air. */
import sharp from "sharp";
import { readdirSync } from "node:fs";
const root = process.argv[2] ?? "public";
const files = [...readdirSync(root + "/people").filter(f=>f.endsWith(".webp")).map(f=>"people/"+f), ...readdirSync(root + "/people/poses").map(f=>"people/poses/"+f)];
for (const f of files) {
  const { data, info } = await sharp(root + "/" + f).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const col = (x) => { let n = 0; let top = -1; for (let y = 0; y < h; y++) if (data[(y * w + x) * c + 3] > 128) { n++; if (top<0) top=y; } return [n / h, top/h]; };
  const [l, lt] = col(1), [r, rt] = col(w - 2);
  console.log(f.padEnd(52), "left", (l*100).toFixed(0).padStart(3)+"% from y", lt.toFixed(2), " right", (r*100).toFixed(0).padStart(3)+"% from y", rt.toFixed(2));
}
