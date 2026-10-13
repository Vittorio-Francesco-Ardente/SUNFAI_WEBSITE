import { Download, ExternalLink } from "lucide-react";
import { getDict } from "@/content/dict";
import { pageMeta } from "@/lib/meta";
import type { Locale } from "@/lib/i18n";
import { asset } from "@/lib/asset";
import { ButtonLink, Eyebrow, Headline } from "@/components/ui/primitives";
import { Badge } from "@/components/geometry/shapes";
import { Img } from "@/components/ui/Img";
import { Mascot } from "@/components/people/Mascot";
import { SectionPanel } from "@/components/canvas/presets";
import { HalfDisc, Ripple } from "@/components/canvas/Canvas";
import { PageHero } from "@/components/sections/PageHero";
import { PinnedSteps } from "@/components/sections/PinnedSteps";
import { Faq } from "@/components/sections/Faq";
import { MembershipPaths } from "@/components/membership/MembershipPaths";

export const diventasocioMeta = (locale: Locale) => {
  const s = getDict(locale).socio;
  return pageMeta(locale, "/diventa-socio/", s.meta.title, s.meta.description);
};

const FILES = ["SUNFAI_01_Manifestazione_di_interesse", "SUNFAI_02_Ammissione_socio_persona_fisica", "SUNFAI_03_Ammissione_socio_persona_giuridica", "SUNFAI_04_Modulo_di_adesione"];

/**
 * /diventa-socio (pack 08). The modules' legal text is never changed nor translated: Bergamasque pages explain it
 * and link to the Italian modules. One mascot (help band). People: Chiara (hero), Beatrice / Lorenzo (paths).
 */
export function DiventaSocioPage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const s = d.socio;
  const inIt = d.common.ui.inItalian;

  return (
    <>
      <PageHero
        eyebrow={s.hero.eyebrow}
        title={s.hero.title}
        lead={
          <>
            <p>{s.hero.lead}</p>
            <p className="mt-3 !text-[17px]">{s.hero.body}</p>
          </>
        }
        actions={
          <>
            <a href={asset("/moduli/index.html?from=site#02")} className="btn btn--primary btn--lg">
              {s.hero.cta}
            </a>
            <a href={asset("/moduli/pdf/SUNFAI_02_Ammissione_socio_persona_fisica.pdf")} download className="btn btn--outline btn--lg">
              <Download aria-hidden />
              {s.hero.pdf}
            </a>
          </>
        }
        note={
          <>
            {s.hero.note} {inIt}
          </>
        }
        tone="peach"
        bg={
          <>
            <Ripple at={{ x: 1, y: 0.78 }} atSm={{ x: 1, y: 0.75 }} family="sun" core={0.13} widths={[0.12, 0.06, 0.06, 0.07]} fan={{ count: 10, from: 92, to: 268 }} seg={{ r0: 0.36, r1: 0.41, from: 96, to: 264, count: 12 }} scaleSm={1.2} />
            <Ripple at={{ x: 0, y: 1 }} hideSm family="sun" core={0.05} widths={[0.05, 0.04]} bands={2} />
            <Ripple at={{ x: 0.5, y: 1 }} hideSm family="leaf" core={0.035} widths={[0.03, 0.03]} bands={2} />
          </>
        }
        person={{ src: "/people/poses/alceste-persico--pose-open-hand.webp", alt: d.common.ui.personAlt.replace("{name}", "Alceste Persico") }}
      />

      {/* Persona fisica o giuridica */}
      <SectionPanel data-section="percorsi" tone="paper" preset="content" family="sun" id="percorsi" inner={false}>
        <span id="persona-fisica" className="block scroll-mt-24" />
        <span id="persona-giuridica" className="block scroll-mt-24" />
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)]">
          <div className="reveal mb-10 max-w-[46rem]">
            <Eyebrow>{s.paths.eyebrow}</Eyebrow>
            <Headline text={s.paths.title} tone="leaf" className="mt-5" />
            <p className="t-lead mt-5">{s.paths.lead}</p>
          </div>
          <MembershipPaths t={s.paths} inItalian={inIt} />
        </div>
      </SectionPanel>

      {/* Quattro documenti, tutti online */}
      <SectionPanel data-section="moduli" tone="mint" preset="corner" family="leaf" mirror inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)]">
          <div className="reveal mb-10 grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>{s.docs.eyebrow}</Eyebrow>
              <Headline text={s.docs.title} className="mt-5" />
            </div>
            <p className="t-lead lg:col-span-5">
              {s.docs.lead}
              {s.docs.italianNote ? <span className="mt-2 block !text-[16px] font-semibold text-ink">{s.docs.italianNote}</span> : null}
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {s.docs.items.map((doc, i) => (
              <li key={doc.code} className="reveal">
                <article className="card hover-card flex h-full flex-col overflow-hidden">
                  <a href={asset(`/moduli/index.html?from=site#${doc.code}`)} aria-label={s.docs.openAria.replace("{title}", doc.title)} className="relative block overflow-hidden bg-paper-2 px-8 pt-8">
                    <Badge n={(((i % 4) + 1) as 1 | 2 | 3 | 4)} className="absolute right-0 top-0 w-24" />
                    <Img src={`/moduli/previews/${FILES[i]}-page1.webp`} alt="" sizes="(max-width: 639px) 80vw, (max-width: 1023px) 40vw, 240px" className="hc-person relative h-auto w-full -rotate-2 rounded-t-md bg-white shadow-[var(--shadow-soft)]" />
                    <span className="absolute left-3 top-3 rounded-full bg-card px-2.5 py-1 text-[13px] font-bold text-ink">{doc.code}</span>
                  </a>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[13px] font-semibold text-orange-text">
                      {doc.short} · {doc.pages} {doc.pages === 1 ? d.common.ui.pages1 : d.common.ui.pagesN}
                    </p>
                    <h3 lang="it" className="t-h3 mt-2 !text-[1.15rem]">{doc.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-slate">{doc.text}</p>
                    <div className="mt-auto flex flex-col gap-1 pt-4">
                      <a href={asset(`/moduli/index.html?from=site#${doc.code}`)} className="tlink">
                        <span>{s.docs.openOnline}</span>
                        <ExternalLink aria-hidden />
                      </a>
                      <a href={asset(`/moduli/pdf/${FILES[i]}.pdf`)} download className="inline-flex min-h-11 items-center gap-2 text-[15px] font-medium text-slate hover:text-ink">
                        <Download className="size-4" aria-hidden /> {s.docs.pdf}
                      </a>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </SectionPanel>

      {/* Quattro passaggi — pinned with the orange progress arc + Cosa preparare */}
      <SectionPanel data-section="passaggi" tone="cream" preset="presenter" family="sun" inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)]">
          <div className="reveal max-w-[46rem]">
            <Eyebrow>{s.steps.eyebrow}</Eyebrow>
            <Headline text={s.steps.title} className="mt-5" />
          </div>
          <div className="mt-10">
            <PinnedSteps steps={s.steps.items.map((x, i) => ({ title: x.t, text: x.d, image: ["/scenes/scene-01-consulenza-laptop.webp", "/scenes/scene-04-famiglia-casa-solare.webp", "/scenes/scene-07-supporto-videochiamata.webp", "/scenes/scene-03-monitoraggio-analytics.webp", "/scenes/scene-05-teamwork-ufficio.webp"][i % 5], alt: x.t }))} progressLabel={s.steps.progress} />
          </div>
          <div className="reveal card relative mx-auto mt-10 max-w-[44rem] overflow-hidden p-7">
            <Badge n={3} className="absolute right-0 top-0 w-20 rounded-tr-[var(--radius-card)]" />
            <h3 className="t-h3">{s.steps.prepareTitle}</h3>
            <ul className="mt-4 divide-y divide-[var(--color-hairline)]">
              {s.steps.prepare.map((p, i) => (
                <li key={p} className="flex min-h-12 items-center gap-3 py-2 text-[16px] text-ink">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-solar font-display text-[13px] font-extrabold text-ink">0{i + 1}</span>
                  {p}
                </li>
              ))}
            </ul>
            <p className="t-meta mt-4">{s.steps.prepareSource}</p>
          </div>
        </div>
      </SectionPanel>

      {/* Prima di firmare */}
      <SectionPanel data-section="faq" tone="paper" preset="soft" family="leaf" mirror inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)] grid gap-10 lg:grid-cols-12">
          <div className="reveal lg:col-span-4">
            <Eyebrow>{s.faq.eyebrow}</Eyebrow>
            <Headline text={s.faq.title} size="h2s" className="mt-5" />
            <p className="t-body mt-4">{s.faq.text}</p>
            <ButtonLink href="/contatti/" locale={locale} variant="outline" className="mt-6 max-sm:w-full">
              {s.faq.cta}
            </ButtonLink>
          </div>
          <div className="reveal lg:col-span-8">
            <Faq items={s.faq.items} />
          </div>
        </div>
      </SectionPanel>

      {/* Help band — the page's one mascot */}
      <SectionPanel data-section="aiuto" tone="mint" preset="content" family="leaf" inner={false}>
        <div className="relative z-[2] px-6 py-[clamp(40px,5vw,72px)] sm:px-10 lg:px-14">
          <div className="mx-auto flex max-w-[var(--container)] flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-end gap-4">
              <Mascot pose="04-idea-pointing" alt={d.common.ui.mascotAlt} className="shrink-0" />
              <p className="speech speech--tail-left mb-10 max-w-[18rem] font-display !text-[1.15rem] !font-bold">{s.help.bubble}</p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="t-lead">{s.help.text}</p>
              <ButtonLink href="/contatti/" locale={locale} variant="dark" className="self-start max-sm:w-full">
                {s.help.cta}
              </ButtonLink>
            </div>
          </div>
        </div>
      </SectionPanel>
    </>
  );
}
