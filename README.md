> **Versione V8** · Correzioni rendering, Giorgio, galleria manuale e crediti creatore. Dettagli in `MODIFICHE_E_TEST_V8.md`.

> **Revisione responsive — 12 ottobre 2026.** Corrette le sezioni sticky, la gestione del touch scroll, header sui formati intermedi, dimensionamento mobile di Ardaké. La “Stanza dei ricordi” ora usa `TiltedGridHero` fornito nel messaggio, senza vecchio percorso 3D e senza etichette sulle foto. Si veda [CORREZIONI_MOBILE_E_SCROLL.md](CORREZIONI_MOBILE_E_SCROLL.md).

# SUN-FAI — sito V2

Sito della **Comunità Energetica SUN-FAI Società Cooperativa** (Dalmine, BG), costruito dalle prompt pack V2 in `prompt-packs/` (concept = aspetto, demo = struttura e testi, pack = regole).

- **Next.js 16 (App Router) + React 19 + TypeScript strict**, `output: 'export'` → cartella statica `out/` per **GitHub Pages** (funziona anche su Netlify / Vercel / Cloudflare Pages).
- **Tailwind CSS v4** con i token in `src/styles/tokens.css` (+ `mobile.css`), **Motion** per carousel/layout, **CSS scroll-driven animations** per i reveal, **d3-shape/d3-scale** per i grafici, **three + R3F** solo nella stanza dei ricordi (desktop), **MapLibre** solo quando si apre la mappa.
- Due lingue: **italiano** su `/` e **bergamasco** su `/bergamasch/` (due root layout in `src/app/(it)` e `src/app/(lmo)/bergamasch`, stesse pagine in `src/views/`).

## Comandi
| Comando | Cosa fa |
|---|---|
| `npm install` | dipendenze (+ `npx playwright install chromium webkit` per i test) |
| `npm run dev` | sviluppo su http://localhost:3000 |
| `npm run build` | immagini (sharp) → controllo mascotte → `next build` → postbuild (`.nojekyll`, `CNAME`, guardia "nessun gradiente") → `out/` |
| `npm run preview` | serve `out/` su http://localhost:4173 |
| `npm run check:links` | nessun link interno rotto in `out/` (rispetta `NEXT_PUBLIC_BASE_PATH`) |
| `npm run test:mobile` | matrice Playwright telefoni/tablet (pack 15) sull'export statico, IT + BG (`MOBILE_FULL=1` = tutte le rotte) |
| `npm run test:fidelity` | screenshot affiancati ai concept → `reports/fidelity/*.png` |
| `npm run lmo:export` / `lmo:import` | CSV per la revisione del bergamasco (`review/README.md`) |
| `npm run social` | aggiorna il feed social build-time (di solito lo fa la GitHub Action) |
| `npm run docs:fetch` | scarica e ospita Statuto, Regolamento e immagine del premio |
| `npm run routes` | rigenera i wrapper delle rotte IT/BG dopo aver aggiunto una vista |

## Struttura
```
src/app/(it)/…, src/app/(lmo)/bergamasch/…   wrapper delle rotte (generati da scripts/gen-routes.mjs)
src/app/global-not-found.tsx                 404 statico (IT/BG), sitemap.ts, robots.ts, icon.svg
src/views/*                                  le pagine (ricevono `locale`)
src/components/{nav,layout,home,team,ardake,charts,awards,memory-room,membership,sections,people,geometry,loader,social,ui}
src/content/it/*.ts · src/content/lmo/*.ts   TUTTI i testi (stesse chiavi), team.ts, news.ts, social-feed.json
src/lib/*                                    i18n, asset() con basePath, Ardaké API adapter, configurazioni, motion
scripts/*                                    pipeline immagini, controlli, social, documenti, revisione bergamasco
tests/mobile, tests/fidelity                 Playwright
.github/workflows/deploy.yml, social-refresh.yml
```

## Pubblicare su GitHub Pages
1. Crea il repo e fai push su `main`.
2. Settings → Pages → Source: **GitHub Actions**.
3. Settings → Secrets and variables → Actions → **Variables**:
   - `PAGES_BASE_PATH` = `/<nome-repo>` (sito github.io) oppure vuoto (dominio personalizzato)
   - `SITE_URL` = `https://www.sun-fai.org` (o `https://<utente>.github.io`)
   - `PAGES_CNAME` = `www.sun-fai.org` solo col dominio personalizzato (DNS: `CNAME www → <utente>.github.io`, record A/AAAA dell'apex dalla documentazione GitHub, poi "Enforce HTTPS")
   - `ARDAKE_API_BASE` = base dell'API Ardaké (facoltativa; il CORS deve permettere l'origine del sito)
4. Ogni push su `main` fa build + deploy. Il feed social ogni 6 ore (workflow `social-refresh.yml`) committa solo se cambia e poi richiama il deploy.

### Feed social (pack 11)
Secrets: `INSTAGRAM_ACCESS_TOKEN`, `FACEBOOK_PAGE_ACCESS_TOKEN`, `LINKEDIN_ACCESS_TOKEN`. Variables: `META_GRAPH_VERSION`, `FACEBOOK_PAGE_ID`, `LINKEDIN_ORGANIZATION_URN`, `LINKEDIN_VERSION`, `LINKEDIN_FEED_URL`.
Il token Instagram long-lived scade dopo 60 giorni: rinnovalo con `GET https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=…` e aggiorna il secret (`gh secret set INSTAGRAM_ACCESS_TOKEN`), oppure automatizzalo con un PAT fine-grained salvato come secret. Senza token il sito mostra le schede profilo ("Il prossimo post è in arrivo…"). In alternativa: `src/content/social-manual.json`.

## Regole che il codice fa rispettare
- **Niente gradienti** nel CSS (fallisce il build, eccetto le maschere), **bottoni "carta"** senza glow, icone in linea.
- **Al massimo una mascotte per pagina**, solo nei posti ammessi (`scripts/check-mascot.mjs` fallisce il build).
- Forme mai tagliate dal bordo di una sezione: sezioni con `overflow-x: clip`, giunzioni con colline/archi (`components/geometry`).
- Persone reali: mai capovolte, alt "{Nome Cognome} del team SUN-FAI".
- Nessun dato inventato: i dati demo sono etichettati "Dati dimostrativi"; ciò che manca è in **`TODO_SUNFAI.md`**.

Font self-hosted (OFL): Plus Jakarta Sans, Inter, Fredoka (titolo "Precisione"). Licenze in `src/app/fonts/`.
