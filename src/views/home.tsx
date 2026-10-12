import { CalendarDays } from "lucide-react";
import { getDict } from "@/content/dict";
import { pageMeta } from "@/lib/meta";
import type { Locale } from "@/lib/i18n";
import { ButtonLink, Eyebrow, Headline, TextLink } from "@/components/ui/primitives";
import { Badge } from "@/components/geometry/shapes";
import { CanvasPanel, Confetto, HalfDisc, PanelPerson, QuarterDisc, Ripple } from "@/components/canvas/Canvas";
import { Img } from "@/components/ui/Img";
import { HomeHero } from "@/components/home/HomeHero";
import { Numbers } from "@/components/home/Numbers";
import { PerChi } from "@/components/home/PerChi";
import { About } from "@/components/home/About";
import { TrePassaggi } from "@/components/home/TrePassaggi";
import { ArdakeHome } from "@/components/home/ArdakeHome";
import { VerificaForm } from "@/components/home/Verifica";
import { ConfigMap } from "@/components/home/ConfigMap";
import { SocialFeed } from "@/components/social/SocialFeed";
import { JoinContact } from "@/components/sections/JoinContact";

export const homeMeta = (locale: Locale) => {
  const d = getDict(locale);
  return { ...pageMeta(locale, "/", null, d.home.meta.description), title: { absolute: d.home.meta.title } };
};

const PAD = "py-[clamp(48px,6vw,88px)]";

/**
 * Home, V3 (pack 16): a deck of canvas panels separated by paper gaps (no hills strips). Rhythm: paper hero →
 * solar numbers → mint per chi è → cream about → mint tre passaggi → paper Ardaké → peach verifica → mint map →
 * paper team → cream awards → paper press → mint social → cream FAQ → paper events → peach + mint join/contact →
 * leafDeep footer. People: hero group (Nicholas, Chiara, Simone) + 4 doors + Beatrice + Giorgio + Lorenzo + Alceste
 * + Andrea Belotti + Simone. Mascot ×3: numbers (cheering), tre passaggi (waving), footer (waving).
 */
export function HomePage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const h = d.home;
  const alt = (name: string) => d.common.ui.personAlt.replace("{name}", name);

  return (
    <>
      <HomeHero d={h.hero} locale={locale} />
      <Numbers d={h.numbers} ui={d.common.ui} mascotAlt={d.common.ui.mascotAlt} />
      <PerChi d={h.perChi} locale={locale} personAlt={d.common.ui.personAlt} />
      <About d={h.about} locale={locale} />
      <TrePassaggi d={h.passaggi} locale={locale} mascotAlt={d.common.ui.mascotAlt} />
      <ArdakeHome d={h.ardake} phone={d.ardake.phone} phoneAlt={d.ardake.hero.phoneAlt} replay={d.common.ui.replay} locale={locale} />

      {/* 7 · Verifica se puoi aderire — peach, peach fan bottom-left, Lorenzo on the right facing the form */}
      <CanvasPanel
        tone="peach"
        data-section="verifica"
        id="verifica"
        phoneUnit={1.5}
        bg={
          <>
            <Ripple at={{ x: 0, y: 1 }} family="peach" core={0.06} widths={[0.09, 0.07, 0.07, 0.08]} fan={{ count: 7, from: 2, to: 88 }} />
            <Ripple at={{ x: 1, y: 0 }} family="leaf" core={0.035} widths={[0.03, 0.035]} bands={2} />
            <Ripple at={{ x: 1, y: 1 }} hideSm family="sun" core={0.07} widths={[0.07, 0.05, 0.05]} bands={3} />
          </>
        }
      >
        <div className={`container-x relative z-[2] ${PAD}`}>
          <div className="lg:w-[64%]">
            <Eyebrow upper>{h.verifica.eyebrow}</Eyebrow>
            <Headline text={h.verifica.title} className="mt-5" />
            <p className="t-lead mt-5 max-w-[40rem]">{h.verifica.text}</p>
            <div className="card mt-8 p-5 sm:p-7">
              <VerificaForm t={h.verifica} legend={h.map.legend} locale={locale} />
            </div>
          </div>
        </div>
        <PanelPerson src="/people/lorenzo-ciresa.webp" alt={alt("Lorenzo Ciresa")} sizes="(max-width: 1023px) 80vw, 30vw" smClass="left-1/2 h-[130%] -translate-x-1/2 translate-y-[31%]" lgClass="lg:left-auto lg:right-[2%] lg:h-[min(100%,820px)] lg:translate-y-[31%]" />
      </CanvasPanel>

      {/* 8 · Le nostre configurazioni (map) — mint, leaf ripple on the top-left corner */}
      <CanvasPanel
        tone="mint"
        data-section="map"
        id="configurazioni"
        phoneUnit={1.4}
        bg={
          <>
            <Ripple at={{ x: 0, y: 0 }} family="leaf" core={0.05} widths={[0.06, 0.05, 0.06, 0.06]} fan={{ count: 6, from: 272, to: 358 }} />
            <Ripple at={{ x: 1, y: 1 }} family="sunPale" core={0.07} widths={[0.04, 0.04]} />
            <HalfDisc at={{ x: 0.42, y: 1 }} r={0.026} edge="bottom" fill="#F26A1B" hideSm />
          </>
        }
      >
        <div className={`container-x relative z-[2] grid gap-10 lg:grid-cols-12 lg:items-center ${PAD}`}>
          <div className="lg:col-span-5">
            <Eyebrow upper tone="leaf">
              {h.map.eyebrow}
            </Eyebrow>
            <Headline text={h.map.title} className="mt-5" />
            <p className="t-lead mt-5">{h.map.lead}</p>
            <ButtonLink href="/ardake/" locale={locale} variant="dark" className="mt-8 h-auto min-h-[52px] max-w-full !whitespace-normal py-3 text-left max-sm:w-full">
              {h.map.cta}
            </ButtonLink>
          </div>
          <div className="lg:col-span-7">
            <ConfigMap t={h.map} />
          </div>
        </div>
      </CanvasPanel>

      {/* Homepage: one short discovery junction instead of repeating Team, Riconoscimenti and Press.
          The complete galleries and articles belong to their corresponding thematic pages. */}
      <CanvasPanel tone="paper" data-section="scopri" bg={<Ripple at={{ x: 1, y: 0 }} family="leaf" core={0.03} widths={[0.03, 0.03]} bands={2} />}>
        <div className={`container-x relative z-[2] ${PAD}`}>
          <Eyebrow upper tone="leaf">SUN-FAI da vicino</Eyebrow>
          <Headline text="Le persone, i passi avanti, la nostra storia" size="h2s" className="mt-5 max-w-[18ch]" />
          <p className="t-lead mt-5 max-w-[52rem]">Scopri chi rende possibile la nostra comunità e ripercorri gli obiettivi raggiunti insieme.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href="/team/" locale={locale} variant="dark">Scopri il team</ButtonLink>
            <ButtonLink href="/riconoscimenti/" locale={locale} variant="outline">La nostra storia</ButtonLink>
          </div>
        </div>
      </CanvasPanel>

      {/* 12 · Dalla comunità (social) — mint, leaf fan bottom-right */}
      <CanvasPanel
        tone="mint"
        data-section="social"
        phoneUnit={1.3}
        bg={
          <>
            <Ripple at={{ x: 1, y: 1 }} family="leaf" core={0.05} widths={[0.08, 0.06, 0.06, 0.07]} fan={{ count: 7, from: 92, to: 178 }} />
            <Ripple at={{ x: 0, y: 0 }} family="sunPale" core={0.05} widths={[0.03, 0.03]} />
            <QuarterDisc corner="bl" r={0.04} fill="#F5C335" className="max-md:hidden" />
          </>
        }
      >
        <div className={`container-x relative z-[2] ${PAD}`}>
          <div className="mb-10 text-center">
            <Eyebrow upper tone="leaf" className="justify-center">{h.social.eyebrow}</Eyebrow>
            <Headline text={h.social.title} className="mx-auto mt-5" />
            <p className="t-lead mx-auto mt-5 max-w-[46rem]">{h.social.text}</p>
          </div>
          <SocialFeed t={h.social} ui={d.common.ui} locale={locale} />
          <div className="mt-7 flex justify-center">
            <TextLink href="/notizie/" locale={locale}>{h.social.all}</TextLink>
          </div>
        </div>
      </CanvasPanel>

      {/* 14 · I prossimi eventi — paper, sun fan bottom-left, the Memphis scene */}
      <CanvasPanel
        tone="paper"
        data-section="eventi"
        id="eventi"
        phoneUnit={1.3}
        bg={
          <>
            <Ripple at={{ x: 0, y: 1 }} family="sun" core={0.04} widths={[0.09, 0.08, 0.07, 0.07]} fan={{ count: 6, from: 2, to: 88 }} />
            <Ripple at={{ x: 1, y: 0 }} family="peach" core={0.022} widths={[0.05, 0.05]} bands={2} />
          </>
        }
      >
        <div className={`container-x relative z-[2] grid items-center gap-8 md:grid-cols-2 ${PAD}`}>
          <Img src="/scenes/scene-10-workshop-energia-solare.webp" alt={h.events.sceneAlt} sizes="(max-width: 767px) 90vw, 40vw" className="aspect-[4/3] h-auto w-full rounded-[28px] bg-white object-contain p-4" />
          <div>
            <Eyebrow upper>{h.events.eyebrow}</Eyebrow>
            <Headline text={h.events.title} size="h2s" className="mt-5" />
            <p className="mt-5 flex items-center gap-3 font-display text-[1.2rem] font-bold tracking-[-0.02em] text-ink">
              <CalendarDays className="size-6 text-orange-text" aria-hidden />
              {h.events.empty}
            </p>
            <p className="t-body mt-3">{h.events.follow}</p>
          </div>
        </div>
      </CanvasPanel>

      <JoinContact d={d.common.joinContact} locale={locale} personAlt={d.common.ui.personAlt} />
    </>
  );
}
