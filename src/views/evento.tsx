import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, Download, MapPin } from "lucide-react";
import { CanvasPanel, Ripple } from "@/components/canvas/Canvas";
import { Img } from "@/components/ui/Img";
import { Eyebrow } from "@/components/ui/primitives";
import { ShareRow } from "@/components/sections/ShareRow";
import { events, getEvent } from "@/content/events";
import { getDict } from "@/content/dict";
import { absoluteUrl, asset } from "@/lib/asset";
import { formatDate, lhref, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";

export const eventoParams = () => events.map(({ slug }) => ({ slug }));
export const eventoMeta = (locale: Locale, slug: string) => {
  const e = getEvent(slug);
  if (!e) return pageMeta(locale, "/eventi/", "Eventi SUN-FAI", "Eventi e incontri della cooperativa SUN-FAI", { noindex: true });
  const description = `${formatDate(e.date, "it")}, ore ${e.startsAt}, ${e.venue}, ${e.city}. ${e.description}`;
  const meta = pageMeta(locale, `/eventi/${e.slug}/`, e.title, description);
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      type: "article" as const,
      images: [{ url: absoluteUrl(e.originalPoster), width: e.city === "Paladina" ? 1456 : 1137, height: e.city === "Paladina" ? 2048 : 1600, alt: `Locandina ufficiale dell'incontro ${e.title}` }],
    },
    twitter: { ...meta.twitter, images: [absoluteUrl(e.originalPoster)] },
  };
};

export function EventoPage({ slug, locale }: { slug: string; locale: Locale }) {
  const event = getEvent(slug);
  if (!event) return null;
  const d = getDict(locale);
  return (
    <>
      <CanvasPanel as="article" tone="paper" data-section="evento" className="cp-first" bg={<><Ripple at={{ x: 1, y: 0 }} family="leafPale" core={0.045} widths={[0.035,0.04]} /><Ripple at={{ x: 0, y: 1 }} family="peachPale" core={0.055} widths={[0.045,0.045]} /></>}>
        <div className="container-x relative z-[2] pb-[clamp(50px,6vw,100px)] pt-6 sm:pt-9">
          <Link href={lhref(locale, "/eventi/")} className="inline-flex min-h-11 items-center gap-2 font-semibold text-ink/75 transition-colors hover:text-ink"><ArrowLeft aria-hidden className="size-4" /> Tutti gli eventi</Link>
          <div className="mt-5 grid items-start gap-8 lg:mt-9 lg:grid-cols-[minmax(0,.92fr)_minmax(0,1fr)] lg:gap-[clamp(32px,5vw,90px)]">
            <div className="lg:sticky lg:top-8">
              <div className="overflow-hidden rounded-[28px] bg-[#F9F7F0] p-4 shadow-[0_8px_35px_-26px_rgb(5_42_34/.4)] ring-1 ring-ink/10 sm:p-6">
                <Img src={event.poster} alt={`Locandina originale: ${event.title} a ${event.city}, ${formatDate(event.date,"it")}`} priority sizes="(max-width: 1023px) 90vw, 42vw" className="mx-auto block h-auto max-h-[min(78svh,970px)] w-auto max-w-full object-contain" />
              </div>
              <a className="mt-3 inline-flex min-h-11 items-center gap-2 text-[14px] font-semibold text-ink hover:text-orange-text" href={asset(event.originalPoster)} target="_blank" rel="noopener noreferrer"><Download aria-hidden className="size-4" /> Apri la locandina originale ad alta risoluzione</a>
            </div>
            <div className="min-w-0 py-2 lg:py-5">
              <Eyebrow>Evento SUN-FAI · {event.city}</Eyebrow>
              <h1 lang="it" className="mt-5 font-display text-[clamp(2.5rem,1.7rem+3vw,5.25rem)] font-extrabold leading-[1.04] tracking-[-.055em] text-ink">{event.title}</h1>
              <p className="mt-5 max-w-[56ch] text-[clamp(1.08rem,.94rem+.35vw,1.35rem)] leading-relaxed text-slate">{event.description}</p>
              <div className="mt-7 grid gap-4 rounded-[26px] bg-white p-5 shadow-[0_2px_15px_-10px_rgb(5_42_34/.18)] ring-1 ring-ink/10 sm:p-7">
                <div className="flex items-start gap-3"><CalendarDays aria-hidden className="mt-0.5 size-5 shrink-0 text-orange-text"/><span><strong className="block text-[13px] font-bold uppercase tracking-wider text-orange-text">Quando</strong><time dateTime={event.date} lang="it" className="text-[18px] font-bold capitalize text-ink">{event.weekday} {formatDate(event.date,"it")}</time></span></div>
                <div className="flex items-start gap-3"><Clock3 aria-hidden className="mt-0.5 size-5 shrink-0 text-orange-text"/><span><strong className="block text-[13px] font-bold uppercase tracking-wider text-orange-text">Orario</strong><span className="text-[18px] font-bold text-ink">Ore {event.startsAt}</span></span></div>
                <div className="flex items-start gap-3"><MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-orange-text"/><span><strong className="block text-[13px] font-bold uppercase tracking-wider text-orange-text">Dove</strong><span className="text-[18px] font-bold text-ink">{event.venue}<span className="block text-[16px] font-normal text-slate">{event.city} (BG)</span></span></span></div>
                {event.admission && <p className="rounded-2xl bg-[#EAF2DD] px-4 py-3 text-[15px] font-bold text-[#347628]">{event.admission}</p>}
                {event.audience && <p className="rounded-2xl bg-[#EAF2DD] px-4 py-3 text-[15px] font-bold text-[#347628]">{event.audience}</p>}
              </div>
              <section aria-labelledby="event-description" className="mt-10">
                <h2 id="event-description" className="font-display text-[clamp(1.65rem,1.3rem+1vw,2.3rem)] font-extrabold leading-tight tracking-[-.03em] text-ink">I temi dell’incontro</h2>
                <ul lang="it" className="mt-5 grid gap-4 text-[16px] leading-[1.7] text-slate">
                  {event.topics.map((note) => <li key={note} className="flex gap-3"><span aria-hidden className="mt-[10px] size-2 shrink-0 rounded-full bg-[#478A2B]" />{note}</li>)}
                </ul>
                {event.city === "Paladina" && <p className="mt-5 text-[13px] leading-relaxed text-slate">La locandina riporta che la possibilità di partecipare alla configurazione riguarda soltanto una parte del Comune.</p>}
              </section>
              {locale === "lmo" && <p className="mt-5 text-[14px] text-slate">Informazioni sull’evento in italiano.</p>}
              <div className="mt-8 border-t border-ink/10 pt-6"><p className="mb-3 text-[14px] font-bold text-ink">Condividi questo evento</p><ShareRow title={event.title} url={absoluteUrl(lhref(locale, `/eventi/${event.slug}/`))} labels={{ share: d.pages.notizie.share, copy: d.pages.notizie.copyLink, copied: d.pages.notizie.copied }} /></div>
              <Link href={lhref(locale, "/eventi/")} className="tlink mt-8">Scopri gli altri incontri <ArrowRight aria-hidden className="size-4" /></Link>
            </div>
          </div>
        </div>
      </CanvasPanel>
    </>
  );
}
