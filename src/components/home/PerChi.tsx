import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow, Headline } from "@/components/ui/primitives";
import { CanvasPanel, HalfDisc, Person, Ripple } from "@/components/canvas/Canvas";
import type { Family } from "@/lib/ripples";
import { lhref, type Locale } from "@/lib/i18n";
import type { Dict } from "@/content/dict";

const DOORS: { href: string; person: string; name: string; family: Family; tone: string; left: boolean; dot: string }[] = [
  { href: "/diventa-socio/#persona-fisica", person: "/people/poses/chiara-crivena--pose-hand-chin.webp", name: "Chiara Crivena", family: "peach", tone: "#FDEBDD", left: false, dot: "#F26A1B" },
  { href: "/diventa-socio/#persona-giuridica", person: "/people/poses/lorenzo-ciresa--pose-pointing.webp", name: "Lorenzo Ciresa", family: "sun", tone: "#FFF4DA", left: true, dot: "#F26A1B" },
  { href: "/cosa-facciamo/#comuni", person: "/people/poses/francesco-crivena--pose-pointing.webp", name: "Francesco Crivena", family: "leaf", tone: "#EEF6E4", left: false, dot: "#4B8B2F" },
  { href: "/cosa-facciamo/#produttori", person: "/people/poses/stefano-crivena--pose-gesture.webp", name: "Stefano Crivena", family: "peach", tone: "#FDEBDD", left: true, dot: "#F26A1B" },
];

/**
 * "Per chi è", V3 (mockup 09): mint canvas with a leaf fan ripple bottom-left and a sun corner top-right; a tinted
 * plate holds the 4 door cards. Each card image is a MINI CANVAS: its own ripple + fan on a corner, and the person
 * stands on the image's bottom edge (the only crop line). Phones: snap rail.
 */
export function PerChi({ d, locale, personAlt }: { d: Dict["home"]["perChi"]; locale: Locale; personAlt: string }) {
  return (
    <CanvasPanel
      tone="mint"
      data-section="per-chi"
      phoneUnit={1.5}
      bg={
        <>
          <Ripple at={{ x: 0, y: 1 }} family="leaf" core={0.05} widths={[0.07, 0.07, 0.08, 0.08]} fan={{ count: 7, from: 2, to: 88 }} />
          <Ripple at={{ x: 1, y: 0 }} family="sun" core={0.04} widths={[0.04, 0.045, 0.05]} bands={3} />
          <HalfDisc at={{ x: 0.46, y: 0 }} r={0.035} edge="top" fill="#F8B98A" hideSm />
          <HalfDisc at={{ x: 1, y: 0.62 }} r={0.04} edge="right" fill="#F5C335" hideSm />
        </>
      }
    >
      <div className="container-x relative z-[2] py-[clamp(48px,6vw,80px)]">
        <div className="max-w-[46rem]">
          <Eyebrow tone="leaf">{d.eyebrow}</Eyebrow>
          <Headline text={d.title} className="mt-4" />
          <p className="t-lead mt-4">{d.lead}</p>
        </div>
        <div className="mt-8 rounded-[40px] md:bg-[#DCEBC4] md:p-4 lg:mt-10 lg:p-5">
          <ul className="rail rail--to-grid pb-2 md:gap-4 md:[--cols:2] lg:gap-5 lg:[--cols:4]">
            {d.doors.map((door, i) => {
              const m = DOORS[i];
              return (
                <li key={door.title} className="reveal">
                  <Link href={lhref(locale, m.href)} className="card hover-card group flex h-full flex-col overflow-hidden !rounded-[28px] !bg-white">
                    <div className="mini-canvas relative aspect-[300/230] overflow-hidden" style={{ background: m.tone }}>
                      <Ripple at={{ x: m.left ? 0 : 1, y: 1 }} family={m.family} core={0.12} widths={[0.12, 0.1, 0.1, 0.1]} fan={{ count: 6, from: m.left ? 2 : 92, to: m.left ? 88 : 178 }} />
                      <HalfDisc at={{ x: 0.5, y: 0 }} r={0.055} edge="top" fill={m.dot} />
                      <Person
                        src={m.person}
                        alt={personAlt.replace("{name}", m.name)}
                        sizes="(max-width: 767px) 80vw, 22vw"
                        className="left-1/2 h-[96%] -translate-x-1/2"
                      />
                    </div>
                    <div className="relative flex flex-1 flex-col p-5 pr-16 sm:p-6 sm:pr-16">
                      <h3 className="font-display text-[1.25rem] font-extrabold tracking-[-0.02em] text-ink hc-name">{door.title}</h3>
                      <p className="mt-1.5 text-[15px] leading-[1.45] text-slate">{door.text}</p>
                      <span className="sr-only">{door.cta}</span>
                      <span aria-hidden className="hc-arrow absolute bottom-5 right-5 grid size-10 place-items-center rounded-full shadow-[inset_0_0_0_1.5px_rgb(5_42_34/.16)]">
                        <ArrowRight className="size-4" />
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </CanvasPanel>
  );
}
