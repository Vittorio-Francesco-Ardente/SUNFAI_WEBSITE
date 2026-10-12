"use client";

import { useEffect, useState } from "react";
import { CountUp } from "@/components/ui/CountUp";
import { fetchSummary, type Summary } from "@/lib/ardake/api";
import { ardakeSnapshot } from "@/lib/site";
import { formatDateTime } from "@/lib/i18n";

/** "Energia erogata nelle ultime 24h": live from Ardaké when the API is configured, else the last published value + timestamp. */
export function LiveEnergy({ unit, liveLabel, snapshotLabel, numberClass }: { unit: string; liveLabel: string; snapshotLabel: string; numberClass?: string }) {
  const [s, setS] = useState<Summary | null>(null);
  useEffect(() => {
    const ac = new AbortController();
    fetchSummary("AC001E01466", ac.signal).then(setS);
    return () => ac.abort();
  }, []);
  const value = Math.round(s?.energy24hKwh ?? ardakeSnapshot.energy24h);
  const when = s?.updatedAt ?? ardakeSnapshot.updatedAt;
  return (
    <>
      <p className={numberClass ?? "font-display text-[clamp(2.6rem,1.8rem+2.6vw,4.4rem)] font-extrabold leading-none tracking-[-0.05em] text-ink"}>
        <CountUp value={value} />
        <span className="ml-1.5 text-[0.42em] font-bold tracking-[-0.02em]">{unit}</span>
      </p>
      <p className="t-meta mt-3 flex items-center gap-2" aria-live="polite">
        <span className="live-dot" aria-hidden />
        {s?.live ? liveLabel : snapshotLabel} · {formatDateTime(when)}
      </p>
    </>
  );
}
