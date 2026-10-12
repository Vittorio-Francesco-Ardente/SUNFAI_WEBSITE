#!/usr/bin/env node
/**
 * Mascot rule check, V3 (pack 16.3 replaces 10.2) — fails the build when:
 *  - a page shows more than 3 mascots (the footer's waving mascot counts on every page),
 *  - the mascot replaces a person where people are required (Home hero, member profile, Giorgio's guide, team cards),
 *  - an unknown pose is used,
 *  - V1/demo leftovers are present (old mascot, demo photos, handwritten notes).
 */
import fs from "node:fs";
import path from "node:path";

const SRC = path.join(process.cwd(), "src");
const read = (p) => fs.readFileSync(p, "utf8");
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const files = walk(SRC).filter((f) => /\.(tsx?|mjs)$/.test(f));
const errors = [];
const MASCOT = /<(Mascot|PanelMascot)|mascot=\{\{/g;
const count = (s) => (s.match(MASCOT) ?? []).length;

// 1. per-page count: direct + components that render one + the footer (always 1)
const comps = files
  .filter((f) => !f.includes(`${path.sep}views${path.sep}`) && !/(Canvas|PageHero|Footer)\.tsx$/.test(f) && count(read(f)))
  .map((f) => [path.basename(f, ".tsx"), count(read(f))]);
for (const v of files.filter((f) => f.includes(`${path.sep}views${path.sep}`))) {
  const s = read(v);
  const total = count(s) + comps.filter(([c]) => new RegExp(`<${c}\b`).test(s)).reduce((n, [, k]) => n + k, 0) + 1;
  if (total > 3) errors.push(`${path.relative(SRC, v)}: ${total} mascots on one page incl. the footer (max 3)`);
  if (/^team-member$/.test(path.basename(v, ".tsx")) && count(s)) errors.push("team-member: the mascot never replaces the person on a profile");
}

// 2. never in place of people: Home hero, team showcase/cards, Giorgio
for (const f of files) {
  const rel = path.relative(SRC, f);
  if (count(read(f)) && /(HomeHero|TeamShowcase|MemberCard|MemberVisual|Giorgio)\.tsx$/.test(rel)) errors.push(`${rel}: the mascot must not replace a person here`);
}

// 3. known poses only (pack 10 assets/mascot)
const poses = new Set(["01-open-arms-wink", "02-presenting", "03-thinking-look-up", "04-idea-pointing", "05-thinking-smile", "06-cheering", "07-surprised-pointing-up", "08-laptop", "09-waving-wink", "10-walking-wink"]);
for (const f of files) {
  for (const m of read(f).matchAll(/<Mascot[^>]*pose="([^"]+)"/g)) if (!poses.has(m[1])) errors.push(`${path.relative(SRC, f)}: unknown pose "${m[1]}"`);
  for (const m of read(f).matchAll(/\/mascot\/mascot-([0-9a-z-]+)\.webp/g)) if (!poses.has(m[1])) errors.push(`${path.relative(SRC, f)}: unknown pose "${m[1]}"`);
}

// 4. leftovers that must never come back
for (const f of files) if (/mascotte-saluto|team-banner|cena-natale|notes\.[a-zA-Z]+\b|brand\/art/.test(read(f))) errors.push(`${path.relative(SRC, f)}: demo leftover (old mascot / demo photo / handwritten note)`);

if (errors.length) {
  console.error("[check-mascot] FAILED\n - " + errors.join("\n - "));
  process.exit(1);
}
console.log("[check-mascot] ok — at most 3 mascots per page (footer included), never in place of people, known poses only");
