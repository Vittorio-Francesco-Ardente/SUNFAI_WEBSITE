/**
 * SUN-FAI V3 "ripple" vocabulary (pack 16.1), ported from prompt-packs/16_FIX_VISUAL_OVERHAUL/code/ripples.mjs.
 * Concentric rings from the client's presentation: a solid core, bands getting paler, thin paper gaps, an optional
 * fan of logo rays in the first band and an optional segmented ray ring (CONCEPT_5).
 *
 * Geometry is computed in a LOCAL coordinate system centred on the ripple (0,0), in "unit" fractions × 1000, so the
 * same SVG works at any panel size: the component places it at (x%, y%) of the panel and sizes it in container
 * units (cqw). Deterministic, no randomness at render time (seeded helpers below), no gradients.
 */

export const PALETTES = {
  sun: { core: "#F26A1B", bands: ["#F5C335", "#FBE39B", "#FDEFC4", "#FEF6E0"] },
  leaf: { core: "#4B8B2F", bands: ["#B9D68F", "#DCEBC4", "#E7F0D8", "#EEF4E2"] },
  peach: { core: "#F26A1B", bands: ["#F8B98A", "#FAD2B2", "#FCE3CF", "#FEF1E6"] },
  sunPale: { core: "#FBE39B", bands: ["#FDEFC4", "#FEF6E0"] },
  leafPale: { core: "#DCEBC4", bands: ["#E7F0D8", "#EEF4E2"] },
  peachPale: { core: "#FCE3CF", bands: ["#FEF1E6"] },
  onSolar: { core: "#F26A1B", bands: ["#FE9845", "#FFE08A", "#FFF1C2", "#FFF8E3"] },
  onLeaf: { core: "#FECF49", bands: ["#9CC56B", "#7FB04E", "#5E9638", "#4C8A30"] },
} as const;
export type Family = keyof typeof PALETTES;

export const FAN_COLORS: Partial<Record<Family, string[]>> = {
  leaf: ["#4B8B2F", "#B9D68F", "#DCEBC4", "#C9DFA6", "#E7F0D8", "#B9D68F", "#DCEBC4"],
  sun: ["#B9D68F", "#DCEBC4", "#FBE39B", "#F5C335", "#FDEFC4", "#B9D68F", "#FBE39B"],
  peach: ["#F8B98A", "#FBE39B", "#F5C335", "#FAD2B2", "#F8B98A", "#FCE3CF", "#FBE39B"],
};

/** Panel tones. solar / leafDeep are statement panels: max one of each per page, never two in a row. */
export const PANEL_TONES = {
  paper: "#FBF8F1",
  mint: "#EEF6E4",
  peach: "#FDEBDD",
  cream: "#FFF4DA",
  solar: "#FECF49",
  leafDeep: "#3F7A27",
} as const;
export type Tone = keyof typeof PANEL_TONES;

/** The segmented ring colours of CONCEPT_5. */
export const SEG_COLORS = ["#FECF49", "#C9E1A0", "#FE9845", "#FECF49", "#DEE9BF", "#F26A1B", "#C9E1A0", "#FECF49", "#B9D68F", "#FE9845"];

const S = 1000; // local scale: 1 unit = 1000 user units
const f = (n: number) => Math.round(n * 10) / 10;

export function ringPath(cx: number, cy: number, r0: number, r1: number) {
  const outer = `M${f(cx + r1)} ${f(cy)}A${f(r1)} ${f(r1)} 0 1 0 ${f(cx - r1)} ${f(cy)}A${f(r1)} ${f(r1)} 0 1 0 ${f(cx + r1)} ${f(cy)}Z`;
  if (r0 <= 0) return outer;
  return `${outer}M${f(cx + r0)} ${f(cy)}A${f(r0)} ${f(r0)} 0 1 1 ${f(cx - r0)} ${f(cy)}A${f(r0)} ${f(r0)} 0 1 1 ${f(cx + r0)} ${f(cy)}Z`;
}

/** Annular sector. Degrees, 0 = right, counter-clockwise positive (screen y down handled). */
export function sectorPath(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number) {
  const p = (r: number, a: number) => [cx + r * Math.cos((a * Math.PI) / 180), cy - r * Math.sin((a * Math.PI) / 180)];
  const [x0, y0] = p(r1, a0), [x1, y1] = p(r1, a1), [x2, y2] = p(r0, a1), [x3, y3] = p(r0, a0);
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  return `M${f(x0)} ${f(y0)}A${f(r1)} ${f(r1)} 0 ${large} 0 ${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}A${f(r0)} ${f(r0)} 0 ${large} 1 ${f(x3)} ${f(y3)}Z`;
}

export type Fan = { count?: number; from?: number; to?: number; colors?: string[]; inset?: number; bandColor?: string; gapRatio?: number };
export type Seg = { r0: number; r1: number; from?: number; to?: number; count?: number; gapDeg?: number; colors?: string[] };
export type RippleSpec = {
  family: Family;
  core?: number;
  widths?: number[];
  bands?: number;
  gap?: number;
  invert?: boolean;
  coreColor?: string;
  noCore?: boolean;
  /** bands start at this radius (ring "frame", slide 5) */
  startR?: number;
  fan?: Fan | null;
  seg?: Seg;
};

export type Shape = { d: string; fill: string; layer: number; group?: "fan" };

/** Shapes of one ripple in local coordinates (centre 0,0) + its outer radius (both × 1000). */
export function rippleShapes(o: RippleSpec): { shapes: Shape[]; r: number } {
  const pal = PALETTES[o.family];
  const gap = (o.gap ?? 0.004) * S;
  const widths = o.widths ?? [0.075, 0.115, 0.122, 0.127];
  const bands = pal.bands as readonly string[];
  const n = Math.min(o.bands ?? bands.length, o.startR ? widths.length : bands.length, widths.length);
  const colors = o.invert ? [...bands.slice(0, n)].reverse() : bands.slice(0, n);
  const shapes: Shape[] = [];
  let r = (o.startR ?? o.core ?? 0.078) * S;
  if (!o.noCore && !o.startR) shapes.push({ d: ringPath(0, 0, 0, r), fill: o.coreColor ?? pal.core, layer: 0 });
  for (let i = 0; i < n; i++) {
    const r0 = r + gap, r1 = r0 + widths[i] * S;
    if (i === 0 && o.fan) {
      const fan = o.fan;
      const cnt = fan.count ?? 7, from = fan.from ?? 95, to = fan.to ?? 175;
      const step = (to - from) / cnt, g = step * (fan.gapRatio ?? 0.22);
      const fc = fan.colors ?? FAN_COLORS[o.family] ?? FAN_COLORS.sun!;
      shapes.push({ d: ringPath(0, 0, r0, r1), fill: fan.bandColor ?? bands[bands.length - 1], layer: 1, group: "fan" });
      const ri = r0 + (fan.inset ?? 0.12) * (r1 - r0), ro = r1 - (fan.inset ?? 0.12) * (r1 - r0);
      for (let k = 0; k < cnt; k++) shapes.push({ d: sectorPath(0, 0, ri, ro, from + k * step + g / 2, from + (k + 1) * step - g / 2), fill: fc[k % fc.length], layer: 1, group: "fan" });
    } else {
      shapes.push({ d: ringPath(0, 0, r0, r1), fill: (o.startR ? bands[i] ?? pal.core : colors[i]) as string, layer: i + 1 });
    }
    r = r1;
  }
  if (o.seg) {
    const s = o.seg;
    const from = s.from ?? 4, to = s.to ?? 176, cnt = s.count ?? 16, gd = s.gapDeg ?? 1.6;
    const step = (to - from) / cnt;
    const cols = s.colors ?? SEG_COLORS;
    for (let k = 0; k < cnt; k++) shapes.push({ d: sectorPath(0, 0, s.r0 * S, s.r1 * S, from + k * step + gd / 2, from + (k + 1) * step - gd / 2), fill: cols[k % cols.length], layer: n + 1, group: "fan" });
    r = Math.max(r, s.r1 * S);
  }
  return { shapes, r };
}

/** Deterministic RNG (mulberry32) + string hash for per-panel seeds: seed = hash(pageSlug + panelIndex). */
export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const hash = (s: string) => [...s].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 7) >>> 0;
