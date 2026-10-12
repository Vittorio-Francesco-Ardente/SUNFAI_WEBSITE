/**
 * Deterministic, clearly fictitious energy profiles for demos and explainers.
 * Never presented as real SUN-FAI measurements.
 */

export type HourPoint = { hour: number; production: number; consumption: number; shared: number };

/** Bell-shaped PV production for a sunny day, in kWh per hour. */
export function solarCurve(peak: number, hour: number, sunrise = 6.2, sunset = 19.6) {
  if (hour <= sunrise || hour >= sunset) return 0;
  const x = (hour - sunrise) / (sunset - sunrise);
  return peak * Math.pow(Math.sin(Math.PI * x), 1.6);
}

/** Typical residential + small business load: morning and evening peaks. */
export function loadCurve(base: number, hour: number, shift = 0) {
  const h = hour - shift;
  const morning = Math.exp(-Math.pow((h - 8) / 1.6, 2)) * 0.9;
  const midday = Math.exp(-Math.pow((h - 13) / 2.6, 2)) * 0.55;
  const evening = Math.exp(-Math.pow((h - 20) / 2.1, 2)) * 1.25;
  return base * (0.32 + morning + midday + evening);
}

export function dayProfile({
  peak = 168,
  base = 60,
  shift = 0,
  midday = 0,
}: { peak?: number; base?: number; shift?: number; midday?: number } = {}): HourPoint[] {
  return Array.from({ length: 24 }, (_, hour) => {
    const production = solarCurve(peak, hour + 0.5);
    const extra = midday * Math.exp(-Math.pow((hour + 0.5 - 13) / 2.4, 2));
    const consumption = loadCurve(base, hour + 0.5, shift) + extra;
    return { hour, production, consumption, shared: Math.min(production, consumption) };
  });
}

export function totals(points: HourPoint[]) {
  const production = points.reduce((s, p) => s + p.production, 0);
  const consumption = points.reduce((s, p) => s + p.consumption, 0);
  const shared = points.reduce((s, p) => s + p.shared, 0);
  return { production, consumption, shared, sharedRatio: production ? shared / production : 0 };
}

/**
 * Deterministic Italian number formatting ("12.345,6"). Intl output differs
 * between Node's ICU at build time and the browser, which breaks hydration.
 */
export function formatIt(v: number, decimals = 0) {
  const fixed = Math.abs(v).toFixed(decimals);
  const [int, dec] = fixed.split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${v < 0 ? "-" : ""}${grouped}${dec ? `,${dec}` : ""}`;
}

export const formatKwh = (v: number) => `${formatIt(v, v < 10 ? 1 : 0)} kWh`;

export const formatInt = (v: number) => formatIt(Math.round(v));

export const formatEur = (v: number) => `€ ${formatIt(Math.round(v))}`;
