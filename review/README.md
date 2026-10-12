# Bergamasque review (pack 14.2)

The whole site exists in Bergamasque at `/bergamasch/…`. Every string is a **draft** written for this build and must be checked by a native speaker (ideally someone from the SUN-FAI team or the Ducato di Piazza Pontida dictionary). Until **every** string is reviewed, the Bergamasque footer shows "Traduzione in bergamàsch in revisione".

## Files
| File | What it is |
|---|---|
| `review/bergamasco-review.csv` | One row per string: `key;italiano;bergamasch;reviewed;note` (UTF-8, `;` separated — opens in Excel / LibreOffice / Google Sheets) |
| `src/content/lmo/*.ts` | The Bergamasque dictionaries used by the site (same keys as `src/content/it/*.ts`) |
| `src/content/lmo/review.json` | `reviewed` flag + `note` per key |
| `/dev/bergamasco` | Review table in the browser (`npm run dev`, not published) |

## How to review
1. `npm run lmo:export` — refreshes the CSV from the current dictionaries (keeps existing flags and notes).
2. The reviewer edits the `bergamasch` column, sets `reviewed` to `1` for each checked string and writes doubts in `note` ("forma da verificare: …").
3. Save as CSV (`;` separator, UTF-8) in `review/bergamasco-review.csv`.
4. `npm run lmo:import` — updates `review.json` and writes the corrected strings to `review/lmo-overrides.json`, printing the changed keys.
5. A developer applies the overrides to `src/content/lmo/*.ts` (strings are typed TS modules, versioned in git) and commits.

## What stays in Italian (by design)
Acronyms (CER, GSE, POD, kWh, kWp, ATECO), brand names (SUN-FAI, Ardaké), place and person names, official role titles, the **GSE definition**, **news articles** and **press quotes**, the **legal/privacy text** and the **four membership modules** (legal documents: never translated). Bergamasque pages mark them "(in italiano)". The CSV note "uguale all'italiano…" flags every string that is identical to the Italian so the reviewer can confirm it.

## Spelling
Follow `prompt-packs/14_BERGAMASCO_TRANSLATION/code/lmo-glossary.draft.json` → `_orthography` (ö, ü, final-vowel drop, `ol / la / i` articles…) and stay consistent. Month names in dates come from `_months_to_verify` (see `src/lib/i18n.ts`).
