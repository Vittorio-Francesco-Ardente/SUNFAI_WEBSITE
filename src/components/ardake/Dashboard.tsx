import { CalendarDays, Info, Leaf, Lightbulb, Sun, TrendingUp, Zap } from "lucide-react";
import { BarsChart, CalendarHeat, ChartCard, COLORS, Donut, Gauge, HoursStrip, Legend, LineChart, SplitBar } from "@/components/charts/Charts";
import { asset } from "@/lib/asset";
import { InfoDot } from "./Giorgio";
import { bestHours, calendar, DEMO_TARIFF, hourly, hourlyTotals, memberRows, members, monthly, weekly, where } from "@/lib/ardake/demo-data";
import { formatEur, formatInt, formatIt } from "@/lib/demo-energy";
import { cn } from "@/lib/cn";
import type { Dict } from "@/content/dict";

const HOURS = Array.from({ length: 24 }, (_, h) => `${h}:00`);

/**
 * Ardaké demo dashboard (demo dashboard.tsx, V2 charts). "Dati dimostrativi" is visible on the header and the footer.
 * `preview`: KPIs + hourly chart only (Ardaké page teaser).
 */
export function Dashboard({ a, preview = false }: { a: Dict["ardake"]; preview?: boolean }) {
  const t = a.dashboard;
  const c = a.charts;
  const tot = hourlyTotals;
  const month = monthly[monthly.length - 1];
  const kpis = [
    { icon: Sun, label: t.kpi.produced, value: `${formatInt(tot.production)} kWh`, tone: "bg-[#FDF0C8]", sub: t.kpi.plants, info: "kwh" as const },
    { icon: Zap, label: t.kpi.consumed, value: `${formatInt(tot.consumption)} kWh`, tone: "bg-mint", sub: t.kpi.utenze, info: null },
    { icon: Leaf, label: t.kpi.shared, value: `${formatInt(tot.shared)} kWh`, tone: "bg-ink text-white", sub: `${Math.round(tot.sharedRatio * 100)}% ${t.kpi.ofProduction}`, info: "energia-condivisa" as const },
    { icon: TrendingUp, label: t.kpi.incentive, value: formatEur(month.shared * DEMO_TARIFF), tone: "bg-peach-light", sub: t.kpi.estimate, info: "incentivi" as const },
  ];

  return (
    <div className="rounded-[var(--radius-feature)] bg-paper-2 p-3 shadow-[inset_0_0_0_1px_var(--color-hairline)] sm:p-5 lg:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex flex-wrap items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/ardake/ardake-logotype-vector.svg")} alt="Ardaké" width={120} height={36} className="h-auto w-[120px]" />
          <p className="text-[15px] text-slate">
            <span className="font-semibold text-ink">{t.config}</span> {t.configSub}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-card px-3 text-[13px] font-semibold text-ink shadow-[inset_0_0_0_1px_var(--color-hairline)]">
            <CalendarDays className="size-3.5" aria-hidden /> {t.today}
          </span>
          <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-solar px-3 text-[13px] font-bold text-ink">
            <Info className="size-3.5" aria-hidden /> {t.badge}
          </span>
        </div>
      </header>

      <dl className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className={cn("rounded-[22px] p-4 sm:p-5", k.tone)}>
            <dt className="flex items-center gap-2 text-[13px] font-medium opacity-85 sm:text-[14px]">
              <k.icon className="size-4 shrink-0" aria-hidden />
              <span className="flex-1">{k.label}</span>
              {k.info ? <InfoDot topic={k.info} /> : null}
            </dt>
            <dd className="mt-3 font-display text-[clamp(1.5rem,1.2rem+1vw,1.9rem)] font-extrabold leading-none tracking-[-0.04em]">{k.value}</dd>
            <p className="mt-2 text-[13px] opacity-75">{k.sub}</p>
          </div>
        ))}
      </dl>

      <div className={cn("mt-3 grid gap-3", !preview && "lg:grid-cols-12")}>
        <ChartCard
          className={preview ? "" : "lg:col-span-8"}
          title={c.hourly.title}
          info={<InfoDot topic="energia-condivisa" />}
          legend={
            <Legend
              items={[
                { color: COLORS.production, label: c.hourly.production },
                { color: COLORS.consumptionStroke, label: c.hourly.consumption },
                { color: COLORS.shared, label: c.hourly.shared, kind: "area" },
              ]}
            />
          }
        >
          <LineChart
            xLabels={HOURS}
            xTicks={[0, 6, 12, 18, 23]}
            unit="kWh"
            ariaLabel={c.hourly.aria}
            colLabel={c.hourCol}
            series={[
              { key: "p", label: c.hourly.production, color: COLORS.production, values: hourly.map((h) => h.production), fill: COLORS.productionFill, width: 3 },
              { key: "c", label: c.hourly.consumption, color: COLORS.consumptionStroke, values: hourly.map((h) => h.consumption), width: 2.5 },
            ]}
            sharedBand={{ a: 0, b: 1, color: COLORS.shared, label: c.hourly.shared }}
          />
          <p className="t-meta mt-2 hidden [@media(pointer:coarse)]:block">{c.scrubHint}</p>
        </ChartCard>
        {!preview ? (
          <aside className="grid gap-3 lg:col-span-4">
            <div className="card bg-peach-light p-5" style={{ background: "var(--color-peach-light)" }}>
              <p className="flex items-center gap-2 text-[15px] font-semibold text-ink">
                <Lightbulb className="size-4 text-orange-text" aria-hidden /> {t.tipTitle}
              </p>
              <p className="mt-3 font-display text-[1.6rem] font-extrabold leading-tight tracking-[-0.03em]">11:00 – 15:00</p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/80">{t.tipText}</p>
            </div>
            <ChartCard title={c.gauge.title} info={<InfoDot topic="energia-condivisa" />}>
              <Gauge value={tot.sharedRatio} ariaLabel={c.gauge.aria.replace("{v}", String(Math.round(tot.sharedRatio * 100)))} />
              <p className="t-meta mt-1 text-center">{c.gauge.caption}</p>
            </ChartCard>
          </aside>
        ) : null}
      </div>

      {!preview ? (
        <>
          <div className="mt-3 grid gap-3 lg:grid-cols-12">
            <ChartCard className="lg:col-span-7" title={c.monthly.title} legend={<Legend items={[{ color: COLORS.productionFill, label: c.monthly.produced, kind: "area" }, { color: COLORS.shared, label: c.monthly.shared, kind: "area" }]} />}>
              <BarsChart labels={[...c.months]} a={{ label: c.monthly.produced, color: COLORS.productionFill, values: monthly.map((m) => m.produced) }} b={{ label: c.monthly.shared, color: COLORS.shared, values: monthly.map((m) => m.shared) }} ariaLabel={c.monthly.aria} unit="kWh" colLabel={c.hourCol} />
            </ChartCard>
            <ChartCard className="lg:col-span-5" title={t.members.donutLabel} info={<InfoDot topic="prosumer-consumer" />}>
              <Donut
                ariaLabel={t.members.donutLabel}
                data={[
                  { label: t.members.types.consumer, value: members.consumer, color: "#C9E1A0" },
                  { label: t.members.types.prosumer, value: members.prosumer, color: "#79AD4B" },
                  { label: t.members.types.enti, value: members.enti, color: "#FECF49" },
                ]}
              />
            </ChartCard>
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-12">
            <ChartCard className="lg:col-span-7" title={c.best.title} info={<InfoDot topic="quarto-orario" />}>
              <HoursStrip values={bestHours} ariaLabel={c.best.aria} low={c.best.low} high={c.best.high} hourLabel={c.best.hour} />
              <div className="mt-4 flex gap-3 rounded-2xl bg-paper-2 p-4">
                <Lightbulb className="size-5 shrink-0 text-orange-text" aria-hidden />
                <p className="text-[15px] text-ink/85">
                  <strong className="text-ink">{c.best.tipTitle}:</strong> {c.best.tip}
                </p>
              </div>
            </ChartCard>
            <ChartCard className="lg:col-span-5" title={c.where.title}>
              <SplitBar
                parts={[
                  { label: c.where.shared, value: where.shared, color: COLORS.shared, text: "#fff" },
                  { label: c.where.grid, value: where.grid, color: "#FECF49" },
                ]}
              />
            </ChartCard>
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-12">
            <ChartCard className="lg:col-span-5" title={c.calendar.title} info={<InfoDot topic="energia-condivisa" />}>
              <CalendarHeat values={calendar.values} startWeekday={calendar.startWeekday} days={c.calendar.days} ariaLabel={c.calendar.aria} less={c.calendar.less} more={c.calendar.more} dayLabel={c.calendar.day} unit="kWh" />
            </ChartCard>
            <ChartCard className="lg:col-span-7" title={c.weekly.title} legend={<Legend items={[{ color: COLORS.shared, label: c.weekly.thisWeek }, { color: "rgb(5 42 34 / .45)", label: c.weekly.lastWeek, kind: "dashed" }]} />}>
              <LineChart
                xLabels={[...c.weekly.days]}
                xTicks={[0, 1, 2, 3, 4, 5, 6]}
                unit="kWh"
                height={240}
                ariaLabel={c.weekly.aria}
                colLabel={c.hourCol}
                series={[
                  { key: "now", label: c.weekly.thisWeek, color: COLORS.shared, values: weekly.thisWeek, width: 3 },
                  { key: "prev", label: c.weekly.lastWeek, color: "rgb(5 42 34 / .45)", values: weekly.lastWeek, dashed: true, width: 2.5 },
                ]}
              />
            </ChartCard>
          </div>

          <section className="card mt-3 p-4 sm:p-6">
            <h3 className="font-display text-[1.1rem] font-extrabold tracking-[-0.02em]">{t.members.title}</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-[15px]">
                <thead className="text-[13px] text-slate">
                  <tr className="border-b border-[var(--color-hairline)]">
                    <th className="py-2 font-medium">{t.members.member}</th>
                    <th className="py-2 font-medium">{t.members.role}</th>
                    <th className="py-2 text-right font-medium">{t.members.share}</th>
                  </tr>
                </thead>
                <tbody>
                  {memberRows.map((m) => (
                    <tr key={m.id} className="border-b border-[var(--color-hairline)] last:border-0">
                      <td className="py-2.5 font-semibold text-ink">
                        {m.id} <span className="font-normal text-slate">· {t.members.kinds[m.kind]}</span>
                      </td>
                      <td className="py-2.5">
                        <span className={cn("rounded-full px-2.5 py-0.5 text-[13px] font-semibold", m.role === "producer" ? "bg-[#FDF0C8] text-ink" : "bg-mint text-leaf-text")}>{m.role === "producer" ? t.members.producer : t.members.consumer}</span>
                      </td>
                      <td className="py-2.5 text-right tabular-nums">{formatIt(m.share, 1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}

      <p className="t-meta mt-4 px-1">{t.disclaimer}</p>
    </div>
  );
}
