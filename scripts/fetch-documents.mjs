#!/usr/bin/env node
/**
 * Self-hosts the official documents and the 2024 award image (SITE_CONTENT §0 "Download both and self-host them",
 * §6.1 "download and self-host"). Run once: `npm run docs:fetch`, then set `site.documents.selfHosted = true`
 * in src/lib/site.ts and point the award article image to /news/elettra-miglior-cer.png in src/content/news.ts.
 */
import fs from "node:fs";
import path from "node:path";

const files = [
  ["https://www.sun-fai.org/assets/Sito_Statuto%20e%20Atto%20Costitutivo%20Sun-Fai_2024.pdf", "public/documenti/Statuto-e-Atto-Costitutivo-SUN-FAI-2024.pdf"],
  ["https://www.sun-fai.org/assets/Sito_REGOLAMENTO%20INTERNO%20CER%20rev_6%2010mar2025.pdf", "public/documenti/Regolamento-interno-CER-rev6-2025-03-10.pdf"],
  ["https://www.sun-fai.org/uploads/1771163637269_elettra-miglior-cer.png", "public/news/elettra-miglior-cer.png"],
];

for (const [url, out] of files) {
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`[docs] ${res.status} ${url}`);
    process.exitCode = 1;
    continue;
  }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  console.log(`[docs] ${out} (${Math.round(fs.statSync(out).size / 1024)} KB)`);
}
