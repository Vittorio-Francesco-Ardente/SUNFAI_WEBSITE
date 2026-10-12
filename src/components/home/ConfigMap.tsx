"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { ExternalLink, MapPin, Navigation, RotateCcw } from "lucide-react";
import { configurations, type ConfigStatus } from "@/lib/configurations";
import type { Dict } from "@/content/dict";

const ConfigMapGL = dynamic(() => import("./ConfigMapGL").then((m) => m.ConfigMapGL), { ssr: false });
const COLORS: Record<ConfigStatus, string> = { attiva: "#478A2B", "in-valutazione": "#CA9200", "in-progetto": "#F26722" };

/**
 * Map layout is intentionally stable even if the external tile server is unavailable.
 * Pin positions are approximate CABINA CENTRES, never actual primary-substation boundaries.
 */
export function ConfigMap({ t }: { t: Dict["home"]["map"] }) {
  const [selected, setSelected] = useState(configurations[0]?.code ?? "");
  const [view, setView] = useState<"overview" | "geographic">("overview");
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const onReady = useCallback(() => { setLoaded(true); setFailed(false); }, []);
  const onFailure = useCallback(() => { setFailed(true); setLoaded(false); }, []);
  const current = configurations.find((c) => c.code === selected) ?? configurations[0];
  if (!current) return null;

  const geographic = view === "geographic";
  const openGeographic = () => { setView("geographic"); setLoaded(false); setFailed(false); };
  const statusText = (status: ConfigStatus) => t.legend[status];

  return (
    <div className="grid min-w-0 gap-4">
      <div className="overflow-hidden rounded-[28px] border border-[var(--color-hairline)] bg-white shadow-[var(--shadow-soft)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-hairline)] p-3 sm:p-4">
          <p className="flex items-center gap-2 text-[14px] font-bold text-ink"><MapPin className="size-4 text-leaf-text" aria-hidden /> {t.title.replace(/\*/g, "")}</p>
          <div className="flex items-center gap-2">
            <button type="button" aria-pressed={!geographic} onClick={() => setView("overview")} className={`rounded-full px-3 py-2 text-[13px] font-semibold ${!geographic ? "bg-ink text-white" : "bg-paper-2 text-ink"}`}>{t.overview}</button>
            <button type="button" aria-pressed={geographic} onClick={openGeographic} className={`rounded-full px-3 py-2 text-[13px] font-semibold ${geographic ? "bg-ink text-white" : "bg-paper-2 text-ink"}`}>{t.geographic}</button>
          </div>
        </div>

        <div className="relative h-[340px] w-full bg-[#EAF2E4] sm:h-[400px] lg:h-[450px]">
          {/* Complete, keyboard-accessible locally rendered schematic — always visible as a fallback. */}
          {(!geographic || !loaded || failed) && (
            <div className="absolute inset-0 grid place-items-center px-3 py-5" aria-label={t.staticAlt}>
              <div className="w-full max-w-[680px]">
                <p className="mb-3 text-center text-[13px] font-semibold tracking-wide text-leaf-text">{t.approxArea}</p>
                <div className="relative mx-auto h-[230px] max-w-[500px] sm:h-[270px]">
                  <svg className="absolute inset-0 h-full w-full" viewBox="0 0 500 270" role="img" aria-label="Schema indicativo delle due configurazioni SUN-FAI, senza confini ufficiali">
                    <path d="M130 125 Q220 90 360 164" stroke="#C9DBBF" strokeWidth="2.5" fill="none" strokeDasharray="5 9" strokeLinecap="round" />
                  </svg>
                  {configurations.map((c, i) => (
                    <button
                      key={c.code}
                      type="button"
                      aria-pressed={selected === c.code}
                      aria-label={`${c.code}, ${statusText(c.status)}. ${c.comuni.join(", ")}`}
                      onClick={() => setSelected(c.code)}
                      className={`absolute z-10 grid min-h-[60px] min-w-[135px] place-items-center gap-1 rounded-2xl border-2 bg-white px-3 py-2 text-center text-[12px] shadow-[0_5px_20px_rgb(5_42_34/.12)] transition-transform focus-visible:outline-2 ${selected === c.code ? "scale-[1.04] border-[#478A2B]" : "border-white"}`}
                      style={{ left: i % 2 === 0 ? "3%" : undefined, right: i % 2 === 1 ? "3%" : undefined, top: i % 2 === 0 ? "25%" : "53%" }}
                    >
                      <span className="size-3 rounded-full" style={{ backgroundColor: COLORS[c.status] }} aria-hidden />
                      <strong className="text-ink">{c.code}</strong>
                      <span className="text-slate">{statusText(c.status)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {geographic && !failed && (
            <div className={`absolute inset-0 ${loaded ? "opacity-100" : "pointer-events-none opacity-0"}`}>
              <ConfigMapGL selected={selected} onSelect={setSelected} onReady={onReady} onFailure={onFailure} />
            </div>
          )}
          {geographic && !loaded && !failed && <p role="status" className="absolute bottom-3 left-3 right-3 z-20 rounded-xl bg-white/95 px-3 py-2 text-center text-[13px] text-ink">{t.loading} La panoramica resta consultabile.</p>}
          {geographic && failed && <div role="status" className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white p-3 shadow-sm"><span className="text-[13px] text-ink">{t.tileFailure}</span><button type="button" className="inline-flex items-center gap-1 rounded-full bg-paper-2 px-3 py-2 text-[13px] font-semibold text-ink" onClick={openGeographic}><RotateCcw className="size-4" aria-hidden/> {t.retry}</button></div>}
        </div>

        <div className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:p-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-ink px-3 py-1 text-[12px] font-bold text-white">{current.code}</span><span className="inline-flex items-center gap-2 rounded-full bg-paper-2 px-3 py-1 text-[12px] font-semibold text-ink"><span className="size-2.5 rounded-full" style={{ backgroundColor: COLORS[current.status] }} />{statusText(current.status)}</span></div>
            <p className="mt-3 text-[13px] font-bold text-ink">{t.affectedTowns}</p>
            <p className="mt-1 text-[15px] leading-relaxed text-slate">{current.comuni.join(" · ")}</p>
            <p className="mt-3 text-[12px] leading-relaxed text-slate">{t.approx} La posizione non rappresenta il perimetro della cabina primaria: per la verifica dell'utenza serve il codice POD.</p>
          </div>
          {current.center && <a className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-[var(--color-hairline)] bg-white px-4 text-[13px] font-semibold text-ink" href={`https://www.openstreetmap.org/?mlat=${current.center[1]}&mlon=${current.center[0]}#map=12/${current.center[1]}/${current.center[0]}`} target="_blank" rel="noopener noreferrer"><Navigation className="size-4" aria-hidden /> Vedi su OpenStreetMap <ExternalLink className="size-3.5" aria-hidden /></a>}
        </div>
      </div>
      <div className="flex flex-wrap gap-2" aria-label={t.legendLabel}>
        {configurations.map((c) => <button key={c.code} onClick={() => setSelected(c.code)} aria-pressed={selected === c.code} className={`rounded-full px-4 py-2.5 text-[13px] font-semibold shadow-[inset_0_0_0_1px_var(--color-hairline)] ${selected === c.code ? "bg-ink text-white" : "bg-white text-ink"}`}>{c.code}</button>)}
      </div>
    </div>
  );
}
