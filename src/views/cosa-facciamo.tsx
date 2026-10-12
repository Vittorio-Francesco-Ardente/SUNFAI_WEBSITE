import { Check } from "lucide-react";
import { getDict } from "@/content/dict";
import { asset } from "@/lib/asset";
import { pageMeta } from "@/lib/meta";
import type { Locale } from "@/lib/i18n";
import { ButtonLink, Eyebrow, Headline, TextLink } from "@/components/ui/primitives";
import { Badge } from "@/components/geometry/shapes";
import { Img } from "@/components/ui/Img";
import { SectionPanel } from "@/components/canvas/presets";
import { Confetto, HalfDisc, PanelPerson, Ripple } from "@/components/canvas/Canvas";
import { PageHero } from "@/components/sections/PageHero";
import { PinnedSteps } from "@/components/sections/PinnedSteps";
import { JoinContact } from "@/components/sections/JoinContact";
import { OltreCarousel } from "@/components/cosa-facciamo/OltreCarousel";

export const cosafacciamoMeta = (locale: Locale) => {
  const p = getDict(locale).pages.cosaFacciamo;
  return pageMeta(locale, "/cosa-facciamo/", p.meta.title, p.meta.description);
};

const SERVICE_SCENES = ["/scenes/scene-08-progettazione-impianto.webp", "/scenes/scene-01-consulenza-laptop.webp", "/scenes/scene-07-supporto-videochiamata.webp"];
const OLTRE_SCENES = [
  "/scenes/scene-05-teamwork-ufficio.webp",
  "/scenes/scene-10-workshop-energia-solare.webp",
  "/scenes/scene-01-consulenza-laptop.webp",
  "/scenes/scene-04-famiglia-casa-solare.webp",
  "/scenes/scene-03-monitoraggio-analytics.webp",
];

export function CosaFacciamoPage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const p = d.pages.cosaFacciamo;

  return (
    <>
      <PageHero
        eyebrow={p.hero.eyebrow}
        title={p.hero.title}
        lead={p.hero.lead}
        actions={
          <ButtonLink href="/contatti/" locale={locale} variant="dark" size="lg">
            {p.hero.cta}
          </ButtonLink>
        }
        tone="cream"
        bg={
          <>
            <Ripple at={{ x: 1, y: 0.5 }} atSm={{ x: 1, y: 0.72 }} family="peach" core={0.12} widths={[0.12, 0.06, 0.07, 0.08]} fan={{ count: 10, from: 92, to: 268 }} scaleSm={1.3} />
            <Ripple at={{ x: 0, y: 1 }} family="sun" core={0.05} widths={[0.06, 0.05, 0.05]} bands={3} />
            <Ripple at={{ x: 0.6, y: 1 }} hideSm family="leaf" core={0.03} widths={[0.025, 0.025]} bands={2} />
            <Confetto at={{ x: 0.52, y: 0.82 }} r={0.012} fill="#4B8B2F" ring hideSm />
          </>
        }
        person={{ src: "/people/poses/stefano-crivena--pose-gesture.webp", alt: p.hero.presenterAlt }}
      />

      {/* [SITO] Costruiamo comunità energetiche rinnovabili. Insieme. */}
      <SectionPanel data-section="sito" tone="paper" preset="content" family="leaf" inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)] grid gap-10 lg:grid-cols-12">
          <div className="reveal lg:col-span-5">
            <Headline text={p.sito.title} size="h2s" />
            <p className="t-lead mt-5">{p.sito.text}</p>
          </div>
          <div className="reveal card relative overflow-hidden p-6 sm:p-8 lg:col-span-7">
            <Badge n={3} className="absolute right-0 top-0 w-20 rounded-tr-[var(--radius-card)]" />
            <p className="font-display text-[1.15rem] font-bold tracking-[-0.02em] text-ink">{p.sito.leadIn}</p>
            <ol className="mt-5 grid gap-3">
              {p.sito.list.map((li, i) => (
                <li key={li} className="flex gap-3 text-[16px] leading-relaxed text-ink/85">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-mint font-display text-[13px] font-extrabold text-leaf-text">{i + 1}</span>
                  {li}
                </li>
              ))}
            </ol>
            <p className="mt-6 border-t border-[var(--color-hairline)] pt-5 font-semibold text-ink">{p.sito.closing}</p>
          </div>
        </div>
      </SectionPanel>

      {/* 01–03 service blocks */}
      <SectionPanel data-section="servizi" tone="mint" preset="corner" family="sun" inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)] grid gap-16 lg:gap-24">
          {p.services.map((s, i) => (
            <div key={s.title} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-16">
              <div className={cn("reveal lg:col-span-6", i % 2 === 1 && "lg:order-2")}>
                <div className="card hover-card overflow-hidden bg-[#fcfbf7] p-6">
                  <Img src={SERVICE_SCENES[i]} alt={s.alt} sizes="(max-width: 1023px) 90vw, 44vw" className="hc-scene aspect-[4/3] h-auto w-full object-contain" />
                </div>
              </div>
              <div className="reveal lg:col-span-6">
                <Eyebrow>{s.eyebrow}</Eyebrow>
                <h2 className="t-h2s mt-5 max-w-[22ch]">{s.title}</h2>
                <p className="t-body mt-5 max-w-[34rem]">{s.text}</p>
                <ul className="mt-7 grid gap-3">
                  {s.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-3 text-[16px] font-medium text-ink">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-sage text-leaf-text">
                        <Check className="size-4" strokeWidth={3} aria-hidden />
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </SectionPanel>

      {/* 04 · Comuni ed enti — peach presenter panel, Andrea Zonca on the right edge */}
      <SectionPanel data-section="comuni" tone="peach" preset="presenter" family="peach" id="comuni" inner={false}>
        <div className="relative z-[2]">
          <div className="relative mx-auto grid max-w-[var(--container)] items-end gap-8 px-6 pt-10 sm:px-10 lg:grid-cols-12 lg:px-14 lg:pt-16">
            <div className="reveal pb-10 lg:col-span-6 lg:pb-16">
              <Eyebrow tone="leaf">{p.comuni.eyebrow}</Eyebrow>
              <Headline text={p.comuni.title} tone="leaf" className="mt-5" />
              <p className="t-body mt-6 max-w-[34rem]">{p.comuni.text}</p>
              <ul className="mt-7 flex flex-wrap gap-2">
                {p.comuni.points.map((pt) => (
                  <li key={pt} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-card px-4 text-[15px] font-semibold text-ink shadow-[inset_0_0_0_1px_var(--color-hairline)]">
                    <Check className="size-4 text-leaf-text" strokeWidth={3} aria-hidden />
                    {pt}
                  </li>
                ))}
              </ul>
              <ButtonLink href="/contatti/" locale={locale} variant="dark" className="mt-8 max-sm:w-full">
                {p.comuni.cta}
              </ButtonLink>
            </div>
          </div>
        </div>
        <PanelPerson src="/people/poses/andrea-zonca--pose-three-quarter.webp" alt={p.comuni.presenterAlt} sizes="(max-width: 1023px) 80vw, 32vw" lgClass="lg:left-auto lg:right-[5%] lg:h-[88%]" />
      </SectionPanel>

      {/* 05 Produttori · 06 Dati */}
      <SectionPanel data-section="produttori-dati" tone="paper" preset="soft" family="leaf" mirror inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)] grid gap-4 lg:grid-cols-2 lg:gap-5">
          <div id="produttori" className="reveal card hover-card relative flex scroll-mt-24 flex-col overflow-hidden" style={{ background: "#FDF3D8" }}>
            <Badge n={4} className="absolute right-0 top-0 z-[1] w-24 rounded-tr-[var(--radius-card)]" />
            <div className="p-7 sm:p-10">
              <Eyebrow>{p.produttori.eyebrow}</Eyebrow>
              <Headline text={p.produttori.title} size="h2s" className="mt-5" />
              <p className="t-body mt-4 max-w-[32rem]">{p.produttori.text}</p>
              <TextLink href="/contatti/" locale={locale} className="mt-5">
                {p.produttori.cta}
              </TextLink>
            </div>
            <div className="mt-auto border-t border-[var(--color-hairline)] bg-[#fcfbf7] p-5">
              <Img src="/scenes/scene-06-installazione-inverter.webp" alt={p.produttori.sceneAlt} sizes="(max-width: 1023px) 90vw, 44vw" className="hc-scene mx-auto aspect-[16/10] h-auto w-full object-contain" />
            </div>
          </div>
          <div className="reveal card hover-card relative flex flex-col overflow-hidden bg-mint">
            <Badge n={3} className="absolute right-0 top-0 z-[1] w-24 rounded-tr-[var(--radius-card)]" />
            <div className="p-7 sm:p-10">
              <Eyebrow tone="leaf">{p.dati.eyebrow}</Eyebrow>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/ardake/ardake-logotype-vector.svg")} alt="" width={150} height={45} className="mt-5 h-auto w-[150px]" />
              <Headline text={p.dati.title} size="h2s" tone="leaf" className="mt-4" />
              <p className="t-body mt-4 max-w-[32rem]">{p.dati.text}</p>
              <TextLink href="/ardake/" locale={locale} className="mt-5">
                {p.dati.cta}
              </TextLink>
            </div>
            <div className="mt-auto border-t border-[var(--color-hairline)] bg-[#fcfbf7] p-5">
              <Img src="/scenes/scene-03-monitoraggio-analytics.webp" alt={p.dati.sceneAlt} sizes="(max-width: 1023px) 90vw, 44vw" className="hc-scene mx-auto aspect-[16/10] h-auto w-full object-contain" />
            </div>
          </div>
        </div>
      </SectionPanel>

      {/* Il percorso — pinned on desktop */}
      <SectionPanel data-section="percorso" tone="cream" preset="content" family="sun" mirror inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)]">
          <div className="reveal max-w-[46rem]">
            <Eyebrow>{p.percorso.eyebrow}</Eyebrow>
            <Headline text={p.percorso.title} className="mt-5" />
          </div>
          <div className="mt-10">
            <PinnedSteps steps={p.percorso.steps.map((s, i) => ({ title: s.t, text: s.d, image: ["/scenes/scene-01-consulenza-laptop.webp", "/scenes/scene-08-progettazione-impianto.webp", "/scenes/scene-05-teamwork-ufficio.webp", "/scenes/scene-06-installazione-inverter.webp", "/scenes/scene-03-monitoraggio-analytics.webp"][i], alt: s.t }))} progressLabel={p.percorso.progress} />
          </div>
        </div>
      </SectionPanel>

      {/* Oltre le CER [SITO] */}
      <SectionPanel data-section="oltre" tone="mint" preset="corner" family="leaf" inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)]">
          <div className="reveal max-w-[46rem]">
            <Eyebrow>{p.oltre.eyebrow}</Eyebrow>
            <Headline text={p.oltre.title} className="mt-5" />
          </div>
          <div className="mt-10">
            <OltreCarousel items={p.oltre.items.map((it, i) => ({ image: OLTRE_SCENES[i], alt: it.alt, text: it.text }))} />
          </div>
          <div className="reveal mt-10 grid gap-6 lg:grid-cols-12 lg:items-center">
            <p className="t-lead lg:col-span-7">{p.oltre.general}</p>
            <div className="card p-6 lg:col-span-5">
              <p className="font-display text-[1.15rem] font-bold leading-snug tracking-[-0.02em] text-ink">{p.oltre.closing}</p>
              <ButtonLink href="/contatti/" locale={locale} className="mt-5 max-sm:w-full">
                {p.oltre.cta}
              </ButtonLink>
            </div>
          </div>
        </div>
      </SectionPanel>

      <JoinContact d={d.common.joinContact} locale={locale} personAlt={d.common.ui.personAlt} />
    </>
  );
}
