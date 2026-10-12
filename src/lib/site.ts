/**
 * Facts that do not change with the language (pack 00 · SITE_CONTENT §0).
 * Public labels live in src/content/{it,lmo}; this file only holds data.
 */
export const site = {
  name: "SUN-FAI",
  legalName: "Comunità Energetica SUN-FAI Società Cooperativa",
  email: "info@sun-fai.org",
  web: "www.sun-fai.org",
  /** TODO_SUNFAI: confirm before publishing. */
  vat: "04618600169",
  address: { street: "Via Anemone 5", postalCode: "24044", city: "Dalmine", province: "BG" },
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Via+Anemone+5+24044+Dalmine+BG",
  gseMapUrl: "https://www.gse.it/servizi-per-te/autoconsumo/mappa-interattiva-delle-cabine-primarie",
  /** Old admin area kept at the same URL (footer "Area riservata"). */
  adminUrl: "https://www.sun-fai.org/admin/dashboard",
  /**
   * Official documents [SITO]. `npm run docs:fetch` downloads them into /public/documenti;
   * then set `selfHosted: true` so every link points to the local copy.
   */
  documents: {
    selfHosted: false,
    statuto: {
      local: "/documenti/Statuto-e-Atto-Costitutivo-SUN-FAI-2024.pdf",
      remote: "https://www.sun-fai.org/assets/Sito_Statuto%20e%20Atto%20Costitutivo%20Sun-Fai_2024.pdf",
    },
    regolamento: {
      local: "/documenti/Regolamento-interno-CER-rev6-2025-03-10.pdf",
      remote: "https://www.sun-fai.org/assets/Sito_REGOLAMENTO%20INTERNO%20CER%20rev_6%2010mar2025.pdf",
    },
  },
} as const;

export const social = {
  instagram: { label: "Instagram", handle: "@sun_fai_cooperativa", url: "https://www.instagram.com/sun_fai_cooperativa/" },
  linkedin: {
    label: "LinkedIn",
    handle: "Comunità Energetica SUN-FAI",
    url: "https://www.linkedin.com/company/comunit%C3%A0-energetica-sun-fai-societ%C3%A0-cooperativa/",
  },
  facebook: { label: "Facebook", handle: "Comunità Energetica Sun-Fai Società Cooperativa", url: "https://www.facebook.com/p/Comunit%C3%A0-Energetica-Sun-Fai-Societ%C3%A0-Cooperativa-61572671780301/" },
} as const;

/** Ardaké live API (client fetch; CORS must allow the site origin). Empty → build snapshot. */
export const ARDAKE_API_BASE = process.env.NEXT_PUBLIC_ARDAKE_API_BASE ?? "";

/** Last values published on sun-fai.org (11/10/2026), shown until the live API answers. */
export const ardakeSnapshot = {
  updatedAt: "2026-10-11T12:15:00",
  energy24h: 434.72,
  last15: 18.83,
  members: 136,
  kwp: 349,
  cer: 4,
  comuniCorteConti: 7,
} as const;

export function documentUrl(key: "statuto" | "regolamento") {
  const d = site.documents[key];
  return site.documents.selfHosted ? d.local : d.remote;
}
