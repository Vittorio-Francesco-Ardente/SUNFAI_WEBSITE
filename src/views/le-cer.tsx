import { Building2, DoorOpen, Factory, HandHeart, House, PlugZap, Quote, Receipt, Scale } from "lucide-react";
import { getDict } from "@/content/dict";
import { pageMeta } from "@/lib/meta";
import type { Locale } from "@/lib/i18n";
import { ButtonLink, Eyebrow, Headline, TextLink } from "@/components/ui/primitives";
import { Badge } from "@/components/geometry/shapes";
import { Mascot } from "@/components/people/Mascot";
import { SectionPanel } from "@/components/canvas/presets";
import { Confetto, HalfDisc, Ripple } from "@/components/canvas/Canvas";
import { PageHero, CtaBand } from "@/components/sections/PageHero";
import { PinnedSteps } from "@/components/sections/PinnedSteps";
import { SharedEnergyExplainer } from "@/components/sections/SharedEnergyExplainer";
import { Faq } from "@/components/sections/Faq";
import { GiorgioProvider, InfoDot } from "@/components/ardake/Giorgio";

export const lecerMeta = (locale: Locale) => {
  const p = getDict(locale).pages.leCer;
  return pageMeta(locale, "/le-cer/", p.meta.title, p.meta.description);
};

const STEP_SCENES = ["/scenes/scene-02-consulenza-impianto-solare.webp", "/scenes/scene-04-famiglia-casa-solare.webp", "/scenes/scene-06-installazione-inverter.webp"];
const WHO_ICONS = [House, Factory, Building2, HandHeart];
const SAME_ICONS = [PlugZap, Receipt, DoorOpen];

export function LeCerPage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const p = d.pages.leCer;
  const inIt = d.common.ui.inItalian;

  return (
    <GiorgioProvider g={d.ardake.giorgio} locale={locale} topics={["configurazione", "cabina-primaria", "quarto-orario", "energia-condivisa", "incentivi", "prosumer-consumer"]}>
      <PageHero
        eyebrow={p.hero.eyebrow}
        title={p.hero.title}
        lead={p.hero.lead}
        actions={
          <>
            <ButtonLink href="/#verifica" locale={locale} size="lg">
              {p.hero.cta}
            </ButtonLink>
            <TextLink href="#come-funziona" className="self-center sm:self-auto">
              {p.hero.secondary}
            </TextLink>
          </>
        }
        tone="paper"
        bg={
          <>
            <Ripple at={{ x: 0.76, y: 0.56 }} hideSm family="leaf" startR={0.17} widths={[0.025, 0.025, 0.03]} />
            <Ripple at={{ x: 0.76, y: 0.56 }} hideSm family="leafPale" core={0.15} widths={[0.012]} bands={1} />
            <Ripple at={{ x: 1, y: 0.85 }} atSm={{ x: 1, y: 0.8 }} hideLg family="leaf" core={0.08} widths={[0.06, 0.05, 0.05]} bands={3} />
            <Ripple at={{ x: 0, y: 0 }} hideSm family="sun" core={0.04} widths={[0.035, 0.03]} bands={2} />
            <Ripple at={{ x: 0, y: 1 }} family="peach" core={0.035} widths={[0.03, 0.03]} bands={2} />
          </>
        }
        mascot={{ src: "/mascot/mascot-08-laptop.webp", alt: d.common.ui.mascotAlt }}
      />

      {/* Le CER in SUN-FAI [SITO] */}
      <SectionPanel data-section="in-sunfai" tone="mint" preset="content" family="leaf" inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)] grid gap-10 lg:grid-cols-12">
          <div className="reveal lg:col-span-5">
            <Eyebrow>{p.inSunfai.eyebrow}</Eyebrow>
            <p className="mt-6 font-display text-[clamp(1.5rem,1.1rem+1.4vw,2.4rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink">{p.inSunfai.soggetto}</p>
          </div>
          <div className="reveal grid gap-4 lg:col-span-7">
            {p.inSunfai.paragraphs.map((t, i) => (
              <p key={i} className="t-body">
                {t}
                {i === 1 ? <InfoDot topic="cabina-primaria" className="ml-2" /> : null}
                {i === 3 ? <InfoDot topic="quarto-orario" className="ml-2" /> : null}
              </p>
            ))}
          </div>
        </div>
      </SectionPanel>

      {/* Cosa sono le CER? — GSE definition (official quotation, stays in Italian) */}
      <SectionPanel data-section="cosa-sono" tone="cream" preset="soft" family="sun" inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)]">
          <div className="reveal">
            <Eyebrow>{p.cosaSono.eyebrow}</Eyebrow>
            <Headline text={p.cosaSono.title} className="mt-5" />
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-12">
            <figure className="reveal card relative overflow-hidden p-6 sm:p-9 lg:col-span-7">
              <Badge n={2} className="absolute right-0 top-0 w-24 rounded-tr-[var(--radius-card)]" />
              <Quote className="size-7 text-orange-text" aria-hidden />
              <figcaption className="mt-3 text-[15px] font-semibold text-slate">
                {p.cosaSono.intro} {inIt}
              </figcaption>
              <blockquote lang="it" className="mt-4 grid gap-4 font-display text-[1.15rem] font-bold leading-snug tracking-[-0.015em] text-ink sm:text-[1.3rem]">
                {p.cosaSono.quote.map((q) => (
                  <p key={q}>{q}</p>
                ))}
              </blockquote>
              <p className="mt-5 text-[14px] font-semibold text-orange-text">{p.cosaSono.source}</p>
            </figure>
            <div className="reveal grid content-start gap-4 lg:col-span-5">
              {p.cosaSono.after.map((t, i) => (
                <p key={i} className="t-body">
                  {t}
                  {i === 1 ? <InfoDot topic="incentivi" className="ml-2" /> : null}
                  {i === 2 ? <InfoDot topic="prosumer-consumer" className="ml-2" /> : null}
                </p>
              ))}
            </div>
          </div>
        </div>
      </SectionPanel>

      {/* Produci, condividi, ricevi — pinned on desktop */}
      <SectionPanel data-section="come" tone="paper" preset="corner" family="peach" mirror id="come-funziona" inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)]">
          <div className="reveal max-w-[44rem]">
            <Eyebrow>{p.come.eyebrow}</Eyebrow>
            <Headline text={p.come.title} className="mt-5" />
          </div>
          <div className="mt-10">
            <PinnedSteps steps={p.come.steps.map((s, i) => ({ title: s.title, text: s.text, image: STEP_SCENES[i], alt: s.alt, tag: s.role }))} progressLabel={d.pages.cosaFacciamo.percorso.progress} tone="leaf" />
          </div>
        </div>
      </SectionPanel>

      {/* Conta l'ora in cui consumi — interactive explainer */}
      <SectionPanel data-section="explainer" tone="mint" preset="frame" family="leaf" inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)]">
          <div className="reveal mb-8 grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>{p.explainer.eyebrow}</Eyebrow>
              <Headline text={p.explainer.title} className="mt-5" />
            </div>
            <p className="t-lead lg:col-span-5">{p.explainer.hint}</p>
          </div>
          <SharedEnergyExplainer t={p.explainer} />
        </div>
      </SectionPanel>

      {/* Chi può aderire */}
      <SectionPanel data-section="chi" tone="cream" preset="content" family="sun" mirror id="chi-puo-aderire" inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)]">
          <div className="reveal grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>{p.chi.eyebrow}</Eyebrow>
              <Headline text={p.chi.title} tone="leaf" className="mt-5" />
            </div>
            <p className="t-lead lg:col-span-5">
              {p.chi.lead} <InfoDot topic="configurazione" className="ml-1" />
            </p>
          </div>
          <ul className="rail rail--to-grid mt-10 pb-2 md:gap-4" style={{ ["--cols" as string]: 4 }}>
            {p.chi.items.map((it, i) => {
              const Icon = WHO_ICONS[i];
              return (
                <li key={it.title} className="reveal">
                  <div className="card hover-card relative h-full overflow-hidden p-6">
                    <Badge n={(((i % 4) + 1) as 1 | 2 | 3 | 4)} className="absolute right-0 top-0 w-16 rounded-tr-[var(--radius-card)]" />
                    <span className="grid size-12 place-items-center rounded-2xl bg-mint text-leaf-text">
                      <Icon className="size-6" strokeWidth={1.9} aria-hidden />
                    </span>
                    <h3 className="t-h3 mt-6">{it.title}</h3>
                    <p className="t-body mt-2 !text-[16px]">{it.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </SectionPanel>

      {/* Cosa non cambia — mint inset panel (no dark band) */}
      <SectionPanel data-section="non-cambia" tone="peach" preset="presenter" family="peach" inner={false}>
        <div className="relative z-[2] px-6 py-[clamp(48px,6vw,88px)] sm:px-10 lg:px-14">
          <div className="mx-auto grid max-w-[var(--container)] gap-8 lg:grid-cols-12">
            <div className="reveal lg:col-span-4">
              <Eyebrow tone="leaf">{p.nonCambia.eyebrow}</Eyebrow>
              <Headline text={p.nonCambia.title} size="h2s" tone="leaf" className="mt-5" />
            </div>
            <ul className="reveal-stagger grid gap-4 sm:grid-cols-3 lg:col-span-8">
              {p.nonCambia.items.map((c, i) => {
                const Icon = SAME_ICONS[i];
                return (
                  <li key={c.title} className="card hover-card p-6">
                    <Icon className="size-7 text-orange-text" strokeWidth={1.8} aria-hidden />
                    <p className="mt-5 font-display text-[1.2rem] font-extrabold tracking-[-0.02em] text-ink">{c.title}</p>
                    <p className="t-body mt-2 !text-[16px]">{c.text}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </SectionPanel>

      {/* Riferimenti normativi + "Lo sapevi?" (the page's one mascot) */}
      <SectionPanel data-section="norme" tone="paper" preset="soft" family="leaf" mirror inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)] grid gap-5 lg:grid-cols-12">
          <div className="reveal card flex gap-4 p-6 sm:p-8 lg:col-span-6">
            <Scale className="size-7 shrink-0 text-orange-text" aria-hidden />
            <div>
              <p className="font-display text-[1.15rem] font-extrabold tracking-[-0.02em] text-ink">{p.norme.title}</p>
              <p className="t-body mt-2 !text-[16px]">{p.norme.text}</p>
            </div>
          </div>
          <div className="reveal flex items-end gap-4 lg:col-span-6">
            <Mascot pose="04-idea-pointing" alt={d.common.ui.mascotAlt} className="shrink-0" />
            <div className="speech speech--tail-left mb-10">
              <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-leaf-text">{p.tip.eyebrow}</p>
              <p className="mt-1">{p.tip.text}</p>
            </div>
          </div>
        </div>
      </SectionPanel>

      {/* FAQ */}
      <SectionPanel data-section="faq" tone="mint" preset="corner" family="leaf" id="faq" inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)] grid gap-10 lg:grid-cols-12">
          <div className="reveal lg:col-span-4">
            <Eyebrow>{p.faq.eyebrow}</Eyebrow>
            <Headline text={p.faq.title} size="h2s" className="mt-5" />
            <p className="t-body mt-4">{p.faq.text}</p>
            <ButtonLink href="/contatti/" locale={locale} variant="outline" className="mt-6 max-sm:w-full">
              {p.faq.cta}
            </ButtonLink>
          </div>
          <div className="reveal lg:col-span-8">
            <Faq items={p.faq.items} />
          </div>
        </div>
      </SectionPanel>

      <CtaBand title={p.ctaBand.title}>
        <ButtonLink href="/#verifica" locale={locale} size="lg">
          {p.ctaBand.cta}
        </ButtonLink>
      </CtaBand>
    </GiorgioProvider>
  );
}
