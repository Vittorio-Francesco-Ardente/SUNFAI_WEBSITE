/**
 * SUN-FAI configurations (cabine primarie). Source: sun-fai.org/ardake (11 Oct 2026).
 * Used by: "Verifica se puoi aderire", the map, Ardaké selector and monitoring.
 * TODO_SUNFAI: add configurations "In valutazione" / "In progetto" and confirm coordinates.
 */
export type ConfigStatus = "attiva" | "in-valutazione" | "in-progetto";

export interface Configuration {
  code: string; // cabina primaria code
  status: ConfigStatus;
  comuni: string[];
  /** approximate centre for the map (to confirm) */
  center?: [lng: number, lat: number];
}

export const configurations: Configuration[] = [
  { code: "AC001E01466", status: "attiva", comuni: ["Dalmine", "Lallio", "Treviolo", "Bonate Sopra", "Bonate Sotto"], center: [9.6, 45.65] },
  { code: "AC001E01412", status: "attiva", comuni: ["Osio Sotto", "Osio Sopra", "Levate", "Verdello", "Verdellino", "Boltiere"], center: [9.6, 45.61] },
];

/**
 * Approximate town centres (public geography, rounded) for the schematic map and MapLibre pins.
 * Shown with the note "Posizioni indicative". The real cabina primaria perimeter is not public here.
 */
export const comuniCoords: Record<string, [lng: number, lat: number]> = {
  Dalmine: [9.601, 45.65],
  Lallio: [9.629, 45.664],
  Treviolo: [9.594, 45.672],
  "Bonate Sopra": [9.558, 45.683],
  "Bonate Sotto": [9.561, 45.668],
  "Osio Sotto": [9.596, 45.625],
  "Osio Sopra": [9.589, 45.632],
  Levate: [9.623, 45.623],
  Verdello: [9.631, 45.604],
  Verdellino: [9.609, 45.602],
  Boltiere: [9.578, 45.6],
};

/** Accent- and case-insensitive match of a Comune name. */
export function findConfiguration(input: string) {
  const norm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
  const q = norm(input);
  if (q.length < 2) return null;
  for (const c of configurations) {
    const hit = c.comuni.find((n) => norm(n) === q) ?? c.comuni.find((n) => norm(n).startsWith(q));
    if (hit) return { configuration: c, comune: hit };
  }
  return null;
}

export const getConfiguration = (code: string) => configurations.find((c) => c.code === code);
