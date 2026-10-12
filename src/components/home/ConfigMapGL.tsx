"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { configurations } from "@/lib/configurations";
import { asset } from "@/lib/asset";
import type { Dict } from "@/content/dict";

maplibregl.setWorkerUrl(asset("/vendor/maplibre-gl-worker.mjs"));

/** Interactive map centred on the selected configuration; markers use the configuration centres instead of noisy duplicate comune pins. */
export function ConfigMapGL({
  statusColor,
  labels,
  selected,
  onSelect,
}: {
  statusColor: Record<string, string>;
  labels: Dict["home"]["map"];
  selected: string;
  onSelect: (code: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: ref.current,
      style: "https://tiles.openfreemap.org/styles/positron/style.json",
      center: [9.598, 45.638],
      zoom: 10.9,
      cooperativeGestures: true,
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    mapRef.current = map;

    for (const c of configurations) {
      if (!c.center) continue;
      const el = document.createElement("button");
      el.type = "button";
      el.setAttribute("aria-label", `${c.code} · ${labels.legend[c.status]}`);
      el.style.cssText = `width:26px;height:26px;border-radius:999px;background:${statusColor[c.status]};border:4px solid #fff;box-shadow:0 4px 12px rgb(5 42 34/.22);cursor:pointer;transition:transform .2s, box-shadow .2s`;
      el.onmouseenter = () => {
        el.style.transform = "scale(1.08)";
        el.style.boxShadow = "0 8px 18px rgb(5 42 34/.26)";
      };
      el.onmouseleave = () => {
        el.style.transform = "";
        el.style.boxShadow = "0 4px 12px rgb(5 42 34/.22)";
      };
      el.onclick = () => onSelect(c.code);
      const popup = new maplibregl.Popup({ offset: 16, closeButton: false }).setHTML(
        `<strong>${c.code}</strong><br/>${labels.legend[c.status]}<br/>${labels.comuni}: ${c.comuni.join(", ")}`,
      );
      const marker = new maplibregl.Marker({ element: el }).setLngLat(c.center).setPopup(popup).addTo(map);
      markersRef.current.push(marker);
    }

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [labels, onSelect, statusColor]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const current = configurations.find((c) => c.code === selected && c.center);
    if (!current?.center) return;
    map.flyTo({ center: current.center, zoom: 11.4, speed: 0.8, essential: true });
    const marker = markersRef.current[configurations.findIndex((c) => c.code === selected)];
    marker?.togglePopup();
  }, [selected]);

  return <div ref={ref} className="absolute inset-0" />;
}
