import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * SVG library (pack 01 assets/svg) as inline React components. Colours read ONLY --geo-* tokens,
 * flat fills, no gradients, no outlines. Every shape is drawn whole: crop it only with the viewport edge
 * (edge-bleed) or keep it inside its card/stage (contained) — never with a section's top/bottom edge.
 */
type P = { className?: string; style?: CSSProperties; animate?: boolean };

const G = {
  solar: "var(--geo-solar)",
  yellow: "var(--geo-yellow)",
  sage: "var(--geo-sage)",
  sageLight: "var(--geo-sage-light)",
  leaf: "var(--geo-leaf)",
  orange: "var(--geo-orange)",
  orangeSoft: "var(--geo-orange-soft)",
  peach: "var(--geo-peach)",
  mint: "var(--geo-mint)",
  cream: "var(--geo-cream)",
  green: "var(--geo-green)",
  paper: "var(--color-paper)",
};

const svgProps = { "aria-hidden": true, focusable: false } as const;

/** Annular sector path (degrees, 0 = east, counter-clockwise positive = up). */
export function sector(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number) {
  const rad = (a: number) => (a * Math.PI) / 180;
  const pt = (r: number, a: number) => `${(cx + r * Math.cos(rad(a))).toFixed(1)} ${(cy - r * Math.sin(rad(a))).toFixed(1)}`;
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  return `M${pt(r1, a0)} A${r1} ${r1} 0 ${large} 0 ${pt(r1, a1)} L${pt(r0, a1)} A${r0} ${r0} 0 ${large} 1 ${pt(r0, a0)} Z`;
}

/* ---------------- Brand mark (official SUN-FAI sun) ---------------- */
const MARK_RAYS = [
  "M 279.23 -20.75 A 280 280 0 0 0 270.52 -72.23 L 115.94 -30.96 A 120 120 0 0 1 119.67 -8.89 Z",
  "M 255.09 -115.45 A 280 280 0 0 0 229.22 -160.8 L 98.24 -68.91 A 120 120 0 0 1 109.33 -49.48 Z",
  "M 199.88 -196.08 A 280 280 0 0 0 160 -229.78 L 68.57 -98.48 A 120 120 0 0 1 85.66 -84.03 Z",
  "M 120.32 -252.83 A 280 280 0 0 0 71.29 -270.77 L 30.55 -116.05 A 120 120 0 0 1 51.57 -108.36 Z",
  "M 26.11 -278.78 A 280 280 0 0 0 -26.11 -278.78 L -11.19 -119.48 A 120 120 0 0 1 11.19 -119.48 Z",
  "M -71.29 -270.77 A 280 280 0 0 0 -120.32 -252.83 L -51.57 -108.36 A 120 120 0 0 1 -30.55 -116.05 Z",
  "M -160 -229.78 A 280 280 0 0 0 -199.88 -196.08 L -85.66 -84.03 A 120 120 0 0 1 -68.57 -98.48 Z",
  "M -229.22 -160.8 A 280 280 0 0 0 -255.09 -115.45 L -109.33 -49.48 A 120 120 0 0 1 -98.24 -68.91 Z",
  "M -270.52 -72.23 A 280 280 0 0 0 -279.23 -20.75 L -119.67 -8.89 A 120 120 0 0 1 -115.94 -30.96 Z",
].reverse(); // left → right (used by the loader stagger)
const MARK_GROUND = "M -278.5 29 L -117.1 14.6 A 118 118 0 0 0 117.1 14.6 L 278.5 29 A 280 280 0 0 1 -278.5 29 Z";

export function SunMark({ className, style, mono, title }: P & { mono?: boolean; title?: string }) {
  return (
    <svg viewBox="-300 -300 600 600" className={className} style={style} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <g fill={mono ? "currentColor" : "#478A2B"} className="mark-rays">
        {MARK_RAYS.map((d, i) => (
          <path key={i} d={d} style={{ "--i": i } as CSSProperties} />
        ))}
      </g>
      <circle r="84" fill={mono ? "currentColor" : "#FE5F00"} className="mark-sun" />
      <path d={MARK_GROUND} fill={mono ? "currentColor" : "#F3C300"} className="mark-ground" />
    </svg>
  );
}

/* ---------------- Home hero stage: complete ray ring + sun disc + hills (stage-hero-sun.svg) ---------------- */
const HERO_SEGMENTS: [string, string][] = [
  ["M67.9 556.1A760.0 760.0 0 0 0 40.1 749.4L330.0 753.4A470.0 470.0 0 0 1 347.2 633.9Z", G.sageLight],
  ["M155.0 358.1A760.0 760.0 0 0 0 73.8 535.7L350.9 621.3A470.0 470.0 0 0 1 401.1 511.4Z", G.solar],
  ["M294.3 192.6A760.0 760.0 0 0 0 166.4 340.2L408.2 500.4A470.0 470.0 0 0 1 487.3 409.1Z", G.sage],
  ["M474.7 73.2A760.0 760.0 0 0 0 310.4 178.7L497.2 400.5A470.0 470.0 0 0 1 598.8 335.2Z", G.solar],
  ["M681.3 9.3A760.0 760.0 0 0 0 494.0 64.3L610.7 329.8A470.0 470.0 0 0 1 726.6 295.8Z", G.orangeSoft],
  ["M897.6 6.3A760.0 760.0 0 0 0 702.4 6.3L739.6 293.9A470.0 470.0 0 0 1 860.4 293.9Z", G.sageLight],
  ["M1106.0 64.3A760.0 760.0 0 0 0 918.7 9.3L873.4 295.8A470.0 470.0 0 0 1 989.3 329.8Z", G.solar],
  ["M1289.6 178.7A760.0 760.0 0 0 0 1125.3 73.2L1001.2 335.2A470.0 470.0 0 0 1 1102.8 400.5Z", G.sage],
  ["M1433.6 340.2A760.0 760.0 0 0 0 1305.7 192.6L1112.7 409.1A470.0 470.0 0 0 1 1191.8 500.4Z", G.solar],
  ["M1526.2 535.7A760.0 760.0 0 0 0 1445.0 358.1L1198.9 511.4A470.0 470.0 0 0 1 1249.1 621.3Z", G.orangeSoft],
  ["M1559.9 749.4A760.0 760.0 0 0 0 1532.1 556.1L1252.8 633.9A470.0 470.0 0 0 1 1270.0 753.4Z", G.sageLight],
];

/* ---------------- Seam ornaments (pack 01.2) ---------------- */

/* ---------------- Fans, corners, badges ---------------- */

/** corner-sunrise.svg — sage rays + quarter orange sun + yellow ground, anchored bottom-right. */
export function CornerSunrise({ className, style }: P) {
  return (
    <svg viewBox="-40 -40 640 640" className={className} style={style} {...svgProps}>
      <path d="M 488.87 -30.28 A 640 640 0 0 0 365.44 4.53 L 479.05 292.96 A 330 330 0 0 1 542.7 275.01 Z" fill={G.sage} />
      <path d="M 309.45 29.76 A 640 640 0 0 0 201.59 99.13 L 394.57 341.74 A 330 330 0 0 1 450.18 305.97 Z" fill={G.sage} />
      <path d="M 155.42 139.62 A 640 640 0 0 0 72.56 237.5 L 328.04 413.09 A 330 330 0 0 1 370.76 362.62 Z" fill={G.sage} />
      <path d="M 40.24 289.72 A 640 640 0 0 0 -10.38 407.55 L 285.27 500.77 A 330 330 0 0 1 311.38 440.01 Z" fill={G.sage} />
      <path d="M -26.01 466.94 A 640 640 0 0 0 -39.98 594.42 L 270.01 597.12 A 330 330 0 0 1 277.21 531.39 Z" fill={G.sage} />
      <path d="M 0 600 C 160 520 420 500 600 540 L 600 600 Z" fill={G.yellow} />
      <path d="M 600 600 L 600 360 A 240 240 0 0 0 360 600 Z" fill={G.orange} />
      <path d="M 600 338 A 262 262 0 0 0 338 600 L 360 600 A 240 240 0 0 1 600 360 Z" fill={G.cream} />
    </svg>
  );
}

/** Card corner badges (top-right), clipped only by the card radius. Rotate variants across a row. */
export function Badge({ n = 1, className, style }: P & { n?: 1 | 2 | 3 | 4 }) {
  const content: Record<number, ReactNode> = {
    1: (
      <>
        <path d="M200 0L0 0A200 200 0 0 0 200 200Z" fill={G.peach} />
        <path d="M200 0L90 0A110 110 0 0 0 200 110Z" fill={G.orange} />
        <circle cx="150" cy="60" r="16" fill={G.cream} />
      </>
    ),
    2: (
      <>
        <path d="M10.3 9.9A190.0 190.0 0 0 0 14.9 42.7L151.3 11.2A50.0 50.0 0 0 1 150.1 2.6Z" fill={G.solar} />
        <path d="M22.6 68.1A190.0 190.0 0 0 0 37.1 97.9L157.1 25.8A50.0 50.0 0 0 1 153.3 17.9Z" fill={G.sage} />
        <path d="M52.3 119.6A190.0 190.0 0 0 0 75.3 143.4L167.2 37.7A50.0 50.0 0 0 1 161.1 31.5Z" fill={G.solar} />
        <path d="M96.5 159.3A190.0 190.0 0 0 0 125.8 174.9L180.5 46.0A50.0 50.0 0 0 1 172.8 41.9Z" fill={G.sage} />
        <path d="M150.8 183.5A190.0 190.0 0 0 0 183.4 189.3L195.6 49.8A50.0 50.0 0 0 1 187.1 48.3Z" fill={G.solar} />
      </>
    ),
    3: (
      <>
        <path d="M200 0 V200 C200 90 130 20 40 0Z" fill={G.leaf} />
        <circle cx="160" cy="160" r="26" fill={G.solar} />
      </>
    ),
    4: (
      <>
        <path d="M90.0 0A110.0 110.0 0 0 0 200.0 110.0L200.0 60.0A60.0 60.0 0 0 1 140.0 0Z" fill={G.yellow} />
        <path d="M200.0 0L150.0 0A50.0 50.0 0 0 0 200.0 50.0Z" fill={G.orangeSoft} />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 200 200" className={cn("pointer-events-none", className)} style={style} {...svgProps}>
      <g className="hc-geo">{content[n]}</g>
    </svg>
  );
}

/* ---------------- Member backdrops (CONCEPT_2/3/4) — 400 × 500, contained in the card ---------------- */
export function MemberBackdrop({ n, className, style }: P & { n: 1 | 2 | 3 | 4 | 5 | 6 }) {
  const art: Record<number, ReactNode> = {
    1: (
      <>
        <rect width="400" height="500" fill={G.peach} />
        <path className="bd-a" d="M0 0 H300 C270 140 190 250 0 300 Z" fill={G.orange} />
        <circle className="bd-b" cx="420" cy="430" r="230" fill={G.yellow} />
        <circle className="bd-c" cx="330" cy="110" r="52" fill={G.cream} />
      </>
    ),
    2: (
      <>
        <rect width="400" height="500" fill={G.cream} />
        <g className="bd-a">
          <path d="M 538.31 154.36 A 560 560 0 0 0 558.64 39.06 L 119.71 8.37 A 120 120 0 0 1 115.35 33.08 Z" fill={G.solar} opacity="0.9" />
          <path d="M 458.73 321.2 A 560 560 0 0 0 515.48 218.81 L 110.46 46.89 A 120 120 0 0 1 98.3 68.83 Z" fill={G.solar} opacity="0.55" />
          <path d="M 329.16 453.05 A 560 560 0 0 0 416.16 374.71 L 89.18 80.3 A 120 120 0 0 1 70.53 97.08 Z" fill={G.solar} opacity="0.9" />
          <path d="M 163.73 535.53 A 560 560 0 0 0 271.49 489.79 L 58.18 104.95 A 120 120 0 0 1 35.08 114.76 Z" fill={G.solar} opacity="0.55" />
          <path d="M -19.54 559.66 A 560 560 0 0 0 97.24 551.49 L 20.84 118.18 A 120 120 0 0 1 -4.19 119.93 Z" fill={G.solar} opacity="0.9" />
        </g>
        <circle className="bd-b" cx="400" cy="230" r="110" fill={G.orangeSoft} />
      </>
    ),
    3: (
      <>
        <rect width="400" height="500" fill={G.mint} />
        <path className="bd-a" d="M230 0 H400 V500 H330 C330 300 300 120 230 0 Z" fill={G.leaf} />
        <path className="bd-b" d="M0 330 C120 300 210 380 240 500 H0 Z" fill={G.solar} />
      </>
    ),
    4: (
      <>
        <rect width="400" height="500" fill={G.peach} />
        <path className="bd-a" d="M260 0 H400 V200 C340 190 280 110 260 0 Z" fill={G.leaf} />
        <circle className="bd-b" cx="0" cy="500" r="150" fill={G.orangeSoft} />
        <circle className="bd-c" cx="360" cy="70" r="30" fill={G.cream} />
      </>
    ),
    5: (
      <>
        <rect width="400" height="500" fill={G.peach} />
        <path className="bd-a" d="M400 0 V170 A170 170 0 0 1 230 0 Z" fill={G.orange} />
        <circle className="bd-b" cx="0" cy="500" r="170" fill={G.yellow} />
        <circle className="bd-c" cx="370" cy="120" r="34" fill={G.cream} />
      </>
    ),
    6: (
      <>
        <rect width="400" height="500" fill={G.mint} />
        <path className="bd-a" d="M200 0 H400 V0 C330 60 230 170 200 360 Z" fill={G.leaf} />
        <circle className="bd-b" cx="0" cy="500" r="190" fill={G.orangeSoft} />
        <circle className="bd-c" cx="250" cy="560" r="230" fill={G.cream} />
        <circle className="bd-c" cx="250" cy="250" r="110" fill={G.cream} opacity=".9" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className={cn("backdrop-svg", className)} style={style} {...svgProps}>
      <g className="hc-geo">{art[n]}</g>
    </svg>
  );
}
