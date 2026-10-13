"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { Img } from "@/components/ui/Img";
import { eventIsUpcoming, events, todayInItaly } from "@/content/events";
import { formatDate, lhref, type Locale } from "@/lib/i18n";

/** Compact, high-visibility homepage preview immediately beneath the hero.
 * The full posters and complete descriptions remain on the dedicated event pages.
 * Classification is refreshed using the Italian calendar, independently of the deploy date. */
export function HomeEvents({ locale }: { locale: Locale }) {
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => {
    const refresh = () => setToday(todayInItaly());
    refresh();
    const timer = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const ordered = [...events].sort((a, b) => {
    if (!today) return a.date.localeCompare(b.date);
    const aUpcoming = eventIsUpcoming(a, today);
    const bUpcoming = eventIsUpcoming(b, today);
    return aUpcoming !== bUpcoming
      ? aUpcoming ? -1 : 1
      : aUpcoming ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
  });

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2" aria-label="Incontri SUN-FAI sul territorio">
        {ordered.slice(0, 2).map((event) => {
          const past = today !== null && !eventIsUpcoming(event, today);
          return (
            <Link
              key={event.slug}
              href={lhref(locale, `/eventi/${event.slug}/`)}
              aria-label={`${event.title}, ${event.city}, ${formatDate(event.date, "it")}, ore ${event.startsAt}. Scopri l'evento`}
              className="group flex min-w-0 items-stretch gap-3 overflow-hidden rounded-[24px] bg-white p-3 shadow-[0_1px_0_rgb(5_42_34/.12),0_12px_28px_-24px_rgb(5_42_34/.3)] ring-1 ring-ink/10 transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink motion-reduce:transform-none sm:gap-4 sm:p-4"
            >
              <div className="flex w-[98px] shrink-0 items-center justify-center overflow-hidden rounded-[16px] bg-[#F7F5EE] sm:w-[126px]">
                <Img src={event.poster} alt={`Locandina ${event.city}`} sizes="(max-width: 639px) 98px, 126px" className="h-[146px] w-full object-contain sm:h-[164px]" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col items-start py-1">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${past ? "bg-[#F0EEE8] text-ink/70" : "bg-[#E4F0D5] text-[#286B20]"}`}>{past ? "Concluso" : "In programma"}</span>
                <h3 className="mt-2 font-display text-[clamp(1.1rem,1rem+.5vw,1.4rem)] font-extrabold leading-tight tracking-[-.025em] text-ink">{event.title}</h3>
                <span className="mt-2 flex items-start gap-1.5 text-[13px] leading-snug text-slate"><CalendarDays className="mt-px size-4 shrink-0 text-orange-text" aria-hidden /> <time dateTime={event.date}>{formatDate(event.date, "it")}</time> · {event.startsAt}</span>
                <span className="mt-1 flex items-start gap-1.5 text-[13px] leading-snug text-slate"><MapPin className="mt-px size-4 shrink-0 text-orange-text" aria-hidden /> {event.city}</span>
                <span className="mt-auto inline-flex min-h-8 items-center gap-1 pt-2 text-[13px] font-bold text-ink">Dettagli <ArrowUpRight className="size-4" aria-hidden /></span>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="mt-6 flex justify-center">
        <Link href={lhref(locale, "/eventi/")} className="btn btn--dark btn--md">Tutti gli eventi <ArrowRight className="size-5" aria-hidden /></Link>
      </div>
    </>
  );
}
