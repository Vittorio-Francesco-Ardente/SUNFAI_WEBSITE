"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Map as MapIcon } from "lucide-react";
import { comuniCoords, configurations, type ConfigStatus } from "@/lib/configurations";
import type { Dict } from "@/content/dict";

const MapGL = dynamic(() => import("./ConfigMapGL").then((m) => m.ConfigMapGL), { ssr: false });

export const STATUS_COLOR: Record<ConfigStatus, string> = { attiva: "#478A2B", "in-valutazione": "#E3A400", "in-progetto": "#F26722" };

/**
 * Configurations map (IA §8): a static schematic SVG first (no third-party request, no scroll trap).
 * MapLibre (OpenFreeMap tiles) loads only on demand: after the tap on phones, near the viewport on desktop
 * (unless Save-Data). Once open it uses cooperativeGestures.
 */
export function ConfigMap({ t }: { t: Dict["home"]["map"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    const desktop = matchMedia("(min-width: 1024px) and (hover: hover)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (!el || !desktop || saveData || /[?&]test/.test(location.search)) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setOpen(true), io.disconnect()), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // schematic projection
  const all = Object.values(comuniCoords);
  const [minX, maxX] = [Math.min(...all.map((c) => c[0])) - 0.03, Math.max(...all.map((c) => c[0])) + 0.03];
  const [minY, maxY] = [Math.min(...all.map((c) => c[1])) - 0.02, Math.max(...all.map((c) => c[1])) + 0.02];
  const W = 400;
  const H = 500;
  const px = (lng: number) => ((lng - minX) / (maxX - minX)) * W;
  const py = (lat: number) => H - ((lat - minY) / (maxY - minY)) * H;

  return (
    <div ref={ref} className="grid gap-4">
      <div className="card relative overflow-hidden !rounded-[var(--radius-feature)] bg-mint">
        <div className="relative aspect-[4/5] md:aspect-[4/3.4]">
          {open ? (
            <MapGL statusColor={STATUS_COLOR} labels={t} />
          ) : (
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t.staticAlt} className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
              <rect width={W} height={H} fill="var(--color-mint)" />
              {/* flat contour fields: a river band and a road grid hint */}
              <path d="M-20 120 C80 160 140 140 210 210 C280 280 330 300 420 330" fill="none" stroke="#DCEAF0" strokeWidth="18" strokeLinecap="round" />
              <path d="M40 -10 L120 520 M300 -10 L250 520 M-10 260 L420 230" stroke="rgb(5 42 34 / .06)" strokeWidth="6" />
              {configurations.map((c) => {
                const pts = c.comuni.map((n) => comuniCoords[n]).filter(Boolean);
                const cx = pts.reduce((s, p) => s + px(p[0]), 0) / pts.length;
                const cy = pts.reduce((s, p) => s + py(p[1]), 0) / pts.length;
                const r = Math.max(...pts.map((p) => Math.hypot(px(p[0]) - cx, py(p[1]) - cy))) + 34;
                return (
                  <g key={c.code} onMouseEnter={() => setActive(c.code)} onMouseLeave={() => setActive(null)}>
                    <circle cx={cx} cy={cy} r={r} fill={STATUS_COLOR[c.status]} opacity={active === c.code ? 0.2 : 0.12} />
                    {pts.map((p, i) => (
                      <circle key={i} cx={px(p[0])} cy={py(p[1])} r={active === c.code ? 9 : 7.5} fill={STATUS_COLOR[c.status]} stroke="#fff" strokeWidth="3" style={{ transition: "r .2s" }} />
                    ))}
                    <text x={cx} y={cy - r - 8} textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--color-ink)">
                      {c.code}
                    </text>
                  </g>
                );
              })}
              {Object.entries(comuniCoords).map(([n, p]) => (
                <text key={n} x={px(p[0]) + 12} y={py(p[1]) + 5} fontSize="14" fill="var(--color-slate)" fontWeight="500">
                  {n}
                </text>
              ))}
            </svg>
          )}
        </div>
        {!open ? (
          <button type="button" onClick={() => setOpen(true)} className="btn btn--light btn--md absolute bottom-4 left-1/2 -translate-x-1/2">
            <MapIcon aria-hidden strokeWidth={2} />
            {t.open}
          </button>
        ) : null}
      </div>
      <ul className="flex flex-wrap items-center gap-2" aria-label={t.legendLabel}>
        {(Object.keys(STATUS_COLOR) as ConfigStatus[]).map((s) => (
          <li key={s} className="pill gap-2 !bg-card !text-[14px] shadow-[inset_0_0_0_1px_var(--color-hairline)]">
            <span className="size-3 rounded-full" style={{ background: STATUS_COLOR[s] }} aria-hidden />
            {t.legend[s]}
          </li>
        ))}
        <li className="t-meta ml-1">{t.approx}</li>
      </ul>
    </div>
  );
}
