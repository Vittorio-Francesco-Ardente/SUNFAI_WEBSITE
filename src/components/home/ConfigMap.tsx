"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { ArrowRight, Map as MapIcon } from "lucide-react";
import { comuniCoords, configurations, type ConfigStatus } from "@/lib/configurations";
import { cn } from "@/lib/cn";
import type { Dict } from "@/content/dict";

const MapGL = dynamic(() => import("./ConfigMapGL").then((m) => m.ConfigMapGL), { ssr: false });

export const STATUS_COLOR: Record<ConfigStatus, string> = { attiva: "#478A2B", "in-valutazione": "#E3A400", "in-progetto": "#F26722" };

/**
 * Configurations map: the schematic view is always alive and clickable.
 * The real interactive map opens only on explicit user request, avoiding blank/ambiguous states.
 */
export function ConfigMap({ t }: { t: Dict["home"]["map"] }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>(configurations[0]?.code ?? "");

  const all = Object.values(comuniCoords);
  const [minX, maxX] = [Math.min(...all.map((c) => c[0])) - 0.03, Math.max(...all.map((c) => c[0])) + 0.03];
  const [minY, maxY] = [Math.min(...all.map((c) => c[1])) - 0.02, Math.max(...all.map((c) => c[1])) + 0.02];
  const W = 400;
  const H = 500;
  const px = (lng: number) => ((lng - minX) / (maxX - minX)) * W;
  const py = (lat: number) => H - ((lat - minY) / (maxY - minY)) * H;

  const details = useMemo(() => {
    return configurations.map((c) => {
      const pts = c.comuni.map((n) => comuniCoords[n]).filter(Boolean);
      const fallback: [number, number] = [
        pts.reduce((s, p) => s + p[0], 0) / pts.length,
        pts.reduce((s, p) => s + p[1], 0) / pts.length,
      ];
      const center = c.center ?? fallback;
      const cx = px(center[0]);
      const cy = py(center[1]);
      return { ...c, pts, cx, cy, center };
    });
  }, []);

  const current = details.find((c) => c.code === active) ?? details[0];

  return (
    <div className="grid gap-4">
      <div className="card relative overflow-hidden !rounded-[var(--radius-feature)] bg-mint">
        <div className="relative aspect-[4/5] md:aspect-[4/3.4]">
          {open ? (
            <MapGL statusColor={STATUS_COLOR} labels={t} selected={active} onSelect={setActive} />
          ) : (
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t.staticAlt} className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
              <rect width={W} height={H} fill="var(--color-mint)" />
              <path d="M-20 120 C80 160 140 140 210 210 C280 280 330 300 420 330" fill="none" stroke="#DCEAF0" strokeWidth="18" strokeLinecap="round" />
              <path d="M40 -10 L120 520 M300 -10 L250 520 M-10 260 L420 230" stroke="rgb(5 42 34 / .06)" strokeWidth="6" />
              {details.map((c) => {
                const isActive = c.code === active;
                return (
                  <g key={c.code} className="cursor-pointer" onClick={() => setActive(c.code)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setActive(c.code))} tabIndex={0} role="button" aria-pressed={isActive}>
                    <circle cx={c.cx} cy={c.cy} r={isActive ? 54 : 46} fill={STATUS_COLOR[c.status]} opacity={isActive ? 0.18 : 0.1} />
                    {c.pts.map((p, i) => (
                      <circle key={i} cx={px(p[0])} cy={py(p[1])} r={isActive ? 7.5 : 6.2} fill={STATUS_COLOR[c.status]} stroke="#fff" strokeWidth="3" />
                    ))}
                    <circle cx={c.cx} cy={c.cy} r={isActive ? 12 : 10} fill={STATUS_COLOR[c.status]} stroke="#fff" strokeWidth="4" />
                    <text x={c.cx} y={c.cy - (isActive ? 64 : 56)} textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--color-ink)">
                      {c.code}
                    </text>
                  </g>
                );
              })}
              {Object.entries(comuniCoords).map(([n, p]) => (
                <text key={n} x={px(p[0]) + 10} y={py(p[1]) + 4} fontSize="13" fill="var(--color-slate)" fontWeight="500">
                  {n}
                </text>
              ))}
            </svg>
          )}
        </div>

        <div className="absolute inset-x-3 bottom-3 z-[2] sm:inset-x-4 sm:bottom-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <article className="rounded-[24px] bg-white/96 p-4 shadow-[0_0_0_1px_var(--color-hairline),var(--shadow-soft)] backdrop-blur">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-ink px-3 py-1 text-[12px] font-semibold text-white">{current.code}</span>
                <span className="pill">
                  <span className="mr-2 inline-block size-2.5 rounded-full align-middle" style={{ background: STATUS_COLOR[current.status] }} aria-hidden />
                  {t.legend[current.status]}
                </span>
              </div>
              <p className="text-[14px] font-semibold text-ink">{t.comuni}</p>
              <p className="mt-1 text-[14px] leading-relaxed text-slate">{current.comuni.join(", ")}</p>
            </article>
            {!open ? (
              <button type="button" onClick={() => setOpen(true)} className="btn btn--light btn--md justify-self-start lg:justify-self-end">
                <MapIcon aria-hidden strokeWidth={2} />
                {t.open}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2" aria-label={t.legendLabel}>
        {(Object.keys(STATUS_COLOR) as ConfigStatus[]).map((s) => (
          <button key={s} type="button" onClick={() => setActive(details.find((d) => d.status === s)?.code ?? active)} className={cn("pill gap-2 !bg-card !text-[14px] shadow-[inset_0_0_0_1px_var(--color-hairline)]", current.status === s && "!bg-white") }>
            <span className="size-3 rounded-full" style={{ background: STATUS_COLOR[s] }} aria-hidden />
            {t.legend[s]}
          </button>
        ))}
        <span className="t-meta ml-1">{t.approx}</span>
        {open ? <span className="t-meta inline-flex items-center gap-1"><ArrowRight className="size-3.5" aria-hidden /> {t.attribution}</span> : null}
      </div>
    </div>
  );
}
