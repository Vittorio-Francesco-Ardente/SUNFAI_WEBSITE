import { Lightbulb, Sun, Zap } from "lucide-react";
import { sector } from "@/components/geometry/shapes";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";
import { dayProfile, formatInt, totals } from "@/lib/demo-energy";
import type { Dict } from "@/content/dict";

/**
 * Phone mockup with a CRISP live-HTML screen (never a bitmap, never a cropped shape inside the screen — FEEDBACK_01).
 * V3 (16.5): the screen always shows the APP, never a splash and never the SUN-FAI mark. "app" (Ardaké hero): logotype
 * (no micro text), dark KPI card with hourly bars, Prodotta / Consumata, a sunburst fragment, "Dati dimostrativi".
 * "dashboard": the same plus the "Demo" chip and a tip card.
 * Drawn at 270 px wide; scale it from the parent with `--phone-scale`.
 */
export function PhoneMockup({ t, label, variant = "dashboard", className }: { t: Dict["ardake"]["phone"]; label: string; variant?: "app" | "dashboard"; className?: string }) {
  const points = dayProfile({ peak: 19, base: 9, midday: 6 });
  const tot = totals(points);
  const max = Math.max(...points.map((p) => Math.max(p.production, p.consumption)));
  const pct = Math.round(tot.sharedRatio * 100);
  const app = variant === "app";
  return (
    <div role="img" aria-label={label} className={cn("relative aspect-[9/19] w-[270px] rounded-[46px] bg-[#9a9890] p-[3px] shadow-[0_40px_60px_-30px_rgb(5_42_34/.45)]", className)}>
      {/* titanium frame: flat bands, no gradient */}
      <div aria-hidden="true" className="h-full rounded-[43px] bg-[#1c1d1f] p-[8px]">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[36px] bg-white">
          <div className="relative flex h-9 shrink-0 items-center justify-between px-6 pt-1 text-[11px] font-semibold text-ink" aria-hidden>
            <span>9:41</span>
            <span className="absolute left-1/2 top-[9px] h-[22px] w-[78px] -translate-x-1/2 rounded-full bg-[#1c1d1f]" />
            <svg viewBox="0 0 34 12" className="h-[10px] w-[30px]" fill="currentColor">
              <rect x="0" y="7" width="2.6" height="4" rx=".8" />
              <rect x="4" y="5" width="2.6" height="6" rx=".8" />
              <rect x="8" y="3" width="2.6" height="8" rx=".8" />
              <rect x="15.5" y="1" width="16" height="10" rx="2.6" fill="none" stroke="currentColor" strokeWidth="1.1" />
              <rect x="17.3" y="2.8" width="10.5" height="6.4" rx="1.4" />
            </svg>
          </div>

          {(
            <div className="flex flex-1 flex-col">
              <div className="flex items-center justify-between px-5 pt-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset("/ardake/ardake-logotype-vector.svg")} alt="Ardaké" className="h-auto w-[104px]" width={104} height={31} />
                {app ? null : <span className="rounded-full bg-sage px-2.5 py-1 text-[10px] font-semibold text-leaf-text">{t.demo}</span>}
              </div>
              <div className="mx-4 mt-3 rounded-[22px] bg-ink p-4 text-white">
                <p className="text-[11px] font-medium text-white/75">{t.today}</p>
                <p className="mt-1 font-display text-[2.6rem] font-extrabold leading-none tracking-[-0.05em]">
                  {pct}
                  <span className="text-solar">%</span>
                </p>
                <p className="text-[11px] leading-snug text-white/80">{t.shared}</p>
                <div className="mt-3 flex h-14 items-end gap-[3px]" aria-hidden>
                  {points.map((p) => (
                    <span key={p.hour} className="relative flex-1 rounded-t-[3px] bg-white/15" style={{ height: `${(p.consumption / max) * 100}%` }}>
                      <span className="absolute inset-x-0 bottom-0 rounded-t-[3px] bg-solar" style={{ height: `${(p.shared / Math.max(p.consumption, 0.001)) * 100}%` }} />
                    </span>
                  ))}
                </div>
              </div>
              <div className="mx-4 mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-2xl bg-[#FDF0C8] p-3">
                  <Sun className="size-3.5 text-orange-text" aria-hidden />
                  <p className="mt-1.5 text-[10px] font-medium text-ink/70">{t.produced}</p>
                  <p className="font-display text-[1.05rem] font-extrabold tracking-[-0.03em] text-ink">{formatInt(tot.production)} kWh</p>
                </div>
                <div className="rounded-2xl bg-sage p-3">
                  <Zap className="size-3.5 text-leaf-text" aria-hidden />
                  <p className="mt-1.5 text-[10px] font-medium text-ink/70">{t.consumed}</p>
                  <p className="font-display text-[1.05rem] font-extrabold tracking-[-0.03em] text-ink">{formatInt(tot.consumption)} kWh</p>
                </div>
              </div>
              {app ? null : (
              <div className="mx-4 mt-3 flex items-start gap-2.5 rounded-2xl border border-[var(--color-hairline)] p-3">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-peach-light">
                  <Lightbulb className="size-3.5 text-orange-text" aria-hidden />
                </span>
                <p className="text-[11px] leading-snug text-ink/80">
                  <span className="font-semibold text-ink">{t.tipLabel}</span> {t.tip}
                </p>
              </div>
              )}
              {app ? (
                <div className="relative mt-auto h-[92px]">
                  {/* sunburst fragment in the lower-left corner (complete sectors, cropped only by the screen corner) */}
                  <svg viewBox="0 0 120 120" className="absolute bottom-0 left-0 w-[96px]" aria-hidden>
                    <path d={sector(0, 120, 44, 110, 12, 30)} fill="#C9E1A0" />
                    <path d={sector(0, 120, 44, 110, 36, 54)} fill="#FECF49" />
                    <path d={sector(0, 120, 44, 110, 60, 78)} fill="#C9E1A0" />
                    <circle cx="0" cy="120" r="34" fill="#FE5F00" />
                  </svg>
                  <span className="absolute bottom-2 right-4 rounded-full bg-[#F4EFE6] px-2.5 py-1 text-[10px] font-semibold text-ink/80">{t.demoData}</span>
                </div>
              ) : null}
            </div>
          )}
          <div className="flex shrink-0 justify-center pb-2 pt-3" aria-hidden>
            <span className="h-1 w-24 rounded-full bg-ink/80" />
          </div>
        </div>
      </div>
    </div>
  );
}
