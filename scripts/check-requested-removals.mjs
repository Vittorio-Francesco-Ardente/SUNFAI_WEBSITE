#!/usr/bin/env node
/**
 * Regression checks for the specifically requested SUN-FAI removals.
 * Run before the static export so deleted sections cannot silently return.
 */
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');
const tests = [
  ['home without duplicate verification panel', !read('src/views/home.tsx').includes('data-section="verifica"')],
  ['home keeps configuration map and deep-link target', read('src/views/home.tsx').includes('id="configurazioni"') && read('src/views/home.tsx').includes('<ConfigMap')],
  ['CER without "Le CER in SUN-FAI" section', !read('src/views/le-cer.tsx').includes('data-section="in-sunfai"')],
  ['CER without "Conta l’ora in cui consumi" section', !read('src/views/le-cer.tsx').includes('data-section="explainer"')],
  ['CER retains GSE explanation', read('src/views/le-cer.tsx').includes('data-section="cosa-sono"')],
  ['CER retains joining information', read('src/views/le-cer.tsx').includes('data-section="chi"')],
  ['Ardaké retains a real verification form', read('src/views/ardake.tsx').includes('id="verifica"') && read('src/views/ardake.tsx').includes('<VerificaForm')],
  ['CER buttons point to existing Ardaké form', read('src/views/le-cer.tsx').includes('href="/ardake/#verifica"')],
  ['Footer verification points to existing Ardaké form', read('src/components/layout/Footer.tsx').includes('href: "/ardake/#verifica"')],
];
const views = path.join(root, 'src');
let stray = [];
function visit(dir) {
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) visit(p);
    else if (p.endsWith('.tsx') && d.name !== 'Canvas.tsx' && /<(Confetto|DotGrid)(?:\s|\/|>)/.test(fs.readFileSync(p, 'utf8'))) stray.push(path.relative(root, p));
  }
}
visit(views);
tests.push(['no tiny floating dots/rings used in components', stray.length === 0]);
let fail = 0;
for (const [name, ok] of tests) { console.log(`${ok ? '✓' : '✗'} ${name}`); if (!ok) fail++; }
if (stray.length) console.error('Still rendering decorations in:', stray.join(', '));
if (fail) process.exit(1);
console.log(`[structure] ${tests.length} regression checks passed`);
