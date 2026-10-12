# TODO_SUNFAI — open questions for the client

Everything below is something only SUN-FAI can confirm or provide. The site works today with safe placeholders; each item says what is shown meanwhile.

## Content
- [ ] Validate every **[NUOVO]** string (marked `// [NUOVO]` in `src/content/it/*.ts`): Home "Per chi è", "Verifica se puoi aderire", "Domande rapide", numbers lead, events follow-line, Le CER three-step roles, "Lo sapevi?" tip, Diventa socio hero body, member-profile blocks, Ardaké phone/monitor captions — and the Giorgio explanations (`ardake.giorgio.topics`).
- [ ] Confirm the **P.IVA 04618600169** and the legal name for the footer, Contatti and Note legali.
- [ ] Founding date (for future "dal …" mentions — none shown now).
- [ ] **Facebook** page URL (or confirm there is none). Hidden everywhere until then (`src/lib/site.ts → social.facebook.url`).
- [ ] Source file or embed ID of the **welcome video** of the old Home (Bunny CDN) — not shown until provided.
- [ ] **Coordinates and status** (Attiva / In valutazione / In progetto) of every configuration for the map. Today: 2 active configurations, town centres approximate ("Posizioni indicative") in `src/lib/configurations.ts`.
- [ ] Date of the **solidarity project in Dalmine** (L'Eco di Bergamo) — shown as "Data da confermare".
- [ ] Mapping of the old URLs **/notizie/3, /4, /5** to the three articles (today they redirect to the news list).
- [ ] FAQ for Diventa socio: confirm the 5 demo answers or send the approved ones.
- [ ] Final **privacy text** for the contact form and the modules (Note legali shows a "pending confirmation" line).
- [ ] Verify the **GSE "mappa delle cabine primarie"** link used in "Verifica se puoi aderire" (`src/lib/site.ts → gseMapUrl`).

## People
- [ ] Confirm the photo ↔ person mapping of the alternative poses (`03_ASSET_RULES_V2.md`; Giorgio = arms-crossed guide photo).
- [ ] Photo (white SUN-FAI t-shirt, same style) for **Benedetta Petro** — initials card "BP" meanwhile.
- [ ] Optional: one-sentence **quote**, 40–60 word bio and 2–3 focus tags per person (`src/content/team.ts` → `quote`, `bio`, `focus`). The quote bubble appears only when a real quote exists.
- [ ] **Giorgio Venezia's consent** to appear as the Ardaké guide.
- [ ] Consent of every person shown as a "presenter" across the site (Alceste, Chiara, Lorenzo, Francesco, Stefano, Beatrice, Andrea Z., Andrea B., Simone, Nicholas).

## Media
- [ ] **Real event photos** for "La stanza dei ricordi" and the milestones (IFEC award, Dalmine solidarity project, Boldesico, Comuni…). Approved landscapes are used as placeholders (`src/content/milestone-media.ts`).
- [ ] Self-host the **Statuto, Regolamento interno** and the **2024 award image**: run `npm run docs:fetch`, then set `site.documents.selfHosted = true` and point the award article image to `/news/elettra-miglior-cer.png`. Until then the documents link to sun-fai.org.
- [ ] Vector version of the SUN-FAI wordmark (SVG/AI/PDF), if available (the loader crops the official PNG).

## Integrations
- [ ] **Instagram**: professional account + long-lived token → repo secret `INSTAGRAM_ACCESS_TOKEN` (refresh every ≤ 60 days, see README).
- [ ] **LinkedIn**: admin access to the company page + Community Management API approval → `LINKEDIN_ACCESS_TOKEN` + `LINKEDIN_ORGANIZATION_URN`, or the automation fallback `LINKEDIN_FEED_URL`, or `src/content/social-manual.json`.
- [ ] **Ardaké API**: endpoint + credentials for live KPIs and monitoring (`NEXT_PUBLIC_ARDAKE_API_BASE`); **CORS must allow the site origin** (static hosting has no server proxy). Expected endpoints are documented in `src/lib/ardake/api.ts`. Meanwhile: last published values (11/10/2026 12:15) + a curve labelled "Dati dimostrativi".
- [ ] Choose the module style: `Documents.html` (default, `/moduli/index.html`) or `Documents_minimal.html` (`/moduli/minimal.html`, unlinked).
- [ ] **FormSubmit**: confirm/activate `info@sun-fai.org` once (first submission sends an activation e-mail), or choose Formspree / Resend / SMTP. Optionally set the modules' `_next` to `/diventa-socio/grazie/`.
- [ ] GitHub repository name, and whether Pages uses the custom domain **www.sun-fai.org** (DNS CNAME, `PAGES_CNAME`, empty `PAGES_BASE_PATH`) or the github.io URL (`PAGES_BASE_PATH=/<repo>`).
- [ ] Confirm the copy of the new sections (Per chi è, Verifica se puoi aderire, Domande rapide).

## Bergamasque
- [ ] **Native review** of the whole Bergamasque version (1150 strings): `npm run lmo:export` → `review/bergamasco-review.csv` (see `review/README.md`). The BG footer shows "Traduzione in bergamàsch in revisione" until every string is marked reviewed.
- [ ] Confirm the language label "Bergamàsch", the switch chip "Lèsela in bergamàsch →" and the month names used in dates.

## QA
- [ ] Mobile matrix: "Esc closes the menu sheet" failed once on iPhone 15 (WebKit) under parallel load and could not be reproduced (see reports/mobile/2026-10-12.md). Watch it on CI (retries: 1).
- [ ] Approve screenshot baselines, then enable `toHaveScreenshot` in tests/mobile/mobile-layout.spec.ts.

## V3 (pack 16)
- [ ] Re-export the portrait cut-outs cropped flat on their sides (run `npm run qa:people`: Andrea Belotti, Simone, Lorenzo, Nicholas, Stefano, Andrea Zonca, Beatrice, Francesco) from the PNG originals with complete shoulders; then remove them from `src/lib/people.ts` so they show at full height.
- [ ] Ask each member for 2 lines "Cosa faccio" for their profile (now: group description).
- [ ] Real event photos for the memory room (now: approved landscapes).
- [ ] Bergamasque review of the new V3 strings (footer CTA, Giorgio tour, phone chip) in review.json.
- [ ] Run Lighthouse mobile on Home, Team and Ardaké (target ≥ 95) — needs the lighthouse CLI.
