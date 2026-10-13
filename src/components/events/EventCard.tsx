import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock3, MapPin } from "lucide-react";
import { Img } from "@/components/ui/Img";
import { formatDate, lhref, type Locale } from "@/lib/i18n";
import type { SunfaiEvent } from "@/content/events";

/** Poster preserved without cropping; the detail page shows the original at full resolution. */
export function EventCard({ event, locale, past = false }: { event: SunfaiEvent; locale: Locale; past?: boolean }) {
  return (
    <Link href={lhref(locale, `/eventi/${event.slug}/`)} className="group block h-full rounded-[28px] bg-white shadow-[0_1px_0_rgb(5_42_34/.11),0_12px_28px_-24px_rgb(5_42_34/.3)] ring-1 ring-ink/10 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgb(5_42_34/.35)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink motion-reduce:transform-none" aria-label={`${event.title}, ${event.city}, ${formatDate(event.date, "it")}, ore ${event.startsAt}. Apri i dettagli dell'evento`}>
      <article className="grid h-full min-w-0 overflow-hidden rounded-[28px] sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:grid-cols-1 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1fr)]">
        <div className="relative flex h-[320px] items-center justify-center overflow-hidden bg-[#F7F5EE] p-3 sm:h-auto sm:min-h-[320px] lg:h-[340px] xl:h-auto">
          <Img src={event.poster} alt={`Locandina dell'evento ${event.title} a ${event.city}`} sizes="(max-width: 640px) 92vw, (max-width: 1280px) 40vw, 22vw" className="h-full max-h-[400px] w-full object-contain transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transform-none" />
        </div>
        <div className="flex min-w-0 flex-col gap-3 px-5 pb-6 pt-5 sm:px-6 sm:py-7">
          <span className={`self-start rounded-full px-3 py-1.5 text-[12px] font-bold ${past ? "bg-[#F0EEE8] text-ink/70" : "bg-[#E4F0D5] text-[#286B20]"}`}>{past ? "Concluso" : "In programma"}</span>
          <h3 lang="it" className="font-display text-[clamp(1.5rem,1rem+1vw,2rem)] font-extrabold leading-[1.1] tracking-[-.035em] text-ink">{event.title}</h3>
          <p className="line-clamp-3 text-[15px] leading-[1.55] text-slate">{event.description}</p>
          <div className="mt-1 grid gap-2.5 text-[14px] font-semibold text-ink/85">
            <span className="inline-flex items-start gap-2"><CalendarDays className="mt-0.5 size-4 shrink-0 text-[#FE5F00]" aria-hidden /> <time dateTime={event.date}>{formatDate(event.date, "it")}</time></span>
            <span className="inline-flex items-start gap-2"><Clock3 className="mt-0.5 size-4 shrink-0 text-[#FE5F00]" aria-hidden /> Ore {event.startsAt}</span>
            <span className="inline-flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-[#FE5F00]" aria-hidden /> {event.venue}, {event.city}</span>
          </div>
          <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-3 text-[15px] font-bold text-ink">Scopri l’evento <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden /></span>
        </div>
      </article>
    </Link>
  );
}
