import Link from "next/link";
import { ArrowRight, Award, FileText, Leaf, PiggyBank, Sprout } from "lucide-react";
import { getDict } from "@/content/dict";
import { teamLite } from "@/content/team-lite";
import { pageMeta } from "@/lib/meta";
import { lhref, type Locale } from "@/lib/i18n";
import { documentUrl } from "@/lib/site";
import { configurations } from "@/lib/configurations";
import { ButtonLink, Eyebrow, Headline, Marked, TextLink } from "@/components/ui/primitives";
import { Badge, CornerSunrise } from "@/components/geometry/shapes";
import { HalfDisc, Ripple } from "@/components/canvas/Canvas";
import { Img } from "@/components/ui/Img";
import { SectionPanel } from "@/components/canvas/presets";
import { PageHero } from "@/components/sections/PageHero";
import { TeamRail } from "@/components/team/TeamRail";
import { JoinContact } from "@/components/sections/JoinContact";

export const chisiamoMeta = (locale: Locale) => {
  const p = getDict(locale).pages.chiSiamo;
  return pageMeta(locale, "/chi-siamo/", p.meta.title, p.meta.description);
};

const PERCHE_ICONS = [PiggyBank, Leaf, Sprout];

export function ChiSiamoPage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const p = d.pages.chiSiamo;
  const members = teamLite(d, locale);
  const inIt = d.common.ui.inItalian ? ` ${d.common.ui.inItalian}` : "";

  return (
    <>
      <PageHero
        eyebrow={p.hero.eyebrow}
        title={p.hero.title}
        lead={p.hero.lead}
        actions={
          <>
            <ButtonLink href="/team/" locale={locale} variant="dark" size="lg">
              {p.hero.cta}
            </ButtonLink>
            <TextLink href="/cosa-facciamo/" locale={locale} className="self-center sm:self-auto">
              {p.hero.secondary}
            </TextLink>
          </>
        }
        tone="mint"
        bg={
          <>
            <Ripple at={{ x: 1, y: 0.42 }} atSm={{ x: 1, y: 0.7 }} family="leaf" core={0.13} widths={[0.12, 0.06, 0.06, 0.07]} fan={{ count: 11, from: 92, to: 268 }} scaleSm={1.3} />
            <Ripple at={{ x: 0, y: 0 }} family="sun" core={0.035} widths={[0.03, 0.03, 0.025]} bands={3} />
            <HalfDisc at={{ x: 0.5, y: 1 }} r={0.03} edge="bottom" fill="#F26A1B" hideSm />

          </>
        }
        person={{ src: "/people/poses/francesco-crivena--pose-pointing.webp", alt: p.hero.presenterAlt }}
      />

      {/* In breve — the cooperative in six lines */}
      <SectionPanel data-section="in-breve" tone="paper" preset="content" family="sun" inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)] grid gap-10 lg:grid-cols-12">
          <div className="reveal lg:col-span-4">
            <Eyebrow>{p.inBreve.eyebrow}</Eyebrow>
            <Headline text={p.inBreve.title} size="h2s" className="mt-5" />
            <p className="t-body mt-4 max-w-[26rem]">{p.inBreve.text}</p>
          </div>
          <div className="reveal card relative overflow-hidden p-2 lg:col-span-8">
            <Badge n={2} className="absolute right-0 top-0 w-28 rounded-tr-[var(--radius-card)]" />
            <dl className="grid sm:grid-cols-2">
              {p.inBreve.facts.map((f, i) => (
                <div key={f.k} className={`p-5 sm:p-6 ${i < 4 ? "border-b border-[var(--color-hairline)]" : ""} ${i % 2 === 0 ? "sm:border-r" : ""} border-[var(--color-hairline)]`}>
                  <dt className="text-[13px] font-semibold uppercase tracking-[0.1em] text-orange-text">{f.k}</dt>
                  <dd className="mt-1.5 pr-10 font-display text-[1.15rem] font-bold leading-snug tracking-[-0.02em] text-ink">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </SectionPanel>

      {/* [SITO] text with highlighted keywords + Statuto / Regolamento */}
      <SectionPanel data-section="storia" tone="cream" preset="soft" family="peach" mirror inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)]">
          <div className="reveal mx-auto max-w-[62rem]">
            <Eyebrow>{p.sito.eyebrow}</Eyebrow>
            <p className="mt-6 font-display text-[clamp(1.4rem,1.05rem+1.4vw,2.35rem)] font-bold leading-[1.28] tracking-[-0.025em] text-ink">
              <Marked text={p.sito.text} />
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href={documentUrl("statuto")} variant="outline" icon={false}>
                {p.sito.statuto + inIt}
              </ButtonLink>
              <ButtonLink href={documentUrl("regolamento")} variant="outline" icon={false}>
                {p.sito.regolamento + inIt}
              </ButtonLink>
            </div>
          </div>
        </div>
      </SectionPanel>

      {/* Quattro regole che non negoziamo */}
      <SectionPanel data-section="principi" tone="mint" preset="corner" family="leaf" inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)]">
          <div className="reveal grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>{p.principi.eyebrow}</Eyebrow>
              <Headline text={p.principi.title} tone="leaf" className="mt-5" />
            </div>
            <p className="t-lead lg:col-span-5">{p.principi.lead}</p>
          </div>
          <div className="mt-12 grid gap-4 lg:grid-cols-12 lg:gap-5">
            <ol className="reveal-stagger grid gap-4 sm:grid-cols-2 lg:col-span-8">
              {p.principi.items.map((it, i) => (
                <li key={it.title} className="card hover-card relative overflow-hidden p-6 lg:p-8">
                  <Badge n={(((i % 4) + 1) as 1 | 2 | 3 | 4)} className="absolute right-0 top-0 w-20 rounded-tr-[var(--radius-card)]" />
                  <span className="font-display text-[2.6rem] font-extrabold leading-none tracking-[-0.05em] text-orange">0{i + 1}</span>
                  <h3 className="t-h3 mt-5">{it.title}</h3>
                  <p className="t-body mt-2.5 !text-[16px]">{it.text}</p>
                </li>
              ))}
            </ol>
            <div className="reveal card flex items-center bg-[#fcfbf7] p-5 lg:col-span-4">
              <Img src="/scenes/scene-10-workshop-energia-solare.webp" alt={p.principi.sceneAlt} sizes="(max-width: 1023px) 90vw, 30vw" className="aspect-[4/3] h-auto w-full object-contain" />
            </div>
          </div>
        </div>
      </SectionPanel>

      {/* Perché partecipare? */}
      <SectionPanel data-section="perche" tone="paper" preset="content" family="peach" mirror inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)]">
          <div className="reveal">
            <Eyebrow>{p.perche.eyebrow}</Eyebrow>
            <Headline text={p.perche.title} className="mt-5" />
          </div>
          <ul className="reveal-stagger mt-10 grid gap-4 md:grid-cols-3">
            {p.perche.items.map((it, i) => {
              const Icon = PERCHE_ICONS[i];
              return (
                <li key={it.title} className="card hover-card relative overflow-hidden p-6 sm:p-7">
                  <Badge n={([4, 3, 1] as const)[i]} className="absolute right-0 top-0 w-20 rounded-tr-[var(--radius-card)]" />
                  <span className="grid size-12 place-items-center rounded-full bg-mint text-leaf-text">
                    <Icon className="size-6" strokeWidth={1.9} aria-hidden />
                  </span>
                  <h3 className="t-h3 mt-5">{it.title}</h3>
                  <p className="t-body mt-2 !text-[16px]">{it.text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </SectionPanel>

      {/* Il nostro territorio: landscape + configurations strip */}
      <SectionPanel data-section="territorio" tone="cream" preset="soft" family="sun" inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)]">
          <div className="reveal relative overflow-hidden rounded-[var(--radius-feature)]">
            <Img src="/landscapes/landscape-olive-hills-panorama.webp" alt={p.territorio.landscapeAlt} sizes="(max-width: 1440px) 100vw, 1440px" className="aspect-[4/5] h-auto w-full object-cover sm:aspect-[16/9] lg:aspect-[21/9]" />
            <div className="absolute inset-x-3 bottom-3 rounded-[var(--radius-card)] bg-card/95 p-5 sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-[36rem] sm:p-7">
              <Eyebrow>{p.territorio.eyebrow}</Eyebrow>
              <Headline text={p.territorio.title} size="h3" className="mt-4 !text-[clamp(1.35rem,1rem+1.2vw,1.9rem)]" />
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2" aria-label={p.territorio.eyebrow}>
            {configurations.map((config) => (
              <div key={config.code} className="card min-w-0 p-4 sm:p-5">
                <p className="font-display text-[15px] font-extrabold text-ink">{config.code}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {config.comuni.map((name) => (
                    <li key={name} className="pill !bg-mint !text-[13px]">{name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <Link href={lhref(locale, "/#configurazioni")} className="tlink text-[15px]">
              <span>{p.territorio.mapCta}</span>
              <ArrowRight aria-hidden />
            </Link>
          </div>
        </div>
      </SectionPanel>

      {/* Dodici persone, una cooperativa + team rail */}
      <SectionPanel data-section="team" tone="mint" preset="corner" family="leaf" mirror inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)]">
          <div className="reveal grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>{p.team.eyebrow}</Eyebrow>
              <Headline text={p.team.title} className="mt-5" />
            </div>
            <div className="lg:col-span-5">
              <p className="t-lead">{p.team.lead}</p>
              <ButtonLink href="/team/" locale={locale} variant="dark" className="mt-6 max-sm:w-full">
                {p.team.cta}
              </ButtonLink>
            </div>
          </div>
          <div className="mt-10">
            <TeamRail members={members} locale={locale} photoComing={d.team.section.photoComing} labels={{ region: d.team.page.railLabel, prev: d.team.page.railPrev, next: d.team.page.railNext }} />
          </div>
        </div>
      </SectionPanel>

      {/* Premio CER dell'anno */}
      <SectionPanel data-section="premio" tone="paper" preset="presenter" family="sun" inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)]">
          <Link href={lhref(locale, "/riconoscimenti/")} className="reveal card hover-card group relative grid overflow-hidden lg:grid-cols-12">
            <div className="relative flex min-h-[280px] items-end overflow-hidden bg-peach-light p-8 lg:col-span-5 lg:min-h-[360px]">
              <CornerSunrise className="hc-geo absolute -right-[10%] -top-[8%] w-[80%]" />
              <p className="relative font-display font-extrabold leading-[0.9] tracking-[-0.05em] text-ink">
                <span className="block text-[clamp(2.2rem,1.6rem+2vw,3.4rem)]">CER</span>
                <span className="block text-[clamp(4rem,3rem+4vw,7rem)] text-orange">2024</span>
              </p>
            </div>
            <div className="flex flex-col justify-center p-8 lg:col-span-7 lg:p-14">
              <span className="inline-flex items-center gap-2 self-start rounded-full bg-solar px-3 py-1 text-[13px] font-bold uppercase tracking-[0.06em] text-ink">
                <Award className="size-4" aria-hidden /> {p.premio.badge}
              </span>
              <h2 className="t-h2s mt-5">{p.premio.title}</h2>
              <p className="t-body mt-4 max-w-[34rem]">{p.premio.text}</p>
              <span className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-ink">
                {p.premio.cta} <ArrowRight className="hc-arrow size-4" aria-hidden />
              </span>
            </div>
          </Link>
        </div>
      </SectionPanel>

      <JoinContact d={d.common.joinContact} locale={locale} personAlt={d.common.ui.personAlt} />
    </>
  );
}
