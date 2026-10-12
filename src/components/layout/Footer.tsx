import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronDown, Mail } from "lucide-react";
import { CanvasPanel, Confetto, PanelMascot, Ripple } from "@/components/canvas/Canvas";
import { Headline } from "@/components/ui/primitives";
import { Img } from "@/components/ui/Img";
import { FacebookIcon, InstagramIcon, LinkedinIcon } from "@/components/ui/SocialIcons";
import { FooterLangSwitch } from "./FooterLangSwitch";
import { lhref, type Locale } from "@/lib/i18n";
import { documentUrl, site, social } from "@/lib/site";
import { asset } from "@/lib/asset";
import type { Dict } from "@/content/dict";
import review from "@/content/lmo/review.json";

/** "Traduzione in bergamàsch in revisione" stays until every string is reviewed (pack 14.1 §8). */
const lmoPending = Object.values(review as Record<string, { reviewed: boolean }>).some((r) => !r.reviewed);

type Lnk = { label: string; href: string; ext?: boolean };
const ON_LEAF_FAN = ["#FECF49", "#FFFFFF", "#F26A1B", "#C9E1A0", "#FECF49", "#FFFFFF", "#FE9845"];

/**
 * Footer, V3 (16.7 / mockup 05): ONE statement canvas panel in leafDeep #3F7A27, white text. CTA row ("Accendi la
 * comunità."), the waving mascot bottom-right in front of an onLeaf fan ripple (no person), a strict 5-column link
 * grid (brand + 4 groups, 15 px links, 36 px rows, yellow 12.5 px titles), legal row with the "Italiano |
 * Bergamàsch" segmented control. Phones: stacked CTA, accordion groups (48 px), language control full width.
 * Bottom padding clears the dock.
 */
export function Footer({ d, locale }: { d: Dict; locale: Locale }) {
  const n = d.common.nav;
  const f = d.common.footer;
  const it = locale === "lmo" && d.common.ui.inItalian ? ` ${d.common.ui.inItalian}` : "";
  const cols: { title: string; links: Lnk[] }[] = [
    {
      title: f.cols.cooperativa,
      links: [
        { label: n.chiSiamo, href: "/chi-siamo/" },
        { label: n.cosaFacciamo, href: "/cosa-facciamo/" },
        { label: n.team, href: "/team/" },
        { label: n.riconoscimenti, href: "/riconoscimenti/" },
        { label: n.notizie, href: "/notizie/" },
      ],
    },
    {
      title: f.colCer,
      links: [
        { label: f.cosaSono, href: "/le-cer/" },
        { label: f.configurazioni, href: "/#configurazioni" },
        { label: f.verifica, href: "/#verifica" },
        { label: f.faq, href: "/le-cer/#faq" },
      ],
    },
    {
      title: f.colArdake,
      links: [
        { label: f.accedi, href: "/ardake/" },
        { label: f.monitoraggio, href: "/ardake/monitoraggio/" },
        { label: f.demo, href: "/ardake/demo/" },
      ],
    },
    {
      title: f.cols.partecipa,
      links: [
        { label: n.diventaSocio, href: "/diventa-socio/" },
        { label: f.compilazione, href: "/diventa-socio/compilazione/" },
        { label: `${f.statuto}${it}`, href: documentUrl("statuto"), ext: true },
        { label: `${f.regolamento}${it}`, href: documentUrl("regolamento"), ext: true },
      ],
    },
  ];

  const linkCls = "inline-flex min-h-11 min-w-11 items-center gap-1 text-[15px] text-white transition-colors hover:text-[#FECF49] lg:min-h-9";
  const renderLink = (l: Lnk) =>
    l.ext ? (
      <a href={l.href.startsWith("/") ? asset(l.href) : l.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
        {l.label}
        <ArrowUpRight className="size-3.5" aria-hidden />
      </a>
    ) : (
      <Link href={lhref(locale, l.href)} className={linkCls}>
        {l.label}
      </Link>
    );

  return (
    <footer className="relative isolate">
      <CanvasPanel
        as="div"
        tone="leafDeep"
        phoneUnit={1.4}
        className="pb-[calc(var(--dock-h,64px)+24px+var(--safe-b,0px))] lg:pb-[calc(64px+40px)]"
        bg={
          <>
            <Ripple at={{ x: 1, y: 1 }} family="onLeaf" core={0.05} widths={[0.08, 0.08, 0.08, 0.08]} fan={{ count: 7, from: 92, to: 178, colors: ON_LEAF_FAN, bandColor: "#5E9638" }} />
            <Ripple at={{ x: 0, y: 0 }} family="onLeaf" core={0.03} widths={[0.03, 0.03]} bands={2} />
            <Ripple at={{ x: 1, y: 0 }} hideSm family="onLeaf" core={0.02} widths={[0.01]} bands={1} noCore seg={{ r0: 0.06, r1: 0.1, from: 182, to: 268, count: 7, colors: ["#FECF49", "#C9E1A0", "#FE9845"] }} />
            <Confetto at={{ x: 0.74, y: 0.02 }} r={0.022} fill="#C9E1A0" hideSm />
            <Confetto at={{ x: 0, y: 0.6 }} r={0.022} fill="#F26A1B" />
          </>
        }
      >
        <div className="container-x relative z-[2] pt-12 lg:pt-16">
          {/* CTA row */}
          <div className="flex items-start justify-between gap-4 max-lg:pr-[36%]">
            <div>
              <Headline text={f.ctaTitle} size="h2" className="!text-white" />
              <p className="mt-3 font-display text-[clamp(1.25rem,1rem+.8vw,1.65rem)] font-bold tracking-[-0.02em] text-[#E7F0D8]">{f.ctaSub}</p>
              <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-5">
                <Link href={lhref(locale, "/diventa-socio/")} className="btn btn--primary btn--lg">
                  {n.diventaSocio}
                  <ArrowRight aria-hidden strokeWidth={2.2} className="btn-arrow" />
                </Link>
                <Link href={lhref(locale, "/contatti/")} className="btn btn--lg !bg-transparent !text-white !shadow-[inset_0_0_0_1.5px_#fff]">
                  {f.write}
                </Link>
              </div>
            </div>
          </div>

          {/* link grid: brand + 4 groups (desktop) · accordions (phones) */}
          <div className="mt-12 grid gap-8 lg:mr-[300px] lg:grid-cols-[1.3fr_1fr_1.25fr_.8fr_1.2fr] lg:gap-6">
            <div>
              <Link href={lhref(locale, "/")} aria-label={n.logoAria} className="inline-flex rounded-[16px] bg-[#FFF8EC] px-3 py-2">
                <Img src="/brand/sunfai-logo.png" alt="" sizes="200px" className="h-11 w-auto" />
              </Link>
              <address className="mt-4 text-[14px] not-italic leading-relaxed text-[#F2F8EC]">
                {site.legalName}
                <br />
                {site.address.street}, {site.address.postalCode} {site.address.city} ({site.address.province})
              </address>
              <div className="mt-4 flex gap-2.5">
                <a href={social.instagram.url} target="_blank" rel="noopener noreferrer" aria-label={social.instagram.label} className="grid size-11 place-items-center rounded-full text-white shadow-[inset_0_0_0_1.5px_rgb(255_255_255/.6)] hover:bg-white/10">
                  <InstagramIcon className="size-5" />
                </a>
                <a href={social.linkedin.url} target="_blank" rel="noopener noreferrer" aria-label={social.linkedin.label} className="grid size-11 place-items-center rounded-full text-white shadow-[inset_0_0_0_1.5px_rgb(255_255_255/.6)] hover:bg-white/10">
                  <LinkedinIcon className="size-[18px]" />
                </a>
                <a href={social.facebook.url} target="_blank" rel="noopener noreferrer" aria-label={social.facebook.label} className="grid size-11 place-items-center rounded-full text-white shadow-[inset_0_0_0_1.5px_rgb(255_255_255/.6)] hover:bg-white/10">
                  <FacebookIcon className="size-[18px]" />
                </a>
                <a href={`mailto:${site.email}`} aria-label={site.email} className="grid size-11 place-items-center rounded-full text-white shadow-[inset_0_0_0_1.5px_rgb(255_255_255/.6)] hover:bg-white/10">
                  <Mail className="size-[18px]" aria-hidden />
                </a>
              </div>
            </div>

            {cols.map((c) => (
              <div key={c.title}>
                <details className="group border-b border-white/20 lg:hidden">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between font-display text-[1.05rem] font-extrabold tracking-[-0.02em] text-white [&::-webkit-details-marker]:hidden">
                    {c.title}
                    <ChevronDown className="size-5 transition-transform group-open:rotate-180" aria-hidden />
                  </summary>
                  <ul className="grid pb-3">
                    {c.links.map((l) => (
                      <li key={l.label}>{renderLink(l)}</li>
                    ))}
                  </ul>
                </details>
                <div className="hidden lg:block">
                  <p className="text-[12.5px] font-bold uppercase tracking-[0.1em] text-[#FECF49]">{c.title}</p>
                  <ul className="mt-3 grid">
                    {c.links.map((l) => (
                      <li key={l.label}>{renderLink(l)}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* legal row */}
          <div className="mt-10 flex flex-col gap-4 border-t border-white/20 pt-5 text-[13.5px] text-[#F2F8EC] lg:mr-[260px] lg:flex-row lg:items-center lg:gap-8">
            <p>
              {f.vat} {site.vat} · {f.rights}
            </p>
            <Link href={lhref(locale, "/note-legali/")} className="inline-flex min-h-11 items-center text-white underline-offset-4 hover:underline">
              {f.legal}
            </Link>
            <a href={site.adminUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1 text-white underline-offset-4 hover:underline">
              {f.areaRiservata}
              <ArrowUpRight className="size-3.5" aria-hidden />
            </a>
            {f.reviewNote && lmoPending ? <p className="font-semibold text-white">{f.reviewNote}</p> : null}
            <div className="lg:ml-auto">
              <FooterLangSwitch t={n} locale={locale} />
            </div>
          </div>
        </div>
        <PanelMascot
          src="/mascot/mascot-09-waving-wink.webp"
          alt=""
          sizes="(max-width: 1023px) 160px, 250px"
          className="right-[5%] top-10 w-[clamp(120px,30cqw,160px)] lg:bottom-[calc(64px+40px)] lg:right-[7%] lg:top-auto lg:w-[250px]"
        />
      </CanvasPanel>
    </footer>
  );
}
