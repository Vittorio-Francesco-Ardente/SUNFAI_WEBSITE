import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getDict } from "@/content/dict";
import { articles } from "@/content/news";
import { pageMeta } from "@/lib/meta";
import { formatDate, lhref, type Locale } from "@/lib/i18n";
import { ButtonLink, Eyebrow, Headline, TextLink } from "@/components/ui/primitives";
import { Badge } from "@/components/geometry/shapes";
import { Img } from "@/components/ui/Img";
import { SectionPanel } from "@/components/canvas/presets";
import { HalfDisc, Ripple } from "@/components/canvas/Canvas";
import { PageHero } from "@/components/sections/PageHero";
import { SocialFeed } from "@/components/social/SocialFeed";
import { JoinContact } from "@/components/sections/JoinContact";

export const notizieMeta = (locale: Locale) => {
  const p = getDict(locale).pages.notizie;
  return pageMeta(locale, "/notizie/", p.meta.title, p.meta.description);
};

export function NotiziePage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const p = d.pages.notizie;
  const [featured, ...rest] = [...articles].sort((a, b) => b.date.localeCompare(a.date));
  const inIt = d.common.ui.inItalian;

  return (
    <>
      <PageHero eyebrow={p.hero.eyebrow} title={p.hero.title} lead={p.hero.lead} tone="peach"
        side="right"
        bg={
          <>
            <Ripple at={{ x: 1, y: 0.56 }} atSm={{ x: 0.5, y: 0.84 }} family="peach" core={0.07} widths={[0.075, 0.055, 0.055, 0.06]} bands={3} scaleSm={1.05} />
            <Ripple at={{ x: 0, y: 0 }} family="leafPale" core={0.035} widths={[0.03]} bands={1} />
            <HalfDisc at={{ x: 0.62, y: 1 }} r={0.028} edge="bottom" fill="#F5C335" hideSm />
          </>
        }
        mascot={{ src: "/mascot/mascot-04-idea-pointing.webp", alt: "Mascotte SUN-FAI che presenta una notizia", centeredInRipple: true }} />

      <SectionPanel data-section="articoli" tone="paper" preset="corner" family="leaf" inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)]">
          {inIt ? <p className="t-meta mb-4">{inIt}</p> : null}
          <Link href={lhref(locale, `/notizie/${featured.slug}/`)} className="reveal card hover-card group grid overflow-hidden lg:grid-cols-12">
            <span className="relative block overflow-hidden lg:col-span-7">
              <Img src={featured.image.src} alt={featured.image.alt} sizes="(max-width: 1023px) 100vw, 56vw" className="hc-scene aspect-[16/10] h-full w-full object-cover" />
            </span>
            <span className="relative flex flex-col justify-center p-7 lg:col-span-5 lg:p-12">
              <Badge n={1} className="absolute right-0 top-0 w-24" />
              <span className="text-[14px] font-semibold text-orange-text">
                {p.featured} · {formatDate(featured.date, locale)}
              </span>
              <span lang="it" className="mt-4 font-display text-[clamp(1.8rem,1.3rem+1.6vw,2.8rem)] font-extrabold leading-[1.04] tracking-[-0.035em] text-ink">
                {featured.title}
              </span>
              <span lang="it" className="t-body mt-4 line-clamp-4">{featured.paragraphs[0]}</span>
              <span className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-ink">
                {p.readMore} <ArrowRight className="hc-arrow size-4" aria-hidden />
              </span>
            </span>
          </Link>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:mt-8">
            {rest.map((a) => (
              <li key={a.slug} className="reveal">
                <Link href={lhref(locale, `/notizie/${a.slug}/`)} className="card hover-card group flex h-full flex-col overflow-hidden">
                  <span className="block overflow-hidden">
                    <Img src={a.image.src} alt={a.image.alt} sizes="(max-width: 639px) 100vw, 46vw" className="hc-scene aspect-[16/9] h-auto w-full object-cover" />
                  </span>
                  <span className="flex flex-1 flex-col p-6">
                    <span className="text-[14px] font-semibold text-orange-text">{formatDate(a.date, locale)}</span>
                    <span lang="it" className="t-h3 mt-2">{a.title}</span>
                    <span lang="it" className="t-body mt-2 line-clamp-3 !text-[16px]">{a.paragraphs[0]}</span>
                    <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-3 font-semibold text-ink">
                      {p.readMore} <ArrowRight className="hc-arrow size-4" aria-hidden />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <TextLink href="/riconoscimenti/" locale={locale} className="mt-8">
            {p.awards}
          </TextLink>
        </div>
      </SectionPanel>

      <SectionPanel data-section="eventi" tone="cream" preset="soft" family="sun" inner={false}>
        <div className="container-x relative z-[2] flex flex-col gap-5 py-[clamp(42px,5vw,70px)] md:flex-row md:items-center md:justify-between">
          <div>
            <Eyebrow>Appuntamenti</Eyebrow>
            <Headline text="Gli eventi *SUN-FAI*" size="h2s" className="mt-4" />
            <p className="t-body mt-3 max-w-[60ch]">Due incontri sul territorio con locandine, date, luoghi e approfondimenti. Scopri i prossimi appuntamenti e l’archivio di quelli conclusi.</p>
          </div>
          <ButtonLink href="/eventi/" locale={locale} variant="dark" className="shrink-0 self-start">Scopri gli eventi</ButtonLink>
        </div>
      </SectionPanel>

      <SectionPanel data-section="social" tone="mint" preset="content" family="leaf" mirror inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)]">
          <div className="reveal mb-10 text-center">
            <Eyebrow className="justify-center">{p.socialEyebrow}</Eyebrow>
            <Headline text={p.socialTitle} className="mx-auto mt-5" />
          </div>
          <SocialFeed t={d.home.social} ui={d.common.ui} locale={locale} mode="latest-per-channel" />
        </div>
      </SectionPanel>

      <JoinContact d={d.common.joinContact} locale={locale} personAlt={d.common.ui.personAlt} />
    </>
  );
}
