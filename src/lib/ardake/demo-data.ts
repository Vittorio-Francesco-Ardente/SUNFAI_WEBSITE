/**
 * Deterministic, clearly fictitious data for the Ardaké demo and the monitoring fallback.
 * Never presented as real SUN-FAI measurements ("Dati dimostrativi" everywhere).
 */
import { dayProfile, solarCurve, totals } from "@/lib/demo-energy";

export const hourly = dayProfile({ peak: 176, base: 74, midday: 34 });
export const hourlyTotals = totals(hourly);

const MONTH_NUM = [11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const monthly = MONTH_NUM.map((mo) => {
  const season = Math.cos((2 * Math.PI * (mo - 6.6)) / 12);
  const produced = Math.round(17500 + season * 9800);
  const shared = Math.round(produced * (0.55 - season * 0.06));
  return { produced, shared };
});

/** Pseudo-random but stable (mulberry32). */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** October 2026: 31 days; 1 Oct 2026 is a Thursday → offset 3 (Mon = 0). */
const r = rng(2026);
export const calendar = { startWeekday: 3, values: Array.from({ length: 31 }, (_, i) => Math.round(260 + 220 * r() * (i % 7 >= 5 ? 0.7 : 1))) };

export const weekly = {
  thisWeek: [610, 655, 590, 702, 668, 540, 498],
  lastWeek: [575, 600, 612, 640, 610, 520, 470],
};

/** Tomorrow's forecast sun per hour (0–1), demo until a forecast source exists. */
export const bestHours = Array.from({ length: 24 }, (_, h) => Math.min(1, solarCurve(1, h + 0.5) * (h >= 12 && h <= 15 ? 1.08 : 0.97)));

export const members = { consumer: 92, prosumer: 31, enti: 13 };

export const where = { shared: Math.round(hourlyTotals.shared), grid: Math.round(hourlyTotals.production - hourlyTotals.shared) };

/** Illustrative only: demo tariff applied to demo shared energy (never a real money value). */
export const DEMO_TARIFF = 0.11;

export const memberRows = [
  { id: "Socio 01", role: "producer", kind: "PMI", share: 31.4 },
  { id: "Socio 02", role: "producer", kind: "Famiglia", share: 6.2 },
  { id: "Socio 03", role: "consumer", kind: "Famiglia", share: 9.8 },
  { id: "Socio 04", role: "consumer", kind: "Famiglia", share: 8.7 },
  { id: "Socio 05", role: "consumer", kind: "Ente", share: 14.1 },
  { id: "Socio 06", role: "consumer", kind: "Famiglia", share: 7.9 },
  { id: "Socio 07", role: "consumer", kind: "PMI", share: 12.6 },
  { id: "Socio 08", role: "consumer", kind: "Famiglia", share: 9.3 },
] as const;
