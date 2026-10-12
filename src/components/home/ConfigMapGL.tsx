"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { configurations } from "@/lib/configurations";
import { asset } from "@/lib/asset";

maplibregl.setWorkerUrl(asset("/vendor/maplibre-gl-worker.mjs"));

/** Actual geographic base map. The parent preserves an interactive static fallback on network failure. */
export function ConfigMapGL({ selected, onSelect, onReady, onFailure }: {
  selected: string;
  onSelect: (code: string) => void;
  onReady: () => void;
  onFailure: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const readyRef = useRef(false);
  const latest = useRef({ onSelect, onReady, onFailure });
  useEffect(() => { latest.current = { onSelect, onReady, onFailure }; }, [onSelect, onReady, onFailure]);

  useEffect(() => {
    if (!ref.current) return;
    const map = new maplibregl.Map({
      container: ref.current,
      style: {
        version: 8,
        sources: { osm: { type: "raster", tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"], tileSize: 256, attribution: "© OpenStreetMap contributors" } },
        layers: [{ id: "osm", type: "raster", source: "osm" }],
      },
      center: [9.60, 45.64], zoom: 11,
      attributionControl: { compact: true }, cooperativeGestures: true,
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    const timer = window.setTimeout(() => { if (!readyRef.current) latest.current.onFailure(); }, 10000);
    const fail = () => { if (!readyRef.current) latest.current.onFailure(); };
    map.on("error", fail);
    map.once("load", () => {
      // Require tiles (not just the style) to render before hiding the safe schematic.
      map.once("idle", () => { readyRef.current = true; window.clearTimeout(timer); latest.current.onReady(); });
    });
    const markers: maplibregl.Marker[] = [];
    for (const c of configurations) {
      if (!c.center) continue;
      const node = document.createElement("button");
      node.type = "button";
      node.setAttribute("aria-label", `${c.code}: ${c.comuni.join(", ")}`);
      node.style.cssText = "width:32px;height:32px;border-radius:50%;border:4px solid white;background:#478A2B;box-shadow:0 2px 9px #052a2260;cursor:pointer";
      node.addEventListener("click", () => latest.current.onSelect(c.code));
      markers.push(new maplibregl.Marker({ element: node }).setLngLat(c.center).addTo(map));
    }
    return () => {
      window.clearTimeout(timer);
      markers.forEach((m) => m.remove());
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const c = configurations.find((item) => item.code === selected);
    if (c?.center && mapRef.current) {
      mapRef.current.easeTo({ center: c.center, zoom: 11.5, duration: 350 });
    }
  }, [selected]);
  return <div ref={ref} className="absolute inset-0" aria-label="Mappa geografica delle configurazioni SUN-FAI" />;
}
