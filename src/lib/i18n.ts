/**
 * SUN-FAI i18n — Italian (default) + Bergamasque. Static-export friendly (no middleware).
 *
 * Routing: Italian at "/…", Bergamasque at "/bergamasch/…" (same slugs, so the switch maps 1:1).
 * Implementation: app/(it)/… and app/(lmo)/bergamasch/… are two root layouts that render the same
 * page components with a `locale` prop. Content lives in src/content/{it,lmo}/*.ts with IDENTICAL keys.
 *
 * Language tag: Bergamasque is a variety of Eastern Lombard → "lmo" (IETF with subdivision:
 * "lmo-u-sd-itbg"). lang="lmo" on <html> for BG pages and hreflang="lmo" in alternates.
 */
export const locales = ["it", "lmo"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "it";

export const localeMeta: Record<Locale, { label: string; short: string; htmlLang: string; prefix: string }> = {
  it: { label: "Italiano", short: "IT", htmlLang: "it", prefix: "" },
  lmo: { label: "Bergamàsch", short: "BG", htmlLang: "lmo", prefix: "/bergamasch" },
};

/** Map the current pathname to the same page in the other locale. */
export function switchLocalePath(pathname: string, to: Locale): string {
  const stripped = pathname.replace(/^\/bergamasch(?=\/|$)/, "") || "/";
  if (to === "lmo") return stripped === "/" ? "/bergamasch/" : `/bergamasch${stripped}`;
  return stripped;
}

export function localeFromPath(pathname: string): Locale {
  return /^\/bergamasch(\/|$)/.test(pathname) ? "lmo" : "it";
}

/** Localised internal href: lhref("lmo", "/team/") → "/bergamasch/team/". Hashes and externals pass through. */
export function lhref(locale: Locale, path: string): string {
  if (!path.startsWith("/")) return path;
  if (locale === "it") return path;
  return path === "/" ? "/bergamasch/" : `/bergamasch${path}`;
}

/** Strip the locale prefix (for active-link matching). */
export function unlocalized(pathname: string) {
  return pathname.replace(/^\/bergamasch(?=\/|$)/, "") || "/";
}

/** Remember the visitor's choice (never auto-redirect: Bergamasque is not a browser locale). */
export function rememberLocale(l: Locale) {
  try {
    localStorage.setItem("sf-locale", l);
  } catch {
    /* private mode etc. */
  }
}

export function readRememberedLocale(): Locale | null {
  try {
    const v = localStorage.getItem("sf-locale");
    return v === "it" || v === "lmo" ? v : null;
  } catch {
    return null;
  }
}

/* ---------- Dates & numbers: deterministic (no Intl: build and browser must match, and Intl has no lmo data) ---------- */
const MONTHS: Record<Locale, string[]> = {
  it: ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"],
  /** Draft month names from lmo-glossary.draft.json (_months_to_verify). */
  lmo: ["genèr", "febrér", "màrs", "avrìl", "magg", "giögn", "löi", "agòst", "setèmber", "otòber", "novèmber", "dicèmber"],
};

/** "2026-02-15" → "15 febbraio 2026" (IT) · "15 de febrér 2026" (BG, to verify). */
export function formatDate(iso: string, locale: Locale) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  const month = MONTHS[locale][m - 1];
  return locale === "lmo" ? `${d} de ${month} ${y}` : `${d} ${month} ${y}`;
}

export function monthName(index0: number, locale: Locale) {
  return MONTHS[locale][index0];
}

/** "2026-10-11T12:15:00" → "11/10/2026, 12:15" — Italian numeric format in both locales. */
export function formatDateTime(iso: string) {
  const [date, time = "00:00"] = iso.split("T");
  const [y, m, d] = date.split("-");
  return `${d}/${m}/${y}, ${time.slice(0, 5)}`;
}
