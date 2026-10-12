#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const nav=read('src/components/nav/NavShell.tsx');
const css=read('src/app/globals.css');
const modal=read('src/components/people/CreatorEasterEgg.tsx');
const home=read('src/components/home/HomeHero.tsx');
const canvas=read('src/components/canvas/Canvas.tsx');
const errors=[];
const check=(condition,label)=>{if(!condition)errors.push(label);else console.log('✓ '+label);};
check(nav.includes('router.push(href)') && nav.includes('window.scrollTo({ top: 0, behavior: "smooth" })'),'Logo: ritorno alla home e scroll in cima quando già nella home');
check(nav.includes('if (onClick) return;'),'Logo nel menu: navigazione standard senza ritardo');
check(nav.includes('prefers-reduced-motion: reduce'),'Logo: preferenze di movimento ridotto rispettate');
check(css.includes('sf-logo-nav-home') && css.includes('sf-home-return-appear') && home.includes('data-home-hero') && canvas.includes('"data-home-hero"?: boolean'),'Transizione confinata alla homepage');
check(modal.includes('https://www.linkedin.com/in/vittorio-ardente-812775388/'),'Link LinkedIn esatto');
check(modal.includes('https://vittorio-francesco-ardente.github.io/'),'Link portfolio esatto');
check(modal.includes('aria-modal="true"') && modal.includes('event.key === "Escape"') && modal.includes('event.key !== "Tab"'),'Card accessibile: dialog, ESC, focus trap');
check(fs.existsSync(path.join(root,'public/people/creator-vittorio-francesco-ardente.webp')),'Ritratto fallback disponibile nel pacchetto');
check(!nav.includes('view-transition-name:'),'Nessuna dipendenza obbligatoria da View Transitions API');
if(errors.length){console.error('[v26] ERRORI:\n'+errors.join('\n'));process.exit(1)}
console.log('[v26] 9 controlli superati');
