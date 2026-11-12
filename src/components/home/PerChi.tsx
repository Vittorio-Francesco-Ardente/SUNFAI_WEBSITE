import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Headline } from "@/components/ui/primitives";
import { CanvasPanel, HalfDisc, Ripple } from "@/components/canvas/Canvas";
import { lhref, type Locale } from "@/lib/i18n";
import type { Dict } from "@/content/dict";

const HREFS = ["/diventa-socio/#persona-fisica", "/diventa-socio/#persona-giuridica", "/cosa-facciamo/#comuni", "/cosa-facciamo/#produttori"];

/**
 * "Per chi è", V4: no faces, no card grid. The four doors are one ruled editorial list: big title, one line of
 * text, an arrow that fills on hover. The heading sits beside it on desktop and above it on phones.
 */
export function PerChi({ d, locale }: { d: Dict["home"]["perChi"]; locale: Locale; personAlt?: string }) {
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
        </>
      }
    >
      <div className="container-x relative z-[2] py-[clamp(56px,7vw,112px)] lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-20">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Headline text={d.title} />
            <p className="t-lead mt-5 max-w-[30rem]">{d.lead}</p>
          </div>
        </div>
        <ul className="mt-10 border-t border-ink/20 lg:col-span-8 lg:mt-0">
          {d.doors.map((door, i) => (
            <li key={door.title} className="border-b border-ink/20">
              <Link href={lhref(locale, HREFS[i])} className="group grid items-center gap-x-8 gap-y-2 py-7 sm:grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto] lg:py-9">
                <h3 className="font-display text-[clamp(1.5rem,1.1rem+1.4vw,2.35rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink transition-transform duration-300 group-hover:translate-x-1.5">{door.title}</h3>
                <p className="text-[16px] leading-[1.5] text-slate md:col-start-2 md:row-start-1 sm:col-span-1 sm:row-start-2 md:row-start-1">{door.text}</p>
                <span className="sr-only">{door.cta}</span>
                <span aria-hidden className="row-span-2 grid size-12 place-items-center justify-self-end rounded-full bg-ink/0 text-ink shadow-[inset_0_0_0_1.5px_rgb(5_42_34/.28)] transition-[background-color,color,transform] duration-300 group-hover:-rotate-45 group-hover:bg-ink group-hover:text-white sm:row-span-2 md:col-start-3 md:row-span-1 md:row-start-1">
                  <ArrowRight className="size-5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </CanvasPanel>
  );
}
