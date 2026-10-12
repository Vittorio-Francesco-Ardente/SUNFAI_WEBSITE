"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Zap } from "lucide-react";
import { ChartCard, COLORS, LineChart } from "@/components/charts/Charts";
import { InfoDot } from "./Giorgio";
import { configurations } from "@/lib/configurations";
import { demoPowerCurve, fetchPower, fetchSummary, type PowerPoint, type Summary } from "@/lib/ardake/api";
import { formatDateTime, lhref, type Locale } from "@/lib/i18n";
import { formatIt } from "@/lib/demo-energy";
import { cn } from "@/lib/cn";
import type { Dict } from "@/content/dict";

/**
 * /ardake/monitoraggio (pack 05.3): cabina selector (hash #AC…), tabs, KPIs and the real-time power chart.
 * Data is fetched client-side from the Ardaké API (NEXT_PUBLIC_ARDAKE_API_BASE, CORS required); without it the
 * page shows the last published values with their timestamp and a curve clearly labelled as demonstrative.
 */
export function Monitor({ a, locale, legend }: { a: Dict["ardake"]; locale: Locale; legend: Dict["home"]["map"]["legend"] }) {
  const m = a.monitor;
  const [code, setCode] = useState(configurations[0].code);
  const [tab, setTab] = useState(0);
  const [period, setPeriod] = useState(0);
  const [sum, setSum] = useState<Summary | null>(null);
  const [power, setPower] = useState<PowerPoint[] | null>(null);

  useEffect(() => {
    const read = () => {
      const h = decodeURIComponent(location.hash.slice(1));
      if (configurations.some((c) => c.code === h)) setCode(h);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    setSum(null);
    fetchSummary(code, ac.signal).then(setSum);
    fetchPower(code, ac.signal).then(setPower);
    return () => ac.abort();
  }, [code]);

  const choose = (c: string) => {
    history.replaceState(null, "", `#${c}`);
    setCode(c);
  };
  const conf = configurations.find((c) => c.code === code)!;
  const pts = useMemo(() => power ?? demoPowerCurve(code === "AC001E01412" ? 96 : 124), [power, code]);
  const labels = pts.map((p) => p.t.slice(11, 16));
  const step = Math.max(1, Math.floor(labels.length / 5));
  const ticks = labels.map((_, i) => i).filter((i) => i % step === 0 || i === labels.length - 1).slice(-6);
  const live = sum?.live ?? false;

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:gap-8">
      <aside className="lg:sticky lg:top-[100px] lg:self-start">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-slate">
          {m.selector} <InfoDot topic="cabina-primaria" />
        </p>
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-2 no-scrollbar lg:grid lg:overflow-visible">
          {configurations.map((c) => (
            <li key={c.code} className="shrink-0">
              <button
                type="button"
                onClick={() => choose(c.code)}
                aria-pressed={c.code === code}
                className={cn("flex min-h-12 w-full flex-col items-start rounded-[20px] px-4 py-3 text-left transition-colors", c.code === code ? "bg-ink text-white" : "bg-card text-ink shadow-[inset_0_0_0_1px_var(--color-hairline)] hover:bg-paper-2")}
              >
                <span className="font-display text-[1.05rem] font-extrabold tracking-[-0.02em]">{c.code}</span>
                <span className={cn("mt-0.5 hidden text-[13px] lg:block", c.code === code ? "text-white/75" : "text-slate")}>{c.comuni.join(", ")}</span>
                <span className={cn("mt-1 inline-flex items-center gap-1.5 text-[13px] font-semibold", c.code === code ? "text-solar" : "text-leaf-text")}>
                  <span className="live-dot !size-2" aria-hidden /> {legend[c.status]}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4 rounded-[20px] bg-paper-2 p-4 text-[14px] text-slate">
          <p className="flex items-center gap-2 font-semibold text-ink">
            <span className={cn("live-dot", !live && "!bg-slate-400 after:hidden")} aria-hidden />
            {live ? m.liveNote : a.charts.power.now}
          </p>
          <p className="mt-1">
            {m.updated} {sum ? formatDateTime(sum.updatedAt) : "…"}
          </p>
          {!live ? <p className="mt-2">{m.snapshotNote}</p> : null}
        </div>
      </aside>

      <div className="min-w-0">
        <div role="tablist" aria-label={m.filter} className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {m.tabs.map((t, i) => (
            <button key={t} role="tab" type="button" aria-selected={i === tab} onClick={() => setTab(i)} className="chip shrink-0 whitespace-nowrap">
              {t}
            </button>
          ))}
        </div>

        {tab === 0 || tab === 1 ? (
          <>
            <dl className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
              {[
                { k: m.kpiLast15, v: sum ? `${formatIt(sum.last15Kwh, 2)} kWh` : "…", info: "ultimi-15-minuti" as const },
                { k: m.kpiTotal, v: sum ? `${formatIt(sum.totalKwh, 2)} kWh` : "…", info: "totale-periodo" as const },
                { k: m.kpiMembers, v: sum ? String(sum.members) : "…", info: "prosumer-consumer" as const },
                { k: m.kpiPower, v: "349 kWp", info: "kwp" as const },
              ].map((x) => (
                <div key={x.k} className="card p-4 sm:p-5">
                  <dt className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-slate">
                    <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">{x.k}</span>
                    <InfoDot topic={x.info} />
                  </dt>
                  <dd className="mt-2 font-display text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-extrabold tracking-[-0.04em] text-ink" aria-live="polite">
                    {x.v}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-[14px] font-semibold text-ink">{m.filter}</span>
              {m.periods.map((p, i) => (
                <button key={p} type="button" aria-pressed={i === period} onClick={() => setPeriod(i)} className="chip">
                  {p}
                </button>
              ))}
            </div>
            <ChartCard
              className="mt-3"
              title={m.chartPower}
              info={<InfoDot topic="potenza-istantanea" />}
              sub={!power ? <span className="inline-flex rounded-full bg-solar px-2.5 py-0.5 text-[13px] font-bold text-ink">{a.dashboard.badge} · {m.demoCurve}</span> : null}
            >
              <LineChart xLabels={labels} xTicks={ticks} unit="kW" liveDot ariaLabel={a.charts.power.aria} colLabel={a.charts.hourCol} series={[{ key: "kw", label: a.charts.power.unit, color: COLORS.production, values: pts.map((p) => p.kw), fill: COLORS.productionFill, width: 3 }]} />
            </ChartCard>
            <div className="card mt-3 p-5">
              <p className="text-[14px] font-semibold text-slate">{m.communes}</p>
              <p className="mt-1 text-[16px] text-ink">{conf.comuni.join(" · ")}</p>
            </div>
          </>
        ) : (
          <div className="card mt-5 flex flex-col items-start gap-4 p-6 sm:p-8">
            <Zap className="size-7 text-orange-text" aria-hidden />
            <p className="t-body">{m.soon}</p>
            <Link href={lhref(locale, "/ardake/demo/")} className="btn btn--dark btn--md">
              {m.seeDemo}
              <ArrowRight aria-hidden />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
