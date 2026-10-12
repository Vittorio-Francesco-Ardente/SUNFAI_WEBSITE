/**
 * Ardaké API adapter (client-side, static hosting: no server proxy).
 * The real endpoint and payload are not documented yet (TODO_SUNFAI: "Ardaké API endpoint and credentials",
 * CORS must allow the site origin). Until NEXT_PUBLIC_ARDAKE_API_BASE is set, every call resolves to the
 * last values published on sun-fai.org (build snapshot) with their timestamp, clearly labelled as such.
 *
 * Expected (to confirm with SUN-FAI):
 *   GET {base}/configurations/{code}/summary → { updatedAt, last15Kwh, totalKwh, energy24hKwh, members }
 *   GET {base}/configurations/{code}/power?from&to → { points: [{ t: ISO, kw: number }] }
 */
import { ARDAKE_API_BASE, ardakeSnapshot } from "@/lib/site";

export type Summary = { updatedAt: string; last15Kwh: number; totalKwh: number; energy24hKwh: number; members: number; live: boolean };
export type PowerPoint = { t: string; kw: number };

const snapshot = (): Summary => ({
  updatedAt: ardakeSnapshot.updatedAt,
  last15Kwh: ardakeSnapshot.last15,
  totalKwh: ardakeSnapshot.energy24h,
  energy24hKwh: ardakeSnapshot.energy24h,
  members: ardakeSnapshot.members,
  live: false,
});

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${ARDAKE_API_BASE.replace(/\/$/, "")}${path}`, { signal, headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Ardaké API ${res.status}`);
  return (await res.json()) as T;
}

export async function fetchSummary(code: string, signal?: AbortSignal): Promise<Summary> {
  if (!ARDAKE_API_BASE) return snapshot();
  try {
    const s = await getJson<Omit<Summary, "live">>(`/configurations/${encodeURIComponent(code)}/summary`, signal);
    return { ...s, live: true };
  } catch {
    return snapshot();
  }
}

export async function fetchPower(code: string, signal?: AbortSignal): Promise<PowerPoint[] | null> {
  if (!ARDAKE_API_BASE) return null;
  try {
    const r = await getJson<{ points: PowerPoint[] }>(`/configurations/${encodeURIComponent(code)}/power`, signal);
    return r.points;
  } catch {
    return null;
  }
}

/** Demo 15-minute power curve for a sunny October day, ending at `untilHour` (clearly labelled as demonstrative). */
export function demoPowerCurve(peakKw = 120, untilHour = 12.25): PowerPoint[] {
  const pts: PowerPoint[] = [];
  for (let q = 0; q <= untilHour * 4; q++) {
    const h = q / 4;
    const x = (h - 7.2) / (18.4 - 7.2);
    const kw = h <= 7.2 || h >= 18.4 ? 0 : peakKw * Math.pow(Math.sin(Math.PI * x), 1.5) * (0.92 + 0.08 * Math.sin(q * 1.7));
    const hh = String(Math.floor(h)).padStart(2, "0");
    const mm = String((q % 4) * 15).padStart(2, "0");
    pts.push({ t: `2026-10-11T${hh}:${mm}:00`, kw: Math.max(0, kw) });
  }
  return pts;
}
