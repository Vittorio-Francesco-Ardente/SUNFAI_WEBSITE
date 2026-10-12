"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { configurations } from "@/lib/configurations";

/**
 * Lightweight geographic map for GitHub Pages. OSM's interactive embed works
 * without WebGL, map workers, application tokens or an API server. The parent
 * keeps the SUN-FAI town overview available if the provider is unavailable.
 * Markers are approximate town-centre references, NOT cabina boundaries.
 */
export function ConfigMapGL({ selected, onSelect: _onSelect, onReady, onFailure }: {
  selected: string;
  onSelect: (code: string) => void;
  onReady: () => void;
  onFailure: () => void;
}) {
  const [touchMapEnabled, setTouchMapEnabled] = useState(false);
  const timeoutRef = useRef(0);
  const onReadyRef = useRef(onReady);
  const onFailureRef = useRef(onFailure);
  useEffect(() => { onReadyRef.current = onReady; onFailureRef.current = onFailure; }, [onReady, onFailure]);
  const mapUrl = useMemo(() => {
    const c = configurations.find((item) => item.code === selected) ?? configurations[0];
    const center = c?.center ?? [9.60, 45.64];
    // A sufficiently wide, common view of both SUN-FAI configurations.
    const bbox = [9.52, 45.565, 9.705, 45.715].join(",");
    const params = new URLSearchParams({ bbox, layer: "mapnik", marker: `${center[1]},${center[0]}` });
    return `https://www.openstreetmap.org/export/embed.html?${params.toString()}`;
  }, [selected]);

  useEffect(() => {
    timeoutRef.current = window.setTimeout(() => onFailureRef.current(), 11000);
    return () => window.clearTimeout(timeoutRef.current);
  }, [mapUrl]);

  return (
    <>
      <iframe
        key={mapUrl}
        title={`Mappa interattiva OpenStreetMap – configurazione ${selected}`}
        src={mapUrl}
        className={`absolute inset-0 h-full w-full border-0 md:pointer-events-auto ${touchMapEnabled ? "pointer-events-auto" : "pointer-events-none"}`}
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={() => { window.clearTimeout(timeoutRef.current); onReadyRef.current(); }}
        onError={() => { window.clearTimeout(timeoutRef.current); onFailureRef.current(); }}
      />
      <button type="button" onClick={() => setTouchMapEnabled((enabled) => !enabled)}
        className="absolute bottom-3 left-3 z-10 rounded-full border border-[var(--color-hairline)] bg-white px-4 py-2 text-[12px] font-semibold text-ink shadow-sm md:hidden"
        aria-pressed={touchMapEnabled}>
        {touchMapEnabled ? "Torna a scorrere la pagina" : "Esplora la mappa"}
      </button>
    </>
  );
}
