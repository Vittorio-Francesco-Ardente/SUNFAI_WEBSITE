import type { CSSProperties } from "react";
import { ButtonLink, Eyebrow, Headline, TextLink } from "@/components/ui/primitives";
import { CanvasPanel, Confetto, Person, RayFan, Ripple } from "@/components/canvas/Canvas";
import { PhoneMockup } from "./PhoneMockup";
import { InfoDot, TourStart } from "./Giorgio";
import { presenters } from "@/content/team";
import type { Locale } from "@/lib/i18n";
import type { Dict } from "@/content/dict";

const SAGE = ["#DEE9BF", "#C9E1A0", "#DEE9BF", "#B9D68F", "#DEE9BF", "#C9E1A0", "#DEE9BF"];

/**
 * Ardaké hero, V3 (16.5 — CONCEPT_1 + mockup 04). Paper canvas: a sun centred on the right edge at y 33 % (orange
 * disc, cream ring, segmented ring, 7 sage rays up-left that never cross the headline), a pale sun at the bottom, a
 * leaf fan bottom-left. Left: eyebrow, 3-line H1, body + inline InfoDot, CTAs on clean paper, the tour pill.
 * Right: the phone (+8°, live app screen, no SUN-FAI mark), 3 sparks at its top-left, Giorgio palm-up standing on
 * the panel's bottom edge with his hand reaching the phone. No entry animation into Ardaké.
 */
export function ArdakeHero({ a, locale }: { a: Dict["ardake"]; locale: Locale }) {
  return (
  <CanvasPanel
    tone="paper"
    data-section="hero"
    phoneUnit={1.7}
    className="hero-scope cp-first flex flex-col lg:block lg:min-h-[max(720px,min(58vw,calc(100svh-16px)))]"
    bg={
      <>
        {/* sun centred on the right edge at y 33 %: 7 sage rays up-left (never over the headline), segmented ring, cream ring, orange disc */}
        <RayFan at={{ x: 1, y: 0.33 }} r0={0.27} r1={0.62} from={108} step={11} count={7} colors={SAGE} className="max-md:hidden" />
        <Ripple at={{ x: 1, y: 0.33 }} atSm={{ x: 1, y: 0.7 }} scaleSm={1.1} family="sunPale" core={0.115} coreColor="#FE9845" widths={[0.05]} bands={1} gap={0.01} seg={{ r0: 0.185, r1: 0.245, from: 92, to: 268, count: 14, colors: ["#FECF49", "#FE9845", "#C9E1A0", "#FECF49", "#F26A1B", "#DEE9BF"] }} />
        <Ripple at={{ x: 0.83, y: 1 }} hideSm family="sunPale" core={0.09} widths={[0.05, 0.05]} />
        <Ripple at={{ x: 0, y: 1 }} family="leaf" core={0.04} widths={[0.04, 0.04, 0.035]} fan={{ count: 6, from: 2, to: 88 }} />
        <Confetto at={{ x: 0.06, y: 0.02 }} r={0.03} fill="#F8B98A" hideSm />
      </>
    }
  >
    <div className="container-x relative z-[2] pb-6 pt-6 sm:pt-10 lg:flex lg:min-h-[inherit] lg:items-center lg:pb-16 lg:pt-4">
      <div className="lg:w-[47%]">
        <Eyebrow className="enter">{a.hero.eyebrow}</Eyebrow>
        <Headline text={a.hero.title} as="h1" size="h1" className="is-in mt-5 lg:mt-6 lg:!text-[clamp(3.4rem,1rem+4.6vw,5.9rem)]" />
        <p className="t-lead enter mt-6 max-w-[34rem]" style={{ "--d": "380ms" } as CSSProperties}>
          {a.hero.body}
          <InfoDot topic="ardake" />
        </p>
        {/* 24 px safe zone around the buttons: no decoration behind or over them */}
        <div className="enter mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-7" style={{ "--d": "460ms" } as CSSProperties}>
          <ButtonLink href="/ardake/monitoraggio/" locale={locale} size="lg">
            {a.hero.cta}
          </ButtonLink>
          <TextLink href="#come-funziona" className="self-center sm:self-auto">
            {a.hero.secondary}
          </TextLink>
        </div>
        <TourStart className="enter mt-5" />
      </div>
    </div>
    {/* phone + Giorgio: desktop on the panel (phone x 52→72 %, +8°; Giorgio on the bottom edge, hand at the phone) · phones: a stage */}
    <div className="relative h-[clamp(460px,128cqw,600px)] lg:static lg:h-auto">
      <svg viewBox="0 0 60 60" aria-hidden className="absolute left-[8%] top-[2%] z-[1] w-12 lg:left-[49.5%] lg:top-[10%] lg:w-14">
        <g stroke="#FAC23B" strokeWidth="5" strokeLinecap="round">
          <path d="M14 30 4 22" />
          <path d="M26 22 22 8" />
          <path d="M38 24 44 12" />
        </g>
      </svg>
      <div data-bleed className="enter absolute left-[12%] top-[6%] z-[1] origin-top-left rotate-[8deg] scale-[.78] sm:left-[20%] lg:left-[53%] lg:top-[12%] lg:scale-[1] xl:scale-[1.06]" style={{ "--d": "200ms" } as CSSProperties}>
        <PhoneMockup t={a.phone} label={a.hero.phoneAlt} variant="app" />
      </div>
      <Person src={presenters.giorgioPalmUp} alt={a.hero.giorgioAlt} priority sizes="(max-width: 1023px) 60vw, 34vw" className="right-[-4%] z-[2] h-[62%] lg:right-[1%] lg:h-[68%]" />
    </div>
  </CanvasPanel>
  );
}
