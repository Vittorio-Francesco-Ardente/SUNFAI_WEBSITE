"use client";

import { useEffect, useState } from "react";
import { eventIsUpcoming, events, todayInItaly } from "@/content/events";
import type { Locale } from "@/lib/i18n";
import { EventCard } from "./EventCard";

/**
 * A static-export site cannot classify a future event at build time.
 * Reclassify in the browser according to Europe's/Rome calendar date, updating at midnight.
 * Until hydration, show a complete and crawlable list rather than mislabelling an event.
 */
export function EventDirectory({ locale }: { locale: Locale }) {
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => {
    const refresh = () => setToday(todayInItaly());
    refresh();
    const timer = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const chronological = [...events].sort((a, b) => a.date.localeCompare(b.date));
  if (today === null) {
    return <div className="grid gap-6 lg:grid-cols-2">{chronological.map((event) => <EventCard key={event.slug} event={event} locale={locale} />)}</div>;
  }

  const upcoming = chronological.filter((item) => eventIsUpcoming(item, today));
  const past = chronological.filter((item) => !eventIsUpcoming(item, today)).reverse();
  return (
    <div className="space-y-14">
      <section aria-labelledby="eventi-in-programma" id="in-programma">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 id="eventi-in-programma" className="font-display text-[clamp(1.9rem,1.3rem+1.8vw,3rem)] font-extrabold leading-tight tracking-[-.035em] text-ink">In programma <span className="align-middle text-[16px] font-semibold text-slate">({upcoming.length})</span></h2>
          <p className="text-[14px] text-slate">Orari locali · Italia</p>
        </div>
        {upcoming.length ? <div className="grid gap-6 lg:grid-cols-2">{upcoming.map((event) => <EventCard key={event.slug} event={event} locale={locale} />)}</div> : <p className="rounded-3xl bg-white px-6 py-8 text-[16px] text-slate ring-1 ring-ink/10">Non ci sono nuovi incontri annunciati al momento. Qui troverai i prossimi appuntamenti SUN-FAI.</p>}
      </section>
      <section aria-labelledby="eventi-conclusi" id="conclusi">
        <h2 id="eventi-conclusi" className="mb-6 font-display text-[clamp(1.9rem,1.3rem+1.8vw,3rem)] font-extrabold leading-tight tracking-[-.035em] text-ink">Conclusi <span className="align-middle text-[16px] font-semibold text-slate">({past.length})</span></h2>
        {past.length ? <div className="grid gap-6 lg:grid-cols-2">{past.map((event) => <EventCard key={event.slug} event={event} locale={locale} past />)}</div> : <p className="rounded-3xl bg-white px-6 py-8 text-[16px] text-slate ring-1 ring-ink/10">Gli incontri già svolti verranno raccolti qui, con le locandine originali.</p>}
      </section>
    </div>
  );
}
