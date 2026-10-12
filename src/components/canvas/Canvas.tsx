import type { CSSProperties, ReactNode } from "react";
import { Img } from "@/components/ui/Img";
import { cn } from "@/lib/cn";
import { PANEL_TONES, rippleShapes, ringPath, sectorPath, type RippleSpec, type Tone } from "@/lib/ripples";

/**
 * V3 canvas system (pack 16.1/16.2). Every main section is a CanvasPanel: a large rounded panel inset from the
 * viewport, with its own presentation-style background. The panel frame is the ONLY thing that crops shapes and
 * people. Background pieces are positioned in % of the panel and sized in container units (`--u`, default = the
 * panel width; phones use a larger unit so rings stay big, like a corner of a slide) → SSR-correct, never stretched.
 */

type V = CSSProperties & Record<`--${string}`, string | number>;

export function CanvasPanel({
  tone = "paper",
  as: Tag = "section",
  bg,
  children,
  className,
  style,
  phoneUnit = 1.9,
  ...rest
}: {
  tone?: Tone;
  as?: "section" | "div" | "footer" | "article";
  /** background layer: <Ripple>, <HalfDisc>… (rendered behind everything, aria-hidden) */
  bg?: ReactNode;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** unit multiplier on phones (× panel width) */
  phoneUnit?: number;
  id?: string;
  "data-section"?: string;
  "data-tour-step"?: string;
  "data-tour-order"?: number;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}) {
  return (
    <Tag
      className={cn("canvas-panel", (tone === "leafDeep" || tone === "solar") && `canvas-panel--${tone}`, className)}
      data-tone={tone}
      style={{ "--panel-bg": PANEL_TONES[tone], "--u-sm": `${phoneUnit * 100}cqw`, ...style } as V}
      {...rest}
    >
      {bg ? (
        <div className="cp-bg" aria-hidden>
          {bg}
        </div>
      ) : null}
      {children}
    </Tag>
  );
}

type At = { x: number; y: number };
const pos = (at: At, atSm?: At | null): V => ({ "--x": `${at.x * 100}%`, "--y": `${at.y * 100}%`, ...(atSm ? { "--xs": `${atSm.x * 100}%`, "--ys": `${atSm.y * 100}%` } : {}) });

/** One ripple, centred ON an edge/corner of the panel (x,y in 0..1). `scaleSm` resizes it on phones only. */
export function Ripple({ at, atSm, hideSm, hideLg, scaleSm, className, ...spec }: RippleSpec & { at: At; atSm?: At | null; hideSm?: boolean; hideLg?: boolean; scaleSm?: number; className?: string }) {
  const { shapes, r } = rippleShapes(spec);
  const D = (2 * r) / 1000; // diameter in units
  const plain = shapes.filter((s) => s.group !== "fan");
  const fan = shapes.filter((s) => s.group === "fan");
  return (
    <svg
      className={cn("rp", hideSm && "max-md:hidden", hideLg && "md:hidden", className)}
      viewBox={`${-r} ${-r} ${2 * r} ${2 * r}`}
      style={{ ...pos(at, atSm), "--d": D, ...(scaleSm ? { "--ks": scaleSm } : {}) } as V}
      focusable="false"
    >
      {plain.map((s, i) => (
        <path key={i} d={s.d} fill={s.fill} fillRule="evenodd" style={{ "--i": s.layer } as V} />
      ))}
      {fan.length ? (
        <g className="rp-fan" style={{ "--i": 1 } as V}>
          {fan.map((s, i) => (
            <path key={i} d={s.d} fill={s.fill} fillRule="evenodd" />
          ))}
        </g>
      ) : null}
    </svg>
  );
}

/** Sage/colour rays from a centre on an edge (Ardaké hero, CONCEPT_1): annular sectors in units. */
export function RayFan({ at, r0, r1, from, step, count, colors, gapDeg = 4, className }: { at: At; r0: number; r1: number; from: number; step: number; count: number; colors: string[]; gapDeg?: number; className?: string }) {
  const R = r1 * 1000;
  return (
    <svg className={cn("rp", className)} viewBox={`${-R} ${-R} ${2 * R} ${2 * R}`} style={{ ...pos(at), "--d": 2 * r1 } as V} focusable="false">
      <g className="rp-fan" style={{ "--i": 2 } as V}>
        {Array.from({ length: count }, (_, k) => (
          <path key={k} d={sectorPath(0, 0, r0 * 1000, R, from + k * step + gapDeg / 2, from + (k + 1) * step - gapDeg / 2)} fill={colors[k % colors.length]} />
        ))}
        {/* invisible full ring so the group's box is centred on the ripple centre (transform-origin) */}
        <path d={ringPath(0, 0, R - 1, R)} fill="none" />
      </g>
    </svg>
  );
}

/** Half disc centred on an edge point, flat side on the edge. r in units. */
export function HalfDisc({ at, r, edge, fill, hideSm, className }: { at: At; r: number; edge: "top" | "bottom" | "left" | "right"; fill: string; hideSm?: boolean; className?: string }) {
  const R = r * 1000;
  const a = { bottom: [0, 180], top: [180, 360], left: [-90, 90], right: [90, 270] }[edge];
  return (
    <svg className={cn("rp", hideSm && "max-md:hidden", className)} viewBox={`${-R} ${-R} ${2 * R} ${2 * R}`} style={{ ...pos(at), "--d": 2 * r } as V} focusable="false">
      <path d={sectorPath(0, 0, 0.5, R, a[0], a[1])} fill={fill} style={{ "--i": 0 } as V} />
    </svg>
  );
}

/** Quarter disc on a panel corner. */
export function QuarterDisc({ corner, r, fill, className }: { corner: "tl" | "tr" | "bl" | "br"; r: number; fill: string; className?: string }) {
  const at = { tl: { x: 0, y: 0 }, tr: { x: 1, y: 0 }, bl: { x: 0, y: 1 }, br: { x: 1, y: 1 } }[corner];
  const a = { bl: [0, 90], br: [90, 180], tr: [180, 270], tl: [270, 360] }[corner];
  const R = r * 1000;
  return (
    <svg className={cn("rp", className)} viewBox={`${-R} ${-R} ${2 * R} ${2 * R}`} style={{ ...pos(at), "--d": 2 * r } as V} focusable="false">
      <path d={sectorPath(0, 0, 0.5, R, a[0], a[1])} fill={fill} style={{ "--i": 0 } as V} />
    </svg>
  );
}

/** Decorative stray dots and tiny floating rings are disabled globally.
 *  Deliberately preserve brand ripples, large circle motifs, social icons and
 *  interactive status indicators. Existing callsites can stay unchanged. */
export function Confetto(_props: { at: At; r: number; fill: string; ring?: boolean; hideSm?: boolean; className?: string }) {
  return null;
}

/** Flat dot grid (max one per page: Home hero). Top-left at `at`, px sizes. */
export function DotGrid({ at, cols = 5, rows = 3, gap = 20, r = 4, fill = "#B9D68F", className }: { at: At; cols?: number; rows?: number; gap?: number; r?: number; fill?: string; className?: string }) {
  const w = (cols - 1) * gap + 2 * r, h = (rows - 1) * gap + 2 * r;
  return (
    <svg className={cn("rp-abs max-md:hidden", className)} width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ left: `${at.x * 100}%`, top: `${at.y * 100}%` }} focusable="false">
      {Array.from({ length: cols * rows }, (_, k) => (
        <circle key={k} cx={r + (k % cols) * gap} cy={r + Math.floor(k / cols) * gap} r={r} fill={fill} />
      ))}
    </svg>
  );
}

/**
 * A person standing on the panel's bottom edge (16.2): direct child of the panel, bottom 0, never in a clipped box,
 * no opacity/filters/masks, never flipped. Height in % of the panel; responsive classes position it.
 */
export function Person({ src, alt, className, sizes, priority, style }: { src: string; alt: string; className?: string; sizes: string; priority?: boolean; style?: CSSProperties }) {
  // data-bleed: a person may extend past the panel edge on purpose — the panel frame is the crop (QA allow-list)
  return <span data-bleed className="contents"><Img src={src} alt={alt} sizes={sizes} priority={priority} draggable={false} className={cn("cp-person", className)} style={style} /></span>;
}

/** The mascot standing inside a panel (16.3): a character, feet visible, on a ripple. */
export function PanelMascot({ src, alt, className, sizes = "(max-width: 767px) 200px, 340px", style }: { src: string; alt: string; className?: string; sizes?: string; style?: CSSProperties }) {
  return (
    <span className={cn("cp-mascot", className)} style={style} data-mascot>
      <Img src={src} alt={alt} sizes={sizes} draggable={false} className="block h-auto w-full" />
    </span>
  );
}

/**
 * Person slot for a section presenter: on phones a stage block (height `smH`) at the END of the panel, so the person
 * stands on the panel's bottom edge after the content; from lg the slot is static and the person is positioned on
 * the panel itself (lgClass: side + height in % of the panel, 62–80 % for section presenters).
 */
export function PanelPerson({ src, alt, sizes, lgClass, smClass = "left-1/2 h-full -translate-x-1/2", smH = "clamp(300px, 88cqw, 460px)", priority }: { src: string; alt: string; sizes: string; lgClass: string; smClass?: string; smH?: string; priority?: boolean }) {
  return (
    <div className="cp-stage relative lg:static" style={{ "--sm-h": smH } as V}>
      <Person src={src} alt={alt} sizes={sizes} priority={priority} className={cn(smClass, "lg:translate-x-0", lgClass)} />
    </div>
  );
}
