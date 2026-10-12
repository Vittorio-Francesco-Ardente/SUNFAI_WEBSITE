#!/usr/bin/env node
/**
 * Adds the "← Torna al sito" bar to the online modules (pack 08) when opened with ?from=site.
 * Idempotent (marker comment). The legal text of the modules is NOT touched: only a fixed bar is injected
 * before </body>, using relative links so it works under any basePath (GitHub Pages project site or custom domain).
 */
import fs from "node:fs";

const MARK = "<!-- sunfai:back-to-site -->";
const bar = `${MARK}
<script>
(function(){
  if (!/[?&]from=site\\b/.test(location.search) || window.top !== window) return;
  var b = document.createElement('div');
  b.setAttribute('role','navigation'); b.setAttribute('aria-label','Sito SUN-FAI');
  b.style.cssText = 'position:sticky;top:0;z-index:9999;display:flex;align-items:center;gap:12px;padding:10px 16px;background:#FAF7F0;border-bottom:1px solid rgba(5,42,34,.08);font:600 15px/1.2 system-ui,sans-serif';
  var a = document.createElement('a');
  a.href = '../diventa-socio/'; a.textContent = '\\u2190 Torna al sito';
  a.style.cssText = 'display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border-radius:999px;background:#FFFDF8;color:#052A22;text-decoration:none;box-shadow:inset 0 0 0 1.5px rgba(253,74,0,.55)';
  b.appendChild(a);
  document.body.insertBefore(b, document.body.firstChild);
})();
</script>
`;

for (const file of ["public/moduli/index.html", "public/moduli/minimal.html"]) {
  let s = fs.readFileSync(file, "utf8");
  if (s.includes(MARK)) continue;
  s = s.replace(/<\/body>/i, `${bar}</body>`);
  fs.writeFileSync(file, s);
  console.log(`[moduli] back-to-site bar added → ${file}`);
}
