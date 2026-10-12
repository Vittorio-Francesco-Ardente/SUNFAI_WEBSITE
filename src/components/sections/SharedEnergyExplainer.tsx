"use client";

import { useId, useMemo, useState } from "react";
import { area as d3area, curveMonotoneX, line as d3line } from "d3-shape";
import { scaleLinear } from "d3-scale";
import { Factory, Sun, Users } from "lucide-react";
import { InfoDot } from "@/components/ardake/Giorgio";
import { loadCurve, solarCurve, formatInt as fmt } from "@/lib/demo-energy";
import type { Dict } from "@/content/dict";

const STEP = 0.25;
function profile(shift: number) {
  const pts: { h: number; p: number; c: number }[] = [];
  for (let h = 0; h <= 24; h += STEP) {
    const p = solarCurve(10, h);
    const base = loadCurve(4.2, h);
    const evening = Math.exp(-Math.pow((h - 20) / 2.1, 2)) * 4.2 * 1.25;
    const midday = Math.exp(-Math.pow((h - 12.8) / 2.1, 2)) * 4.2 * 1.25;
    pts.push({ h, p, c: base - evening * shift + midday * shift });
  }
  return pts;
}

const C = { prod: "#E3A400", prodTint: "#FECF49", cons: "#478A2B", shared: "#F26722" };

/**
 * "Conta l'ora in cui consumi" (demo shared-energy-explainer, restyled): production vs consumption, the slider
 * "Sposta i consumi verso mezzogiorno", the shared area as a FLAT orange fill, numbers updating, disclaimer.
 * Phones: the three actors stacked, slider full width with a 48 px thumb. InfoDots open Giorgio.
 */
export function SharedEnergyExplainer({ t }: { t: Dict["pages"]["leCer"]["explainer"] }) {
  const [shift, setShift] = useState(0.15);
  const id = useId();
  const pts = useMemo(() => profile(shift), [shift]);
  const W = 720, H = 300, P = { l: 36, r: 12, t: 16, b: 30 };
  const x = scaleLinear().domain([0, 24]).range([P.l, W - P.r]);
  const y = scaleLinear().domain([0, 11]).range([H - P.b, P.t]);
  const shared = pts.map((d) => Math.min(d.p, d.c));
  const lineP = d3line<(typeof pts)[number]>().x((d) => x(d.h)).y((d) => y(d.p)).curve(curveMonotoneX)(pts)!;
  const lineC = d3line<(typeof pts)[number]>().x((d) => x(d.h)).y((d) => y(d.c)).curve(curveMonotoneX)(pts)!;
  const areaP = d3area<(typeof pts)[number]>().x((d) => x(d.h)).y0(y(0)).y1((d) => y(d.p)).curve(curveMonotoneX)(pts)!;
  const areaS = d3area<number>().x((_, i) => x(pts[i].h)).y0(y(0)).y1((v) => y(v)).curve(curveMonotoneX)(shared)!;
  const totP = pts.reduce((s, d) => s + d.p * STEP, 0);
  const totC = pts.reduce((s, d) => s + d.c * STEP, 0);
  const totS = shared.reduce((s, v) => s + v * STEP, 0);
  const ratio = totS / totP;
  const pct = Math.round(shift * 100);
  const actors = [Sun, Factory, Users];

  return (
    <div className="card p-5 sm:p-8 lg:p-10">
      {/* actors: plant → grid/cabina → members (vertical on phones) */}
      <ol className="mb-6 grid gap-2 sm:grid-cols-3" aria-hidden>
        {t.actors.map((a, i) => {
          const Icon = actors[i];
          return (
            <li key={a} className="flex items-center gap-3 rounded-2xl bg-paper-2 px-4 py-3 text-[15px] font-semibold text-ink">
              <Icon className="size-5 text-orange-text" aria-hidden />
              {a}
            </li>
          );
        })}
      </ol>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ul className="mb-3 flex flex-wrap gap-2 text-[14px] text-slate">
            <li className="pill gap-2 !text-[14px]">
              <span className="h-[3px] w-5 rounded-full" style={{ background: C.prod }} aria-hidden /> {t.production}
            </li>
            <li className="pill gap-2 !text-[14px]">
              <span className="h-[3px] w-5 rounded-full" style={{ background: C.cons }} aria-hidden /> {t.consumption}
            </li>
            <li className="pill gap-2 !text-[14px]">
              <span className="h-3 w-5 rounded-sm" style={{ background: C.shared, opacity: 0.45 }} aria-hidden /> {t.shared}
              <InfoDot topic="energia-condivisa" className="ml-1 !size-6" />
            </li>
          </ul>
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby={`${id}-t`}>
            <title id={`${id}-t`}>{t.chartTitle.replace("{s}", fmt(totS)).replace("{p}", fmt(totP))}</title>
            {[0, 2.5, 5, 7.5, 10].map((v) => (
              <g key={v}>
                <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke="rgb(5 42 34 / .07)" />
                <text x={P.l - 8} y={y(v) + 4} textAnchor="end" fontSize="12" fill="var(--color-slate)">
                  {v}
                </text>
              </g>
            ))}
            {[0, 6, 12, 18, 24].map((h) => (
              <text key={h} x={x(h)} y={H - 8} textAnchor="middle" fontSize="12" fill="var(--color-slate)">
                {`${h}:00`}
              </text>
            ))}
            <path d={areaP} fill={C.prodTint} fillOpacity={0.18} />
            <path d={areaS} fill={C.shared} fillOpacity={0.3} />
            <path d={lineC} fill="none" stroke={C.cons} strokeWidth={2.75} strokeLinejoin="round" strokeLinecap="round" />
            <path d={lineP} fill="none" stroke={C.prod} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex flex-col lg:col-span-4">
          <label htmlFor={`${id}-r`} className="font-display text-[1.15rem] font-extrabold tracking-[-0.02em] text-ink">
            {t.sliderLabel}
          </label>
          <p className="t-body mt-2 !text-[16px]">{t.sliderText}</p>
          <input
            id={`${id}-r`}
            type="range"
            min={0}
            max={0.8}
            step={0.01}
            value={shift}
            onChange={(e) => setShift(Number(e.target.value))}
            className="sf-range mt-4"
            aria-valuetext={t.valueText.replace("{v}", String(pct))}
          />
          <div className="flex justify-between text-[13px] text-slate">
            <span>{t.asToday}</span>
            <span>{t.moved.replace("{v}", String(pct))}</span>
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#FDF0C8] p-4">
              <dt className="text-[13px] font-medium text-ink/75">{t.produced}</dt>
              <dd className="font-display text-xl font-extrabold tracking-[-0.03em]">{fmt(totP)} kWh</dd>
            </div>
            <div className="rounded-2xl bg-mint p-4">
              <dt className="text-[13px] font-medium text-ink/75">{t.consumed}</dt>
              <dd className="font-display text-xl font-extrabold tracking-[-0.03em]">{fmt(totC)} kWh</dd>
            </div>
            <div className="col-span-2 rounded-2xl bg-ink p-4 text-white">
              <dt className="text-[13px] font-medium text-white/75">{t.shared}</dt>
              <dd className="flex items-baseline gap-2 font-display text-[2rem] font-extrabold tracking-[-0.04em]" aria-live="polite">
                {fmt(totS)} kWh <span className="text-base font-bold text-solar">{Math.round(ratio * 100)}%</span>
              </dd>
            </div>
          </dl>
          <p className="t-meta mt-4">{t.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}
