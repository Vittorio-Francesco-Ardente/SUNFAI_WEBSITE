#!/usr/bin/env node
/** Copies browser vendor files that must be served as-is (MapLibre worker: loaded via setWorkerUrl). */
import fs from "node:fs";
fs.mkdirSync("public/vendor", { recursive: true });
fs.copyFileSync("node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs", "public/vendor/maplibre-gl-worker.mjs");
console.log("[vendor] maplibre-gl-worker.mjs copied");
