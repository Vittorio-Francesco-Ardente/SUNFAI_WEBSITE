import { getDict } from "@/content/dict";
import { pageMeta } from "@/lib/meta";
import type { Locale } from "@/lib/i18n";
import { ButtonLink, Eyebrow, Headline, TextLink } from "@/components/ui/primitives";
import { CanvasPanel, HalfDisc, QuarterDisc, Ripple } from "@/components/canvas/Canvas";
import { HomeHero } from "@/components/home/HomeHero";
import { Numbers } from "@/components/home/Numbers";
import { PerChi } from "@/components/home/PerChi";
import { About } from "@/components/home/About";
import { TrePassaggi } from "@/components/home/TrePassaggi";
import { ArdakeHome } from "@/components/home/ArdakeHome";
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
 * solar numbers → per chi → about → tre passaggi → Ardaké → mappa delle configurazioni →
 * social → join/contact. Le verifiche personali sono disponibili nella pagina Ardaké,
 * nella quale resta il form dedicato, evitando un secondo pannello ridondante in home.
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

      {/* 8 · Le nostre configurazioni (map) — mint, leaf ripple on the top-left corner */}
      <CanvasPanel
        tone="mint"
        data-section="map"
        id="configurazioni"
        className="scroll-mt-20"
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

      <JoinContact d={d.common.joinContact} locale={locale} personAlt={d.common.ui.personAlt} />
    </>
  );
}
