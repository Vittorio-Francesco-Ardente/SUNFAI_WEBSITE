"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { area, arc, curveMonotoneX, line, pie } from "d3-shape";
import { scaleBand, scaleLinear } from "d3-scale";
import { cn } from "@/lib/cn";
import { formatIt } from "@/lib/demo-energy";

/**
 * Chart rules (pack 05.3): curveMonotoneX, 2.5–3 px opaque strokes with round caps/joins, layer order
 * area → secondary → primary (no colour seam where lines cross), no vertical gridlines, hairlines rgb(5 42 34/.07),
 * Inter 12 px slate labels, flat fills only. Keyboard ←/→ moves the crosshair; aria-live value; hidden data table.
 * Phones: ≤ 6 x ticks, tap-and-drag scrubber with a fixed readout above the chart.
 * Entry: lines draw in (700 ms), bars grow (30 ms stagger), gauge sweeps — none with reduced motion.
 */
export const COLORS = { production: "#E3A400", productionFill: "#FECF49", consumption: "#79AD4B", consumptionStroke: "#478A2B", shared: "#F26722", prev: "rgb(5 42 34 / .35)", grid: "rgb(5 42 34 / .07)" };

/** Draw-in once when the chart nears the viewport (IntersectionObserver, rootMargin 200 px). */
function useEnter() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || /[?&]test/.test(location.search)) return setOn(true);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setOn(true), io.disconnect()), { rootMargin: "0px 0px -15% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, on };
}

export function ChartCard({ title, info, children, className, legend, sub }: { title: string; info?: ReactNode; children: ReactNode; className?: string; legend?: ReactNode; sub?: ReactNode }) {
  return (
    <section className={cn("card min-w-0 p-4 sm:p-6", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-display text-[1.1rem] font-extrabold tracking-[-0.02em] text-ink">
          {title}
          {info}
        </h3>
        {legend}
      </div>
      {sub ? <div className="mt-1">{sub}</div> : null}
      {children}
    </section>
  );
}

export function Legend({ items }: { items: { color: string; label: string; kind?: "line" | "area" | "dashed" }[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((i) => (
        <li key={i.label} className="pill gap-1.5 !text-[13px]">
          {i.kind === "dashed" ? (
            <svg aria-hidden width="16" height="4" className="shrink-0">
              <line x1="1" x2="15" y1="2" y2="2" stroke={i.color} strokeWidth="2.5" strokeDasharray="4 3" strokeLinecap="round" />
            </svg>
          ) : (
            <span aria-hidden className={i.kind === "area" ? "h-2.5 w-3 rounded-[3px]" : "h-[3px] w-4 rounded-full"} style={{ background: i.color }} />
          )}
          {i.label}
        </li>
      ))}
    </ul>
  );
}

function DataTable({ caption, cols, rows }: { caption: string; cols: string[]; rows: (string | number)[][] }) {
  return (
    <div className="sr-table">
    <table>
      <caption>{caption}</caption>
      <thead>
        <tr>
          {cols.map((c) => (
            <th key={c} scope="col">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (j === 0 ? <th key={j} scope="row">{c}</th> : <td key={j}>{c}</td>))}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

/* ------------------------------------------------------------------ Line/area with crosshair */
type Series = { key: string; label: string; color: string; values: number[]; width?: number; dashed?: boolean; fill?: string; fillOpacity?: number };

export function LineChart({
  xLabels,
  series,
  sharedBand,
  ariaLabel,
  unit,
  height = 280,
  xTicks,
  liveDot = false,
  colLabel,
}: {
  xLabels: string[];
  series: Series[];
  /** fill the hourly minimum between two series (shared energy) */
  sharedBand?: { a: number; b: number; color: string; label: string };
  ariaLabel: string;
  unit: string;
  height?: number;
  xTicks: number[];
  liveDot?: boolean;
  colLabel: string;
}) {
  const id = useId();
  const { ref, on } = useEnter();
  const [hover, setHover] = useState<number | null>(null);
  const [W, setW] = useState(720);
  const H = height;
  const P = { l: 10, r: 10, t: 26, b: 28 };
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  const n = xLabels.length;
  const max = Math.max(1, ...series.flatMap((s) => s.values)) * 1.1;
  const x = scaleLinear().domain([0, n - 1]).range([P.l, W - P.r]);
  const y = scaleLinear().domain([0, max]).range([H - P.b, P.t]).nice();
  const ticksY = y.ticks(4);
  const mk = (vals: number[]) => line<number>().x((_, i) => x(i)).y((v) => y(v)).curve(curveMonotoneX)(vals) ?? "";
  const mkArea = (vals: number[], base?: number[]) => area<number>().x((_, i) => x(i)).y0((_, i) => y(base ? base[i] : 0)).y1((v) => y(v)).curve(curveMonotoneX)(vals) ?? "";
  const band = sharedBand ? series[sharedBand.a].values.map((v, i) => Math.min(v, series[sharedBand.b].values[i])) : null;

  const pick = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const i = Math.round(x.invert(((clientX - r.left) / r.width) * W));
    setHover(Math.max(0, Math.min(n - 1, i)));
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") (e.preventDefault(), setHover((h) => Math.min(n - 1, (h ?? -1) + 1)));
    if (e.key === "ArrowLeft") (e.preventDefault(), setHover((h) => Math.max(0, (h ?? n) - 1)));
    if (e.key === "Escape") setHover(null);
  };
  const onDown = (e: PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pick(e.clientX);
  };
  const h = hover ?? (liveDot ? n - 1 : null);
  const readout = h !== null ? `${xLabels[h]} · ${series.map((s) => `${s.label} ${formatIt(s.values[h], 1)} ${unit}`).join(" · ")}${band ? ` · ${sharedBand!.label} ${formatIt(band[h], 1)} ${unit}` : ""}` : "";

  return (
    <div ref={ref} className="relative mt-3 select-none">
      {/* fixed readout above the chart (phones: scrubber) */}
      <p className="min-h-[22px] text-[13px] font-medium text-slate" aria-live="polite">
        {readout}
      </p>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        role="img"
        aria-label={ariaLabel}
        aria-describedby={`${id}-table`}
        tabIndex={0}
        onKeyDown={onKey}
        onPointerMove={(e) => (e.pointerType === "mouse" || e.buttons ? pick(e.clientX) : undefined)}
        onPointerDown={onDown}
        onPointerLeave={(e) => e.pointerType === "mouse" && setHover(null)}
        className="block touch-pan-y overflow-visible rounded-xl focus-visible:outline-[3px]"
      >
        {ticksY.map((v) => (
          <g key={v}>
            <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke={COLORS.grid} />
            <text x={P.l + 2} y={y(v) - 5} fontSize="12" fill="var(--color-slate)">
              {formatIt(v)}
              {v === ticksY[ticksY.length - 1] ? ` ${unit}` : ""}
            </text>
          </g>
        ))}
        {xTicks.map((i) => (
          <text key={i} x={x(i)} y={H - 8} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"} fontSize="12" fill="var(--color-slate)">
            {xLabels[i]}
          </text>
        ))}
        <g style={{ clipPath: on ? "inset(0 0 0 0)" : "inset(0 100% 0 0)", transition: "clip-path .7s cubic-bezier(.22,1,.36,1)" }}>
          {series.filter((s) => s.fill).map((s) => (
            <path key={`a-${s.key}`} d={mkArea(s.values)} fill={s.fill} fillOpacity={s.fillOpacity ?? 0.18} />
          ))}
          {band ? <path d={mkArea(band)} fill={sharedBand!.color} fillOpacity={0.3} /> : null}
          {[...series].reverse().map((s) => (
            <path key={s.key} d={mk(s.values)} fill="none" stroke={s.color} strokeWidth={s.width ?? 2.75} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={s.dashed ? "5 6" : undefined} />
          ))}
        </g>
        {h !== null ? (
          <g pointerEvents="none">
            {hover !== null ? <line x1={x(h)} x2={x(h)} y1={P.t} y2={H - P.b} stroke="rgb(5 42 34 / .3)" /> : null}
            {series.map((s) => (
              <circle key={s.key} cx={x(h)} cy={y(s.values[h])} r={4.5} fill={s.color} stroke="#fff" strokeWidth={2} />
            ))}
            {liveDot && hover === null ? (
              <circle cx={x(n - 1)} cy={y(series[0].values[n - 1])} r={10} fill={series[0].color} opacity={0.25}>
                <animate attributeName="r" values="6;14;6" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values=".35;0;.35" dur="2s" repeatCount="indefinite" />
              </circle>
            ) : null}
          </g>
        ) : null}
      </svg>
      <div id={`${id}-table`}>
        <DataTable caption={ariaLabel} cols={[colLabel, ...series.map((s) => `${s.label} (${unit})`), ...(band ? [`${sharedBand!.label} (${unit})`] : [])]} rows={xLabels.map((l, i) => [l, ...series.map((s) => formatIt(s.values[i], 1)), ...(band ? [formatIt(band[i], 1)] : [])])} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Grouped bars (12 months) */
export function BarsChart({ labels, a, b, ariaLabel, unit, colLabel }: { labels: string[]; a: { label: string; color: string; values: number[] }; b: { label: string; color: string; values: number[] }; ariaLabel: string; unit: string; colLabel: string }) {
  const { ref, on } = useEnter();
  const [hover, setHover] = useState<number | null>(null);
  const W = 640, H = 230, P = { l: 6, r: 6, t: 24, b: 26 };
  const x = scaleBand<number>().domain(labels.map((_, i) => i)).range([P.l, W - P.r]).padding(0.28);
  const y = scaleLinear().domain([0, Math.max(...a.values, ...b.values) * 1.08]).range([H - P.b, P.t]).nice();
  const bw = x.bandwidth() / 2 - 1;
  const col = (x0: number, w: number, top: number, base: number) => {
    const r = Math.min(6, w / 2, base - top);
    return `M${x0},${base}V${top + r}Q${x0},${top} ${x0 + r},${top}H${x0 + w - r}Q${x0 + w},${top} ${x0 + w},${top + r}V${base}Z`;
  };
  const sel = hover;
  return (
    <div ref={ref} className="mt-3">
      <p className="min-h-[22px] text-[13px] font-medium text-slate" aria-live="polite">
        {sel !== null ? `${labels[sel]} · ${a.label} ${formatIt(a.values[sel])} ${unit} · ${b.label} ${formatIt(b.values[sel])} ${unit}` : ""}
      </p>
      <div className="chart-scroll no-scrollbar -mx-1 px-1">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel} tabIndex={0} className="block h-auto w-full min-w-[560px]" onKeyDown={(e) => {
          if (e.key === "ArrowRight") (e.preventDefault(), setHover((h) => Math.min(labels.length - 1, (h ?? -1) + 1)));
          if (e.key === "ArrowLeft") (e.preventDefault(), setHover((h) => Math.max(0, (h ?? labels.length) - 1)));
        }} onMouseLeave={() => setHover(null)}>
          {y.ticks(3).map((v) => (
            <g key={v}>
              <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke={COLORS.grid} />
              <text x={P.l + 2} y={y(v) - 5} fontSize="12" fill="var(--color-slate)">{`${formatIt(v / 1000)}k`}</text>
            </g>
          ))}
          {labels.map((l, i) => {
            const x0 = x(i)!;
            const dim = sel !== null && sel !== i ? 0.35 : 1;
            return (
              <g key={l} opacity={dim} onMouseEnter={() => setHover(i)} onClick={() => setHover(i)}>
                <rect x={x0 - 6} y={P.t} width={x.bandwidth() + 12} height={H - P.t - P.b} fill="transparent" />
                <g style={{ transform: on ? "scaleY(1)" : "scaleY(0)", transformOrigin: `0 ${H - P.b}px`, transition: `transform .6s cubic-bezier(.22,1,.36,1) ${i * 30}ms` }}>
                  <path d={col(x0, bw, y(a.values[i]), y(0))} fill={a.color} />
                  <path d={col(x0 + bw + 2, bw, y(b.values[i]), y(0))} fill={b.color} />
                </g>
                <text x={x0 + x.bandwidth() / 2} y={H - 7} textAnchor="middle" fontSize="12" fill="var(--color-slate)">
                  {l}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <DataTable caption={ariaLabel} cols={[colLabel, `${a.label} (${unit})`, `${b.label} (${unit})`]} rows={labels.map((l, i) => [l, formatIt(a.values[i]), formatIt(b.values[i])])} />
    </div>
  );
}

/* ------------------------------------------------------------------ Gauge (logo ground arc) */
export function Gauge({ value, ariaLabel }: { value: number; ariaLabel: string }) {
  const { ref, on } = useEnter();
  const r = 70;
  const c = Math.PI * r;
  return (
    <div ref={ref}>
      <svg viewBox="0 0 180 104" className="mx-auto mt-3 w-full max-w-[260px]" role="img" aria-label={ariaLabel}>
        <path d="M20 92 A70 70 0 0 1 160 92" fill="none" stroke="#FAC23B" strokeOpacity={0.35} strokeWidth={18} strokeLinecap="round" />
        <path d="M20 92 A70 70 0 0 1 160 92" fill="none" stroke="#F26722" strokeWidth={18} strokeLinecap="round" strokeDasharray={`${c * (on ? value : 0)} ${c}`} style={{ transition: "stroke-dasharray 1s cubic-bezier(.22,1,.36,1)" }} />
        <text x="90" y="86" textAnchor="middle" fontSize="30" fontWeight="800" fill="var(--color-ink)" style={{ fontFamily: "var(--font-display)" }}>
          {Math.round(value * 100)}%
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ Donut */
export function Donut({ data, ariaLabel }: { data: { label: string; value: number; color: string }[]; ariaLabel: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const arcs = useMemo(() => pie<{ value: number }>().sort(null).padAngle(0.03).value((d) => d.value)(data), [data]);
  const total = data.reduce((s, d) => s + d.value, 0);
  const mk = arc<(typeof arcs)[number]>().innerRadius(52).outerRadius(80).cornerRadius(4);
  return (
    <div className="mt-3 grid items-center gap-4 sm:grid-cols-[180px_1fr]">
      <svg viewBox="-90 -90 180 180" className="mx-auto w-[180px]" role="img" aria-label={ariaLabel}>
        {arcs.map((a, i) => (
          <path key={i} d={mk(a) ?? ""} fill={data[i].color} opacity={hover === null || hover === i ? 1 : 0.35} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
        ))}
        <text textAnchor="middle" y="8" fontSize="26" fontWeight="800" fill="var(--color-ink)" style={{ fontFamily: "var(--font-display)" }}>
          {hover === null ? total : data[hover].value}
        </text>
      </svg>
      <ul className="grid gap-2">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center gap-3 text-[15px] text-ink" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <span className="size-3 rounded-full" style={{ background: d.color }} aria-hidden />
            <span className="flex-1">{d.label}</span>
            <span className="font-semibold tabular-nums">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ 24-hour "best hours" strip */
export function HoursStrip({ values, ariaLabel, low, high, hourLabel }: { values: number[]; ariaLabel: string; low: string; high: string; hourLabel: string }) {
  const color = (v: number) => (v < 0.15 ? "#F4EFE6" : v < 0.4 ? "#FCE9A6" : v < 0.65 ? "#FECF49" : v < 0.85 ? "#FE9845" : "#F26722");
  return (
    <div className="mt-4">
      <ol className="grid grid-cols-12 gap-1 md:grid-cols-24" aria-label={ariaLabel}>
        {values.map((v, h) => (
          <li key={h} className="flex flex-col items-center gap-1">
            <span className="block aspect-[1/1.3] w-full rounded-[6px]" style={{ background: color(v) }} title={hourLabel.replace("{h}", String(h))}>
              <span className="sr-only">
                {hourLabel.replace("{h}", String(h))}: {Math.round(v * 100)}%
              </span>
            </span>
            <span aria-hidden className="text-[13px] text-slate">
              {h % 6 === 0 ? h : ""}
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-2 flex items-center gap-2 text-[13px] text-slate">
        {low}
        <span className="flex h-2 flex-1 overflow-hidden rounded-full" aria-hidden>
          {["#F4EFE6", "#FCE9A6", "#FECF49", "#FE9845", "#F26722"].map((c) => (
            <span key={c} className="flex-1" style={{ background: c }} />
          ))}
        </span>
        {high}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Month heat-map (7 × 5) */
export function CalendarHeat({ values, startWeekday, days, ariaLabel, less, more, dayLabel, unit }: { values: number[]; startWeekday: number; days: readonly string[]; ariaLabel: string; less: string; more: string; dayLabel: string; unit: string }) {
  const [sel, setSel] = useState<number | null>(null);
  const max = Math.max(...values);
  const scale = ["#EEF4E6", "#DEE9BF", "#C9E1A0", "#9FC873", "#79AD4B", "#478A2B"];
  const col = (v: number) => scale[Math.min(scale.length - 1, Math.floor((v / max) * (scale.length - 0.01)))];
  const cells = [...Array(startWeekday).fill(null), ...values];
  return (
    <div className="mt-3">
      <p className="min-h-[22px] text-[13px] font-medium text-slate" aria-live="polite">
        {sel !== null ? `${dayLabel.replace("{d}", String(sel + 1))} · ${formatIt(values[sel])} ${unit}` : ""}
      </p>
      <div className="grid grid-cols-7 gap-1.5" role="grid" aria-label={ariaLabel}>
        {days.map((d, i) => (
          <span key={i} className="text-center text-[13px] font-semibold text-slate" aria-hidden>
            {d}
          </span>
        ))}
        {cells.map((v, i) =>
          v === null ? (
            <span key={i} />
          ) : (
            <button
              key={i}
              type="button"
              data-hit-area
              onMouseEnter={() => setSel(i - startWeekday)}
              onFocus={() => setSel(i - startWeekday)}
              onClick={() => setSel(i - startWeekday)}
              aria-label={`${dayLabel.replace("{d}", String(i - startWeekday + 1))}: ${formatIt(v)} ${unit}`}
              className={cn("aspect-square min-h-8 rounded-[8px] transition-transform hover:scale-110", sel === i - startWeekday && "ring-2 ring-ink")}
              style={{ background: col(v) }}
            />
          ),
        )}
      </div>
      <div className="mt-3 flex items-center gap-2 text-[13px] text-slate">
        {less}
        {scale.map((c) => (
          <span key={c} className="size-3 rounded-[4px]" style={{ background: c }} aria-hidden />
        ))}
        {more}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ 100 % stacked bar */
export function SplitBar({ parts }: { parts: { label: string; value: number; color: string; text?: string }[] }) {
  const total = parts.reduce((s, p) => s + p.value, 0);
  return (
    <div className="mt-4">
      <div className="flex h-12 overflow-hidden rounded-full">
        {parts.map((p) => (
          <div key={p.label} className="flex items-center justify-center text-[14px] font-bold" style={{ width: `${(p.value / total) * 100}%`, background: p.color, color: p.text ?? "var(--color-ink)" }}>
            {Math.round((p.value / total) * 100)}%
          </div>
        ))}
      </div>
      <ul className="mt-3 grid gap-1.5">
        {parts.map((p) => (
          <li key={p.label} className="flex items-center gap-2 text-[15px] text-ink">
            <span className="size-3 rounded-full" style={{ background: p.color }} aria-hidden />
            <span className="flex-1">{p.label}</span>
            <span className="font-semibold tabular-nums">{formatIt(p.value)} kWh</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
