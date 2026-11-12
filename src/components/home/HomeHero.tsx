import type { CSSProperties } from "react";
import { ButtonLink, Headline, TextLink } from "@/components/ui/primitives";
import { CanvasPanel, HalfDisc, PanelMascot, QuarterDisc, Ripple } from "@/components/canvas/Canvas";
import type { Dict } from "@/content/dict";
import type { Locale } from "@/lib/i18n";

const FAN13 = ["#4B8B2F", "#B9D68F", "#F5C335", "#4B8B2F", "#FBE39B", "#B9D68F", "#F5C335", "#4B8B2F", "#B9D68F", "#FBE39B", "#F5C335", "#B9D68F", "#4B8B2F"];

/**
 * Home hero, V3 (CONCEPT_5 layout + mockup 01 background). Paper canvas panel that slides under the top bar.
 * Dominant sun ripple centred on the bottom edge at x≈0.72 (core 0.19, 13-ray fan, segmented ring of CONCEPT_5);
 * inverted leaf top-right, peach bottom-left, yellow quarter top-left, the page's only dot grid, 5 confetti.
 * The mascot stands in front of the sun core (no faces on the site). Phones: text first, then the sun rising behind it.
 */
export function HomeHero({ d, locale }: { d: Dict["home"]["hero"]; locale: Locale }) {
  return (
    <CanvasPanel
      tone="paper"
      data-section="hero"
      data-home-hero
      className="hero-scope cp-first flex flex-col lg:block lg:min-h-[max(700px,min(58vw,calc(100svh-16px)))]"
      bg={
        <>
          <Ripple
            at={{ x: 0.845, y: 1 }}
            atSm={{ x: 0.5, y: 1 }}
            scaleSm={0.92}
            family="sun"
            core={0.19}
            widths={[0.115, 0.055, 0.06, 0.07]}
            fan={{ count: 13, from: 6, to: 174, inset: 0.06, colors: FAN13 }}
            seg={{ r0: 0.372, r1: 0.428, from: 4, to: 176, count: 16 }}
          />
          <Ripple at={{ x: 0, y: 1 }} hideSm family="peach" core={0.05} widths={[0.04, 0.035, 0.03]} bands={3} />
          <QuarterDisc corner="tl" r={0.05} fill="#F5C335" className="max-md:hidden" />

          <HalfDisc at={{ x: 0.4, y: 1 }} r={0.028} edge="bottom" fill="#F5C335" hideSm />
          <HalfDisc at={{ x: 1, y: 0.62 }} r={0.022} edge="right" fill="#F8B98A" hideSm />
        </>
      }
    >
      <div className="container-x relative z-[2] pb-8 pt-6 sm:pt-10 lg:flex lg:min-h-[inherit] lg:items-center lg:pb-16 lg:pt-4">
        <div className="lg:w-[52%]">
          <Headline text={d.title} as="h1" size="hero" className="is-in" />
          <p className="t-sub enter mt-3 lg:mt-4" style={{ "--d": "360ms" } as CSSProperties}>
            {d.sub}
          </p>
          <p className="t-lead enter mt-4 max-w-[34rem] lg:max-w-[min(30rem,34vw)] lg:!text-[clamp(1.0625rem,.55rem+.75vw,1.3rem)]" style={{ "--d": "440ms" } as CSSProperties}>
            {d.body}
          </p>
          <div className="enter mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-7" style={{ "--d": "520ms" } as CSSProperties}>
            <ButtonLink href="/diventa-socio/" locale={locale} size="lg" className="w-full sm:w-auto">
              {d.cta}
            </ButtonLink>
            <TextLink href="/chi-siamo/" locale={locale} tone="leaf" className="self-center text-[clamp(1.0625rem,.95rem+.4vw,1.25rem)] font-semibold sm:self-auto">
              {d.secondary}
            </TextLink>
          </div>
        </div>
      </div>

      {/* the mascot stands on the sun: phones = a stage after the text, desktop = on the panel */}
      <div className="relative h-[clamp(280px,80cqw,520px)] lg:static lg:h-auto">
        <PanelMascot
          src="/mascot/mascot-02-presenting.webp"
          alt=""
          sizes="(max-width: 1023px) 70vw, 34vw"
          className="bottom-[4%] left-1/2 w-[min(70%,340px)] -translate-x-1/2 lg:bottom-[5%] lg:left-[78%] lg:w-[clamp(300px,30cqw,470px)]"
        />
      </div>
    </CanvasPanel>
  );
}
