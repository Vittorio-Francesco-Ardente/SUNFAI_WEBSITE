import { ButtonLink, Eyebrow, Headline, TextLink } from "@/components/ui/primitives";
import { Mascot } from "@/components/people/Mascot";
import { Img } from "@/components/ui/Img";
import { CanvasPanel, HalfDisc, Ripple } from "@/components/canvas/Canvas";
import type { Locale } from "@/lib/i18n";
import type { Dict } from "@/content/dict";

const SCENES = ["/scenes/scene-02-consulenza-impianto-solare.webp", "/scenes/scene-04-famiglia-casa-solare.webp", "/scenes/scene-09-risparmio-energetico-casa.webp"];

/**
 * The client's favourite section (LIKED_SECTION_cer-tre-passaggi), V3: a mint canvas panel. Leaf fan ripple on the
 * top-right corner (clipped by the panel radius) behind the waving mascot + speech bubble, pale sun bottom-left,
 * 3 white Memphis cards with numbered steps, dark CTA + text link. NO cursive note, NO doodled arrow.
 */
export function TrePassaggi({ d, locale, mascotAlt }: { d: Dict["home"]["passaggi"]; locale: Locale; mascotAlt: string }) {
  return (
    <CanvasPanel
      tone="mint"
      data-section="tre-passaggi"
      phoneUnit={1.3}
      className="px-5 pb-8 pt-10 sm:px-10 lg:px-14 lg:pb-14 lg:pt-16"
      bg={
        <>
          <Ripple at={{ x: 1, y: 0 }} family="leaf" core={0.06} widths={[0.09, 0.07, 0.07, 0.08]} fan={{ count: 7, from: 184, to: 266 }} />
          <Ripple at={{ x: 0, y: 1 }} family="sunPale" core={0.06} widths={[0.04, 0.04]} />
          <HalfDisc at={{ x: 0.5, y: 1 }} r={0.022} edge="bottom" fill="#F5C335" hideSm />
        </>
      }
    >
        <div className="relative mx-auto max-w-[var(--container)]">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="reveal lg:col-span-6">
              <Eyebrow tone="leaf">{d.eyebrow}</Eyebrow>
              <Headline text={d.title} tone="leaf" className="mt-5" />
            </div>
            <div className="reveal flex items-center justify-between gap-3 lg:col-span-6 lg:justify-end">
              <p className="speech speech--tail-right max-w-[17rem] !text-[15px] sm:max-w-[19rem] sm:!text-[16px]">{d.bubble}</p>
              <Mascot pose="09-waving-wink" alt={mascotAlt} className="w-[96px] shrink-0 sm:w-[140px] md:w-[170px]" />
            </div>
          </div>

          <ol className="rail rail--to-grid mt-10 pb-1 [--rail-item:86%] md:gap-5 lg:mt-12" style={{ ["--cols" as string]: 3 }}>
            {d.steps.map((s, i) => (
              <li key={s.title} className="reveal">
                <article className="card hover-card flex h-full flex-col overflow-hidden !rounded-[28px]">
                  <div className="overflow-hidden border-b border-[var(--color-hairline)] bg-[#fcfbf7] p-5 sm:p-6">
                    <Img src={SCENES[i]} alt={s.alt} sizes="(max-width: 767px) 86vw, 30vw" className="hc-scene aspect-[4/3] h-auto w-full object-contain" />
                  </div>
                  <div className="flex flex-1 gap-4 p-5 sm:p-6">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-logo-green font-display text-[15px] font-extrabold text-white">{i + 1}</span>
                    <div>
                      <h3 className="t-h3">{s.title}</h3>
                      <p className="mt-2 text-[16px] leading-relaxed text-slate">{s.text}</p>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-7 lg:mt-10">
            <ButtonLink href="/le-cer/" locale={locale} variant="dark" size="md">
              {d.cta}
            </ButtonLink>
            <TextLink href="/le-cer/#chi-puo-aderire" locale={locale} className="self-center sm:self-auto">
              {d.secondary}
            </TextLink>
          </div>
        </div>
    </CanvasPanel>
  );
}
