import type { Dict } from "../dict";
import { common } from "./common";
import { home } from "./home";
import { team } from "./team";
import { ardake } from "./ardake";
import { pages } from "./pages";
import { riconoscimenti } from "./riconoscimenti";
import { socio } from "./socio";

/**
 * Bergamàsch dictionary (pack 14.2) — same keys as ../it. DRAFT: every string is `reviewed: false` in review.json
 * until a native speaker checks it (`npm run lmo:export` → review/bergamasco-review.csv → `npm run lmo:import`).
 */
export const lmo: Dict = { common, home, team, ardake, pages, riconoscimenti, socio };
