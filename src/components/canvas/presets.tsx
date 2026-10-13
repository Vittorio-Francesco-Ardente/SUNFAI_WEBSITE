import type { ReactNode } from "react";
import { CanvasPanel, HalfDisc, Ripple } from "./Canvas";
import type { Family, Tone } from "@/lib/ripples";
import { cn } from "@/lib/cn";

/**
 * Background presets modelled on the presentation slides (code/ripples.mjs LAYOUTS), for the body sections of the
 * inner pages. `family` picks the dominant colour, `mirror` flips left/right, so neighbouring panels never repeat
 * preset + family + side (16.1 §3.6). Every ripple is centred ON an edge or a corner.
 */
export type Preset = "content" | "presenter" | "soft" | "corner" | "frame";

const pale: Record<string, Family> = { sun: "sunPale", leaf: "leafPale", peach: "peachPale" };
const other: Record<string, Family> = { sun: "leaf", leaf: "sun", peach: "leaf" };

export function PresetBg({ preset, family = "sun", mirror = false }: { preset: Preset; family?: "sun" | "leaf" | "peach"; mirror?: boolean }) {
  const X = (x: number) => (mirror ? 1 - x : x);
  const fanR = mirror ? { from: 2, to: 88 } : { from: 92, to: 178 };
  switch (preset) {
    case "content": // slides 2/4: fan ripple bottom-right, small corners
      return (
        <>
          <Ripple at={{ x: X(1), y: 1 }} family={family} core={0.05} widths={[0.1, 0.08, 0.08, 0.08]} fan={{ count: 7, ...fanR }} />
          <Ripple at={{ x: X(1), y: 0 }} family="sunPale" core={0.03} widths={[0.025, 0.025]} />
          <Ripple at={{ x: X(0), y: 0 }} family={other[family]} core={0.03} widths={[0.03]} bands={1} />
          <HalfDisc at={{ x: X(0), y: 0.42 }} r={0.02} edge={mirror ? "right" : "left"} fill="#F5C335" hideSm />
        </>
      );
    case "presenter": // slide 3: big ripple on the side edge, low, for a person/mascot in front of it
      return (
        <>
          <Ripple at={{ x: X(1), y: 0.92 }} family={family} core={0.05} widths={[0.08, 0.06, 0.08, 0.09]} fan={{ count: 8, from: mirror ? -85 : 95, to: mirror ? 85 : 265 }} />
          <Ripple at={{ x: X(0.995), y: 0 }} family={other[family]} core={0.02} widths={[0.02, 0.02]} bands={2} />
          <Ripple at={{ x: X(0), y: 1 }} family={pale[family]} core={0.05} widths={[0.04, 0.04]} />
        </>
      );
    case "soft": // slides 6/7: nothing behind the text column
      return (
        <>
          <Ripple at={{ x: X(1), y: 0 }} family="peach" core={0.022} widths={[0.05, 0.05]} bands={2} />
          <Ripple at={{ x: X(0), y: 1 }} family={family} core={0.04} widths={[0.09, 0.08, 0.07, 0.07]} fan={{ count: 6, from: mirror ? 92 : 2, to: mirror ? 178 : 88 }} />
          <Ripple at={{ x: X(0.6), y: 1 }} family="leafPale" core={0.05} widths={[0.04]} hideSm />
        </>
      );
    case "corner": // a leaf/sun fan on the top corner, pale opposite corner
      return (
        <>
          <Ripple at={{ x: X(0), y: 0 }} family={family} core={0.05} widths={[0.06, 0.05, 0.06, 0.06]} fan={{ count: 6, from: mirror ? 182 : 272, to: mirror ? 268 : 358 }} />
          <Ripple at={{ x: X(1), y: 1 }} family={pale[family]} core={0.07} widths={[0.04, 0.04]} />

        </>
      );
    case "frame": // slide 5: a pale concentric frame centre-right + small corners
      return (
        <>
          <Ripple at={{ x: X(0.72), y: 0.5 }} family={pale[family]} startR={0.17} widths={[0.02, 0.02]} hideSm />
          <Ripple at={{ x: X(0), y: 0 }} family={other[family]} core={0.03} widths={[0.025, 0.025]} bands={2} />
          <Ripple at={{ x: X(1), y: 0 }} family="peach" core={0.015} widths={[0.012]} bands={1} />
          <Ripple at={{ x: X(1), y: 1 }} family={family} core={0.04} widths={[0.05, 0.05]} bands={2} />
        </>
      );
  }
}

/** A body section as a canvas panel with a preset background and the standard inner container/padding. */
export function SectionPanel({
  tone,
  preset,
  family,
  mirror,
  children,
  className,
  inner = true,
  bg,
  ...rest
}: {
  tone: Tone;
  preset?: Preset;
  family?: "sun" | "leaf" | "peach";
  mirror?: boolean;
  children: ReactNode;
  className?: string;
  /** wrap children in the standard container + vertical padding */
  inner?: boolean;
  /** extra background pieces */
  bg?: ReactNode;
  id?: string;
  "data-section"?: string;
  "data-tour-step"?: string;
  "data-tour-order"?: number;
  "aria-labelledby"?: string;
}) {
  return (
    <CanvasPanel
      tone={tone}
      phoneUnit={1.4}
      className={className}
      bg={
        <>
          {preset ? <PresetBg preset={preset} family={family} mirror={mirror} /> : null}
          {bg}
        </>
      }
      {...rest}
    >
      {inner ? <div className={cn("container-x relative z-[2] py-[clamp(48px,6vw,88px)]")}>{children}</div> : children}
    </CanvasPanel>
  );
}
