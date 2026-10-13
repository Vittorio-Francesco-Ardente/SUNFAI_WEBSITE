"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { eventIsUpcoming, events, todayInItaly } from "@/content/events";
import { EventCard } from "./EventCard";
import { lhref, type Locale } from "@/lib/i18n";

/** Small homepage preview; event classification happens at runtime, independent of build date. */
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
    const aUpcoming = eventIsUpcoming(a, today), bUpcoming = eventIsUpcoming(b, today);
    return aUpcoming !== bUpcoming ? (aUpcoming ? -1 : 1) : (aUpcoming ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
  });
  return (
    <>
      <div className="grid gap-5 lg:grid-cols-2">
        {ordered.slice(0, 2).map((event) => <EventCard event={event} locale={locale} key={event.slug} past={today !== null && !eventIsUpcoming(event, today)} />)}
      </div>
      <div className="mt-8 flex justify-center">
        <Link href={lhref(locale, "/eventi/")} className="btn btn--dark btn--md">Tutti gli eventi <ArrowRight className="size-5" aria-hidden /></Link>
      </div>
    </>
  );
}
