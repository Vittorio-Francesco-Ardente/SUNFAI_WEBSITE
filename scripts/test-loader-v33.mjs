#!/usr/bin/env node
/** Regression checks for the P02 loader integration. Works without node_modules. */
import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const documentCode = fs.readFileSync("src/components/layout/RootDocument.tsx", "utf8");
const loaderComponent = fs.readFileSync("src/components/loader/Loader.tsx", "utf8");
const source = fs.readFileSync("public/loader/sf-loader-p02-v33.js", "utf8");
const css = fs.readFileSync("src/app/globals.css", "utf8");
const preflight = documentCode.match(/const PREFLIGHT = `([\s\S]*?)`;/)?.[1];
assert.ok(preflight, "preflight missing");
assert.ok(source.includes("window.SFLoader"), "P02 engine missing");
assert.ok(source.includes("requestAnimationFrame"), "P02 animation loop missing");
assert.ok(loaderComponent.includes("sf-loader-p02-v33.js"), "loader component points to old file");
assert.ok(loaderComponent.includes('id="sf-loader-shell"'), "missing SSR shell");
assert.ok(css.includes("#sf-loader-shell"), "missing SSR shell styles");
assert.ok(!loaderComponent.includes("<SunMark"), "old CSS loader present");

function check(previous, search = "", reduced = false) {
  const store = { ...previous };
  const classes = new Set();
  const sandbox = {
    document: { documentElement: { classList: { add(c) { classes.add(c); } } } },
    sessionStorage: { getItem: (key) => store[key], setItem: (key, value) => (store[key] = value) },
    window: { CSS: { supports: () => true } },
    CSS: { supports: () => true },
    navigator: { userAgent: "Mozilla/5.0 Chrome", connection: { saveData: false } },
    matchMedia: () => ({ matches: reduced }),
    location: { search },
  };
  vm.runInNewContext(preflight, sandbox);
  return { skipped: classes.has("sf-noloader"), store };
}
assert.equal(check({ "sf-loader": "1" }).skipped, false, "old session flag should not suppress new loader");
assert.equal(check({}).skipped, false, "fresh visit should show P02");
assert.equal(check({ "sf-loader-p02-v33": "1" }).skipped, true, "repeat visit should skip P02");
assert.equal(check({ "sf-loader-p02-v33": "1" }, "?loader=1").skipped, false, "preview URL should force replay");
assert.equal(check({}, "?noloader=1").skipped, true, "noloader must suppress P02");
assert.equal(check({}, "?test").skipped, true, "tests must suppress loader");
assert.equal(check({}, "", true).skipped, true, "reduced motion must suppress loader");
console.log("[loader] 7 visibility checks and canvas loader integration checks passed");
