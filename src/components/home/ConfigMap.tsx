"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { ExternalLink, MapPin, Navigation, RotateCcw } from "lucide-react";
import { comuniCoords, configurations, type ConfigStatus } from "@/lib/configurations";
import type { Dict } from "@/content/dict";

const ConfigMapGL = dynamic(() => import("./ConfigMapGL").then((m) => m.ConfigMapGL), { ssr: false });
const STATUS: Record<ConfigStatus, string> = { attiva: "#478A2B", "in-valutazione": "#CA9200", "in-progetto": "#F26722" };
// Two shades distinguish the *groups*, not the legal status of the substations.
const GROUP = ["#367827", "#D27822"];

/** These are town-centre approximations, deliberately NOT primary substation boundaries. */
const towns = configurations.flatMap((c, group) => c.comuni.map((name) => ({ name, group, code: c.code, coord: comuniCoords[name] })).filter((c) => !!c.coord));
const allLng = towns.map((t) => t.coord[0]);
const allLat = towns.map((t) => t.coord[1]);
const west = Math.min(...allLng) - 0.016;
const east = Math.max(...allLng) + 0.016;
const south = Math.min(...allLat) - 0.012;
const north = Math.max(...allLat) + 0.012;
const position = ([lng, lat]: [number, number]) => ({ left: `${((lng - west) / (east - west)) * 100}%`, top: `${((north - lat) / (north - south)) * 100}%` });

/**
 * Real positions of the towns in the SUN-FAI configurations. Local interactive
 * fallback remains available offline; geographical tiles are progressive enhancement.
 */
export function ConfigMap({ t }: { t: Dict["home"]["map"] }) {
  const [selected, setSelected] = useState(configurations[0]?.code ?? "");
  const [view, setView] = useState<"overview" | "geographic">("geographic");
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [townSelected, setTownSelected] = useState<string | null>(null);
  const onReady = useCallback(() => { setLoaded(true); setFailed(false); }, []);
  const onFailure = useCallback(() => { setFailed(true); setLoaded(false); }, []);
  const current = configurations.find((c) => c.code === selected) ?? configurations[0];
  if (!current) return null;
  const geographic = view === "geographic";
  const openGeographic = () => { setView("geographic"); setLoaded(false); setFailed(false); };
  const statusText = (status: ConfigStatus) => t.legend[status];
  const selectedTown = towns.find((town) => town.name === townSelected && town.code === selected);
  const switchGroup = (code: string) => { setSelected(code); setTownSelected(null); if (geographic) { setLoaded(false); setFailed(false); } };

  return (
    <div className="grid min-w-0 gap-4">
      <div className="overflow-hidden rounded-[28px] border border-[var(--color-hairline)] bg-white shadow-[var(--shadow-soft)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-hairline)] bg-white px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-2 font-bold text-ink">
            <MapPin className="size-5 shrink-0 text-leaf-text" aria-hidden />
            <span className="text-[15px]">{t.title.replace(/\*/g, "")}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2" aria-label={t.legendLabel}>
            <button type="button" aria-pressed={!geographic} onClick={() => setView("overview")} className={`rounded-full px-3.5 py-2.5 text-[13px] font-semibold transition-colors ${!geographic ? "bg-ink text-white" : "bg-paper-2 text-ink"}`}>{t.overview}</button>
            <button type="button" aria-pressed={geographic} onClick={openGeographic} className={`rounded-full px-3.5 py-2.5 text-[13px] font-semibold transition-colors ${geographic ? "bg-ink text-white" : "bg-paper-2 text-ink"}`}>{t.geographic}</button>
          </div>
        </div>

        <div className="relative h-[325px] w-full bg-[#EDF3E8] sm:h-[400px] lg:h-[445px]">
          {/* The schematic remains instantly interactive, even while geographical tiles load or fail. */}
          {(!geographic || !loaded || failed) && (
            <div className="absolute inset-0 overflow-hidden" role="group" aria-label={t.staticAlt}>
              <div className="pointer-events-none absolute inset-0" aria-hidden>
                <svg viewBox="0 0 800 420" preserveAspectRatio="none" className="h-full w-full">
                  <g stroke="#DDE8D6" strokeWidth="1">
                    {[100, 200, 300, 400, 500, 600, 700].map((x) => <line key={`x${x}`} x1={x} y1={0} x2={x} y2={420} />)}
                    {[84, 168, 252, 336].map((y) => <line key={`y${y}`} x1={0} y1={y} x2={800} y2={y} />)}
                  </g>
                </svg>
              </div>
              <div className="pointer-events-none absolute inset-x-3 top-3 flex justify-center sm:top-5">
                <span className="rounded-full border border-[#D4E3CA] bg-white/95 px-4 py-2 text-center text-[12px] font-semibold tracking-wide text-leaf-text sm:text-[13px]">{t.approxArea} · {t.approx}</span>
              </div>
              {/* Coarse georeferenced town positions, without suggesting fake roads or administrative boundaries. */}
              <div className="absolute inset-x-[8%] bottom-[12%] top-[18%] sm:inset-x-[14%] sm:bottom-[12%] sm:top-[19%]">
                {towns.map((town) => {
                  const chosen = selected === town.code;
                  const focus = chosen && townSelected === town.name;
                  const c = GROUP[town.group % GROUP.length];
                  return (
                    <button key={`${town.code}:${town.name}`} type="button" style={position(town.coord)} onClick={() => { setSelected(town.code); setTownSelected(town.name); }}
                      aria-label={`${town.name} · ${town.code}`} aria-pressed={focus}
                      className={`group absolute z-10 grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] border-white shadow-[0_2px_5px_rgb(5_42_34/.24)] transition-[transform,box-shadow] duration-150 hover:z-20 hover:scale-110 focus-visible:z-20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink sm:size-8 ${chosen ? "opacity-100" : "opacity-55"}`}
                      title={`${town.name} · ${town.code}`}>
                      <span className="size-full rounded-full" style={{ backgroundColor: c }} aria-hidden />
                      {focus && <span className="pointer-events-none absolute -inset-[6px] rounded-full border-2" style={{ borderColor: c }} />}
                      <span className="pointer-events-none absolute left-1/2 top-[calc(100%+6px)] hidden -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[12px] font-semibold text-ink shadow-sm group-hover:block group-focus-visible:block sm:group-aria-pressed:block">{town.name}</span>
                    </button>
                  );
                })}
              </div>
              <p className="pointer-events-none absolute bottom-3 left-4 right-4 text-center text-[12px] text-leaf-text sm:bottom-5">{t.comuni}: {towns.length} · {configurations.length} configurazioni · {t.approx}</p>
            </div>
          )}
          {geographic && !failed && (
            <div className={`absolute inset-0 ${loaded ? "opacity-100" : "pointer-events-none opacity-0"}`}>
              <ConfigMapGL selected={selected} onSelect={switchGroup} onReady={onReady} onFailure={onFailure} />
            </div>
          )}
          {geographic && !loaded && !failed && <p role="status" className="pointer-events-none absolute bottom-3 left-3 right-3 z-20 rounded-xl bg-white px-3 py-2 text-center text-[13px] text-ink shadow-sm">{t.loading} La panoramica resta consultabile.</p>}
          {geographic && failed && <div role="status" className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white p-3 shadow-sm"><span className="text-[13px] text-ink">{t.tileFailure}</span><div className="flex gap-2"><button type="button" className="inline-flex items-center gap-1 rounded-full bg-paper-2 px-3 py-2 text-[13px] font-semibold text-ink" onClick={() => setView("overview")}>{t.overview}</button><button type="button" className="inline-flex items-center gap-1 rounded-full bg-paper-2 px-3 py-2 text-[13px] font-semibold text-ink" onClick={openGeographic}><RotateCcw className="size-4" aria-hidden />{t.retry}</button></div></div>}
        </div>

        <div className="grid gap-3 bg-white p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:p-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-ink px-3 py-1 text-[12px] font-bold text-white">{current.code}</span><span className="inline-flex items-center gap-2 rounded-full bg-paper-2 px-3 py-1 text-[12px] font-semibold text-ink"><span className="size-2.5 rounded-full" style={{ backgroundColor: STATUS[current.status] }} />{statusText(current.status)}</span></div>
            <p className="mt-3 text-[13px] font-bold text-ink">{selectedTown ? `${selectedTown.name} · ${t.affectedTowns}` : t.affectedTowns}</p>
            <p className="mt-1 text-[14px] leading-relaxed text-slate sm:text-[15px]">{current.comuni.join(" · ")}</p>
            <p className="mt-3 max-w-[46rem] text-[12px] leading-relaxed text-slate">{t.approx} La posizione non rappresenta il perimetro della cabina primaria: per verificare l’utenza serve il codice POD.</p>
          </div>
          {current.center && <a className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full border border-[var(--color-hairline)] bg-white px-4 text-[13px] font-semibold text-ink" href={`https://www.openstreetmap.org/?mlat=${current.center[1]}&mlon=${current.center[0]}#map=12/${current.center[1]}/${current.center[0]}`} target="_blank" rel="noopener noreferrer"><Navigation className="size-4" aria-hidden />Vedi su OpenStreetMap <ExternalLink className="size-3.5" aria-hidden /></a>}
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2" aria-label={t.legendLabel}>
        {configurations.map((c, idx) => <button type="button" key={c.code} onClick={() => switchGroup(c.code)} aria-pressed={selected === c.code} className={`flex min-w-0 items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-[14px] shadow-sm transition-colors ${selected === c.code ? "border-leaf bg-[#EDF4E8] text-ink" : "border-[var(--color-hairline)] bg-white text-ink"}`}>
          <span className="flex min-w-0 items-center gap-3"><span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: GROUP[idx % GROUP.length] }} aria-hidden /><span className="min-w-0 font-bold">{c.code}</span></span>
          <span className="shrink-0 text-[12px] text-slate">{c.comuni.length} {t.comuni.toLowerCase()}</span>
        </button>)}
      </div>
    </div>
  );
}
