import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getDict } from "@/content/dict";
import { articles, getArticle } from "@/content/news";
import { pageMeta } from "@/lib/meta";
import { formatDate, lhref, type Locale } from "@/lib/i18n";
import { absoluteUrl, asset } from "@/lib/asset";
import { Eyebrow } from "@/components/ui/primitives";
import { Img } from "@/components/ui/Img";
import { CanvasPanel, Ripple } from "@/components/canvas/Canvas";
import { ShareRow } from "@/components/sections/ShareRow";
import { SectionPanel } from "@/components/canvas/presets";

/** Old sun-fai.org URLs /notizie/3|4|5: static meta-refresh pages to the news list (mapping unknown — TODO_SUNFAI). */
const LEGACY = ["3", "4", "5"];

export const articleParams = () => [...articles.map((a) => ({ slug: a.slug })), ...LEGACY.map((slug) => ({ slug }))];

export const articleMeta = (locale: Locale, slug: string) => {
  const a = getArticle(slug);
  if (!a) return { ...pageMeta(locale, "/notizie/", getDict(locale).pages.notizie.meta.title, getDict(locale).pages.notizie.meta.description, { noindex: true }), alternates: { canonical: absoluteUrl(lhref(locale, "/notizie/")) } };
  return pageMeta(locale, `/notizie/${a.slug}/`, a.title, a.paragraphs[0].slice(0, 155));
};

export function ArticlePage({ locale, slug }: { locale: Locale; slug: string }) {
  const d = getDict(locale);
  const p = d.pages.notizie;
  const a = getArticle(slug);

  if (!a) {
    const target = asset(lhref(locale, "/notizie/"));
    return (
      <section data-section="redirect" className="sf-section section-y">
        <meta httpEquiv="refresh" content={`0; url=${target}`} />
        <link rel="canonical" href={absoluteUrl(lhref(locale, "/notizie/"))} />
        <div className="container-x">
          <p className="t-lead">{p.redirect}</p>
          <a href={target} className="btn btn--primary btn--md mt-6">
            {p.redirectCta}
          </a>
        </div>
      </section>
    );
  }

  const others = articles.filter((x) => x.slug !== a.slug);
  return (
    <>
      <CanvasPanel as="article" tone="paper" data-section="article" className="cp-first" bg={<><Ripple at={{ x: 1, y: 0 }} family="peach" core={0.035} widths={[0.04, 0.04]} bands={2} /><Ripple at={{ x: 0, y: 1 }} family="leafPale" core={0.06} widths={[0.04]} /></>}>
        <div className="container-x relative z-[2] pb-[clamp(56px,8vw,120px)] pt-6 sm:pt-10">
          <Link href={lhref(locale, "/notizie/")} className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ink/75 hover:text-ink">
            <ArrowLeft className="size-4" aria-hidden /> {p.back}
          </Link>
          <div className="mx-auto mt-6 max-w-[68ch]">
            <Eyebrow>
              <time dateTime={a.date}>{formatDate(a.date, locale)}</time>
            </Eyebrow>
            <h1 lang="it" className="t-h2 mt-5 hl-anim is-in">
              <span className="hl-line">
                <span>{a.title}</span>
              </span>
            </h1>
            {d.common.ui.inItalian ? <p className="t-meta mt-3">{d.common.ui.inItalian}</p> : null}
          </div>
          <figure className="mx-auto mt-8 max-w-[1100px] max-sm:-mx-[var(--gutter)]">
            <Img src={a.image.src} alt={a.image.alt} priority sizes="(max-width: 1100px) 100vw, 1100px" className="aspect-[16/9] h-auto w-full object-cover sm:rounded-[var(--radius-feature)]" />
          </figure>
          <div lang="it" className="prose-mobile mx-auto mt-10 grid max-w-[68ch] gap-5 text-[17px] leading-[1.7] text-ink/85 sm:text-[19px]">
            {a.paragraphs.map((t) => (
              <p key={t}>{t}</p>
            ))}
            {a.source ? (
              <p className="text-[15px] font-semibold text-orange-text">
                {d.common.ui.sourceLabel}: {a.source}
              </p>
            ) : null}
          </div>
          <div className="mx-auto mt-8 max-w-[68ch]">
            <ShareRow url={absoluteUrl(lhref(locale, `/notizie/${a.slug}/`))} title={a.title} labels={{ share: p.share, copy: p.copyLink, copied: p.copied }} />
          </div>
        </div>
      </CanvasPanel>

      <SectionPanel data-section="related" tone="cream" preset="corner" family="sun" inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)]">
          <h2 className="t-h2s">{p.related}</h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-2">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={lhref(locale, `/notizie/${o.slug}/`)} className="card hover-card flex h-full items-center gap-4 overflow-hidden p-3 pr-5">
                  <Img src={o.image.src} alt="" aria-hidden sizes="120px" className="aspect-square w-24 shrink-0 rounded-[16px] object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-semibold text-orange-text">{formatDate(o.date, locale)}</span>
                    <span lang="it" className="block font-display text-[1.05rem] font-extrabold leading-tight tracking-[-0.02em] text-ink">{o.title}</span>
                  </span>
                  <ArrowRight className="hc-arrow size-5 shrink-0" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <Link href={lhref(locale, "/notizie/")} className="tlink mt-8">
            <span>{p.all}</span>
            <ArrowRight aria-hidden />
          </Link>
        </div>
      </SectionPanel>
    </>
  );
}
