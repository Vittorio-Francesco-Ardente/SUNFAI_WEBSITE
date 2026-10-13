import Link from "next/link";
import { ArrowRight, ArrowUpRight, Mail, MapPin, Receipt } from "lucide-react";
import { getDict } from "@/content/dict";
import { pageMeta } from "@/lib/meta";
import { lhref, type Locale } from "@/lib/i18n";
import { site, social } from "@/lib/site";
import { Eyebrow, Headline, plainHeadline } from "@/components/ui/primitives";
import { Img } from "@/components/ui/Img";
import { Badge } from "@/components/geometry/shapes";
import { InstagramIcon, LinkedinIcon } from "@/components/ui/SocialIcons";
import { SectionPanel } from "@/components/canvas/presets";
import { CanvasPanel, HalfDisc, Person, Ripple } from "@/components/canvas/Canvas";
import { ContactForm } from "@/components/sections/ContactForm";

export const contattiMeta = (locale: Locale) => {
  const p = getDict(locale).pages.contatti;
  return pageMeta(locale, "/contatti/", p.meta.title, p.meta.description);
};

export function ContattiPage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const p = d.pages.contatti;
  const row = "flex min-h-[64px] items-center gap-4 rounded-2xl bg-card p-4 shadow-[0_0_0_1px_var(--color-hairline)] transition-colors hover:shadow-[0_0_0_1px_rgb(5_42_34/.2)]";

  return (
    <>
      {/* Hero (16.8 Contatti): mint canvas — piazza photo left, text centre, Simone on the right edge in front of a leaf ripple */}
      <CanvasPanel
        tone="mint"
        data-section="hero"
        phoneUnit={1.6}
        className="hero-scope cp-first flex flex-col lg:block lg:min-h-[min(780px,max(620px,calc(100svh-24px)))]"
        bg={
          <>
            <Ripple at={{ x: 1, y: 0.5 }} atSm={{ x: 1, y: 0.8 }} scaleSm={1.1} family="leaf" core={0.1} widths={[0.11, 0.06, 0.06, 0.07]} fan={{ count: 10, from: 92, to: 268 }} />
            <Ripple at={{ x: 0, y: 1 }} family="sun" core={0.045} widths={[0.04, 0.04]} bands={2} />
            <HalfDisc at={{ x: 0.42, y: 1 }} r={0.026} edge="bottom" fill="#F26A1B" hideSm />
          </>
        }
      >
        <div className="container-x relative z-[2] grid gap-8 pb-8 pt-6 sm:pt-10 lg:min-h-[inherit] lg:grid-cols-12 lg:items-center lg:gap-10 lg:pb-16 lg:pt-4">
          <Img src="/landscapes/landscape-piazza-courtyard-tree.webp" alt={d.team.page.visitAlt} priority sizes="(max-width: 1023px) 100vw, 30vw" className="order-2 aspect-[4/3] h-auto w-full rounded-[28px] object-cover lg:order-1 lg:col-span-3 lg:aspect-[3/4.4]" />
          <div className="order-1 min-w-0 lg:order-2 lg:col-span-5 xl:col-span-4">
            <Eyebrow className="enter">{p.hero.eyebrow}</Eyebrow>
            <Headline text={p.hero.title} as="h1" size="h1" className="is-in mt-5 lg:!text-[clamp(3.2rem,.6rem+4.4vw,5.6rem)]" />
            <p className="t-lead mt-5">{p.hero.lead}</p>
            <div className="mt-6 rounded-[22px] bg-white/90 p-5">
              <p className="font-display text-[1.2rem] font-extrabold tracking-[-0.02em] text-ink">{plainHeadline(d.team.page.visitTitle)}</p>
              <p className="mt-1 text-[16px] text-slate">{d.team.page.visitText}</p>
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn--dark btn--md mt-4">
                <MapPin aria-hidden className="mr-[-.2em]" />
                {p.quick.map}
                <ArrowUpRight aria-hidden strokeWidth={2.2} />
              </a>
            </div>
          </div>
        </div>
        <div className="cp-stage relative lg:static" style={{ ["--sm-h" as string]: "clamp(320px, 96cqw, 480px)" }}>
          <Person src="/people/simone-mazzoleni.webp" alt={d.common.ui.personAlt.replace("{name}", "Simone Mazzoleni")} sizes="(max-width: 1023px) 90vw, 30vw" className="left-1/2 h-[125%] -translate-x-1/2 translate-y-[22%] lg:left-auto lg:right-[0%] lg:h-[82%] lg:translate-x-0" />
        </div>
      </CanvasPanel>

      <SectionPanel data-section="contatti" tone="paper" preset="content" family="peach" inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)] grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* quick contacts first on phones */}
          <div className="lg:col-span-5">
            <ul className="grid gap-3">
              <li>
                <a href={`mailto:${site.email}`} className={row}>
                  <span className="grid size-11 place-items-center rounded-full bg-peach-light text-orange-text">
                    <Mail className="size-5" aria-hidden />
                  </span>
                  <span className="flex-1">
                    <span className="block text-[13px] font-semibold uppercase tracking-[0.1em] text-slate">{p.quick.email}</span>
                    <span className="block font-semibold text-ink">{site.email}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className={row}>
                  <span className="grid size-11 place-items-center rounded-full bg-mint text-leaf-text">
                    <MapPin className="size-5" aria-hidden />
                  </span>
                  <span className="flex-1">
                    <span className="block text-[13px] font-semibold uppercase tracking-[0.1em] text-slate">{p.quick.sede}</span>
                    <span className="block font-semibold text-ink">
                      {site.address.street}, {site.address.postalCode} {site.address.city} ({site.address.province})
                    </span>
                  </span>
                  <ArrowUpRight className="size-4 text-ink/40" aria-hidden />
                </a>
              </li>
              <li className={row}>
                <span className="grid size-11 place-items-center rounded-full bg-[#FDF0C8] text-ink">
                  <Receipt className="size-5" aria-hidden />
                </span>
                <span>
                  <span className="block text-[13px] font-semibold uppercase tracking-[0.1em] text-slate">{p.quick.vat}</span>
                  <span className="block font-semibold text-ink">
                    {site.legalName} · P.IVA {site.vat}
                  </span>
                </span>
              </li>
            </ul>
            <div className="mt-5 flex gap-3">
              <a href={social.instagram.url} target="_blank" rel="noopener noreferrer" aria-label={p.instagramAria} className="paper-round paper-round--dark">
                <InstagramIcon className="size-5" />
              </a>
              <a href={social.linkedin.url} target="_blank" rel="noopener noreferrer" aria-label={p.linkedinAria} className="paper-round paper-round--dark">
                <LinkedinIcon className="size-[18px]" />
              </a>
            </div>
            <div className="card mt-8 hidden overflow-hidden bg-[#fcfbf7] p-5 lg:block">
              <Img src="/scenes/scene-07-supporto-videochiamata.webp" alt={p.prima.sceneAlt} sizes="34vw" className="aspect-[4/3] h-auto w-full object-contain" />
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="card relative overflow-hidden p-6 sm:p-10 lg:p-12" id="scrivici">
              <Badge n={2} className="absolute right-0 top-0 w-24 rounded-tr-[var(--radius-card)]" />
              <Headline text={p.form.title} size="h2s" />
              <p className="t-body mt-3">{p.form.text}</p>
              <div className="mt-8">
                <ContactForm t={p.form} email={site.email} locale={locale} />
              </div>
            </div>
          </div>
        </div>
      </SectionPanel>

      <SectionPanel data-section="prima" tone="cream" preset="soft" family="sun" inner={false}>
        <div className="relative z-[2] px-6 py-[clamp(48px,6vw,88px)] sm:px-10 lg:px-14">
          <div className="mx-auto grid max-w-[var(--container)] items-center gap-8 lg:grid-cols-12">
            <p className="font-display text-[clamp(1.5rem,1.1rem+1.2vw,2.2rem)] font-extrabold leading-tight tracking-[-0.03em] text-ink lg:col-span-5">{p.prima.title}</p>
            <ul className="grid gap-3 sm:grid-cols-3 lg:col-span-7">
              {p.prima.links.map((l) => (
                <li key={l.href}>
                  <Link href={lhref(locale, l.href)} className="card hover-card flex h-full min-h-[56px] items-center gap-3 p-5">
                    <span className="flex-1">
                      <span className="block font-display text-[1.1rem] font-extrabold leading-tight tracking-[-0.02em] text-ink">{l.t}</span>
                      <span className="mt-1 block text-[14px] text-slate">{l.d}</span>
                    </span>
                    <ArrowRight className="hc-arrow size-5" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionPanel>
    </>
  );
}
