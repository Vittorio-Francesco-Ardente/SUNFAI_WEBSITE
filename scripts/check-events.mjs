#!/usr/bin/env node
/** Static-export guard: make sure event pages and the original posters ship together. */
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const exists = (p) => fs.existsSync(path.join(root, p));
const data = fs.readFileSync(path.join(root, 'src/content/events.ts'), 'utf8');
const slugs = ['il-sole-della-valle-condiviso-vedeseta', 'tutta-unaltra-energia-paladina'];
const posters = ['2026-10-13-vedeseta', '2026-10-22-paladina'];
const required = [
  'src/views/eventi.tsx', 'src/views/evento.tsx',
  'src/components/events/EventCard.tsx', 'src/components/events/EventDirectory.tsx',
  'src/components/events/HomeEvents.tsx',
  'src/app/(it)/eventi/page.tsx', 'src/app/(it)/eventi/[slug]/page.tsx',
  'src/app/(lmo)/bergamasch/eventi/page.tsx', 'src/app/(lmo)/bergamasch/eventi/[slug]/page.tsx',
  ...posters.flatMap((p) => [`public/events/${p}.webp`, `public/events/${p}.png`]),
];
let errors = 0;
for (const file of required) if (!exists(file)) { console.error(`MISSING: ${file}`); errors++; }
for (const slug of slugs) if (!data.includes(`slug: "${slug}"`)) { console.error(`MISSING EVENT: ${slug}`); errors++; }
if (!data.includes('timeZone: "Europe/Rome"')) { console.error('Date must use Europe/Rome, not a frozen build date.'); errors++; }
if (!fs.readFileSync(path.join(root,'src/app/sitemap.ts'),'utf8').includes('/eventi/${e.slug}/')) { console.error('Event routes absent from sitemap.'); errors++; }
if (errors) process.exit(1);
console.log(`[check-events] OK: ${slugs.length} scheduled events, ${posters.length} original posters, all routes present`);
