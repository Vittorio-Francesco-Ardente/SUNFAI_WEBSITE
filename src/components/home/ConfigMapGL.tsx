"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { comuniCoords, configurations } from "@/lib/configurations";
import { asset } from "@/lib/asset";

// The ESM build resolves its worker from import.meta.url, which breaks once bundled: serve it from /vendor.
maplibregl.setWorkerUrl(asset("/vendor/maplibre-gl-worker.mjs"));
import type { Dict } from "@/content/dict";

/** MapLibre GL with the light OpenFreeMap "positron" style. Lazy chunk: only requested when the map opens. */
export function ConfigMapGL({ statusColor, labels }: { statusColor: Record<string, string>; labels: Dict["home"]["map"] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const map = new maplibregl.Map({
      container: ref.current,
      style: "https://tiles.openfreemap.org/styles/positron",
      center: [9.598, 45.638],
      zoom: 11.2,
      cooperativeGestures: true,
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    for (const c of configurations) {
      for (const n of c.comuni) {
        const p = comuniCoords[n];
        if (!p) continue;
        const el = document.createElement("button");
        el.type = "button";
        el.setAttribute("aria-label", `${n} · ${c.code} · ${labels.legend[c.status]}`);
        el.style.cssText = `width:22px;height:22px;border-radius:999px;background:${statusColor[c.status]};border:3px solid #fff;box-shadow:0 2px 6px rgb(5 42 34/.3);cursor:pointer;transition:transform .2s`;
        el.onmouseenter = () => (el.style.transform = "scale(1.15)");
        el.onmouseleave = () => (el.style.transform = "");
        new maplibregl.Marker({ element: el })
          .setLngLat(p)
          .setPopup(new maplibregl.Popup({ offset: 14, closeButton: false }).setHTML(`<strong>${n}</strong><br/>${c.code} · ${labels.legend[c.status]}`))
          .addTo(map);
      }
    }
    return () => map.remove();
  }, [statusColor, labels]);
  return <div ref={ref} className="absolute inset-0" />;
}
