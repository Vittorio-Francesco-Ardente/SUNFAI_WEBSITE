#!/usr/bin/env -S npx tsx
/**
 * Imports the reviewed CSV (review/bergamasco-review.csv, same columns as the export):
 *  - updates src/content/lmo/review.json (reviewed flags + notes);
 *  - writes the corrected Bergamasque strings to review/lmo-overrides.json and prints the keys that changed,
 *    so a developer can apply them to src/content/lmo/*.ts (strings live in typed TS modules, reviewed in git).
 * Usage: npm run lmo:import [path/to/file.csv]
 */
import fs from "node:fs";
import path from "node:path";
import { lmo } from "../src/content/lmo/index.ts";
import { flatten } from "../src/lib/flatten.ts";

const ROOT = process.cwd();
const file = process.argv[2] ?? path.join(ROOT, "review/bergamasco-review.csv");
const text = fs.readFileSync(file, "utf8").replace(/^﻿/, "");

/** Minimal CSV parser for ';'-separated, '"'-quoted fields. */
function parse(src: string) {
  const out: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (q) {
      if (c === '"' && src[i + 1] === '"') (cur += '"'), i++;
      else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === ";") row.push(cur), (cur = "");
    else if (c === "\n") row.push(cur.replace(/\r$/, "")), out.push(row), (row = []), (cur = "");
    else cur += c;
  }
  if (cur || row.length) row.push(cur), out.push(row);
  return out;
}

const [header, ...rows] = parse(text);
const idx = (n: string) => header.indexOf(n);
const L = flatten(lmo);
const reviewPath = path.join(ROOT, "src/content/lmo/review.json");
const review = JSON.parse(fs.readFileSync(reviewPath, "utf8")) as Record<string, { reviewed: boolean; note?: string }>;
const overrides: Record<string, string> = {};
for (const r of rows) {
  const key = r[idx("key")];
  if (!key || !(key in review)) continue;
  const value = r[idx("bergamasch")];
  review[key] = { reviewed: r[idx("reviewed")] === "1", ...(r[idx("note")] ? { note: r[idx("note")] } : {}) };
  if (value !== undefined && value !== L[key]) overrides[key] = value;
}
fs.writeFileSync(reviewPath, JSON.stringify(review, null, 1) + "\n");
fs.writeFileSync(path.join(ROOT, "review/lmo-overrides.json"), JSON.stringify(overrides, null, 2) + "\n");
console.log(`[lmo] review flags updated; ${Object.keys(overrides).length} corrected strings → review/lmo-overrides.json`);
for (const [k, v] of Object.entries(overrides).slice(0, 40)) console.log(`  ${k}: ${v}`);
