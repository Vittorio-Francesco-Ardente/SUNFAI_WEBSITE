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
import { Confetto, HalfDisc, Ripple } from "@/components/canvas/Canvas";
import { PageHero } from "@/components/sections/PageHero";
import { SocialFeed } from "@/components/social/SocialFeed";
import { JoinContact } from "@/components/sections/JoinContact";
import { InstagramIcon, LinkedinIcon } from "@/components/ui/SocialIcons";
import { social } from "@/lib/site";

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
        side="left"
        bg={
          <>
            <Ripple at={{ x: 0, y: 0.55 }} atSm={{ x: 0, y: 0.72 }} family="peach" core={0.12} widths={[0.11, 0.06, 0.07, 0.08]} fan={{ count: 10, from: -86, to: 86 }} scaleSm={1.3} />
            <Ripple at={{ x: 1, y: 0 }} family="leaf" core={0.035} widths={[0.03, 0.03]} bands={2} />
            <HalfDisc at={{ x: 0.62, y: 1 }} r={0.028} edge="bottom" fill="#F5C335" hideSm />
          </>
        }
        visual={
          <div className="flex h-full items-center justify-center px-[var(--gutter)] pb-8 pt-3 lg:justify-end lg:pr-[clamp(26px,3vw,42px)] lg:pb-0">
            <div className="relative aspect-[4/4.2] w-full max-w-[470px] overflow-hidden rounded-[34px] border border-[rgb(5_42_34/.08)] bg-[#F7EAC3] shadow-[0_28px_50px_-34px_rgb(5_42_34/.30)]">
              <div className="absolute -right-[9%] -top-[10%] h-[58%] w-[58%] rounded-full border-[24px] border-[#F7D04B] opacity-45" />
              <div className="absolute right-[8%] top-[12%] h-[32%] w-[32%] rounded-full border-[20px] border-[#F6E6B5] opacity-95" />
              <div className="absolute -left-[18%] bottom-[-22%] h-[64%] w-[64%] rounded-full border-[22px] border-[#FFF8E8] opacity-95" />
              <div className="absolute left-[9%] top-[12%] rounded-full border border-[#A9C879] bg-[#FFFDF7] px-4 py-2 text-[clamp(14px,1.4vw,18px)] font-semibold text-leafDeep shadow-[0_12px_24px_-20px_rgb(5_42_34/.35)]">La comunità è fatta di persone.</div>
              <Img src="/mascot/mascot-04-idea-pointing.webp" alt={d.common.ui.mascotAlt} sizes="(max-width: 1023px) 70vw, 28vw" className="absolute bottom-0 right-[4%] z-[2] h-[79%] w-auto max-w-none object-contain object-bottom" />
            </div>
          </div>
        } />

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

      <SectionPanel data-section="social" tone="mint" preset="content" family="leaf" mirror inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)]">
          <div className="reveal mb-10 grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>{p.socialEyebrow}</Eyebrow>
              <Headline text={p.socialTitle} className="mt-5" />
            </div>
            <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
              <ButtonLink href={social.instagram.url} variant="dark" icon="external">
                <InstagramIcon className="mr-[-.2em]" />
                {social.instagram.label}
              </ButtonLink>
              <ButtonLink href={social.linkedin.url} variant="outline" icon="external">
                <LinkedinIcon className="mr-[-.2em]" />
                {social.linkedin.label}
              </ButtonLink>
            </div>
          </div>
          <SocialFeed t={d.home.social} ui={d.common.ui} locale={locale} mode="latest-per-channel" />
        </div>
      </SectionPanel>

      <JoinContact d={d.common.joinContact} locale={locale} personAlt={d.common.ui.personAlt} />
    </>
  );
}
