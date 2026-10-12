#!/usr/bin/env -S npx tsx
/**
 * Exports every dictionary string for the native Bergamasque reviewer (pack 14.2):
 *   review/bergamasco-review.csv  →  key;italiano;bergamasch;reviewed;note
 * Also (re)writes src/content/lmo/review.json, keeping existing review flags and notes, adding new keys as
 * reviewed:false. Strings identical to the Italian get a note so the reviewer decides "translate or keep".
 * Usage: npm run lmo:export
 */
import fs from "node:fs";
import path from "node:path";
import { it } from "../src/content/it/index.ts";
import { lmo } from "../src/content/lmo/index.ts";
import { flatten } from "../src/lib/flatten.ts";

type Review = Record<string, { reviewed: boolean; note?: string }>;
const ROOT = process.cwd();
const reviewPath = path.join(ROOT, "src/content/lmo/review.json");
const prev: Review = fs.existsSync(reviewPath) ? JSON.parse(fs.readFileSync(reviewPath, "utf8")) : {};

const I = flatten(it);
const L = flatten(lmo);
const KEEP = /^(CER|GSE|POD|kWh|kWp|ATECO|SUN-FAI|Ardaké|\d|[A-Z]{2}\d)/;
const review: Review = {};
for (const k of Object.keys(I)) {
  const old = prev[k];
  let note = old?.note ?? "";
  if (!note && L[k] === I[k] && I[k] && !KEEP.test(I[k])) note = "uguale all'italiano: tradurre o lasciare in italiano (citazione ufficiale / documento legale)?";
  review[k] = { reviewed: old?.reviewed ?? false, ...(note ? { note } : {}) };
}
fs.writeFileSync(reviewPath, JSON.stringify(review, null, 1) + "\n");

const esc = (s: string) => `"${String(s ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
const rows = ["key;italiano;bergamasch;reviewed;note", ...Object.keys(I).map((k) => [k, I[k], L[k], review[k].reviewed ? "1" : "0", review[k].note ?? ""].map(esc).join(";"))];
fs.mkdirSync(path.join(ROOT, "review"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "review/bergamasco-review.csv"), "﻿" + rows.join("\r\n") + "\r\n");
const todo = Object.values(review).filter((r) => !r.reviewed).length;
console.log(`[lmo] ${rows.length - 1} strings exported → review/bergamasco-review.csv (${todo} still to review)`);
