"use client";

import maplibregl, {
  type LngLatBoundsLike,
  type Map as MapLibreMap,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ASSET_CLASS_LABEL, formatCompactMoney } from "@/lib/format";
import type { Property } from "@/types/domain";

type Props = {
  properties: Property[];
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  height?: number | string;
};

// Free demo style — no API key required.
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

export function PropertyMap({
  properties,
  selectedId,
  onSelect,
  height = 520,
}: Props) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  // Initialise the map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [-95, 39],
      zoom: 3.5,
      attributionControl: { compact: true },
    });
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right",
    );
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Sync markers + fit bounds whenever the property set changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    for (const marker of markersRef.current) marker.remove();
    markersRef.current = [];

    if (properties.length === 0) return;

    for (const p of properties) {
      const el = document.createElement("button");
      el.type = "button";
      el.setAttribute("data-property-id", p.id);
      el.setAttribute("aria-label", p.name);
      el.style.cursor = "pointer";
      el.style.background = "transparent";
      el.style.border = "0";
      el.style.padding = "0";

      const isSelected = selectedId === p.id;
      el.innerHTML = `
        <span style="
          display:flex; align-items:center; justify-content:center;
          width:${isSelected ? 30 : 22}px;
          height:${isSelected ? 30 : 22}px;
          border-radius:9999px;
          background:var(--color-accent);
          color:var(--color-text-on-accent);
          border:2px solid var(--color-surface);
          box-shadow:0 0 0 1px rgba(0,0,0,0.06);
          font-weight:600;
          font-size:10px;
          font-family:inherit;
          transition:transform 150ms ease-out;
        ">●</span>
      `;
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        if (e.shiftKey) {
          router.push(`/app/properties/${p.id}`);
          return;
        }
        onSelect?.(p.id);
      });

      const popup = new maplibregl.Popup({
        offset: 14,
        closeButton: false,
        closeOnClick: false,
        className: "dp-map-popup",
      }).setHTML(`
        <div style="font-family:inherit; padding:2px 4px; min-width:160px">
          <div style="font-weight:500; font-size:13px; color:#0f0f0f">${escape(p.name)}</div>
          <div style="font-size:11px; color:#6b6661; margin-top:2px">${escape(p.city)}, ${escape(p.state)} · ${escape(ASSET_CLASS_LABEL[p.assetClass] ?? p.assetClass)}</div>
          <div style="font-size:11px; color:#0f0f0f; margin-top:4px; font-variant-numeric:tabular-nums">
            <span style="color:#e15b3f">$</span>${escape(formatCompactMoney(p.priceUsd).replace("$", ""))} · ${p.capRate.toFixed(2)}% cap
          </div>
        </div>
      `);

      const marker = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat([p.lng, p.lat])
        .setPopup(popup)
        .addTo(map);

      el.addEventListener("mouseenter", () => marker.togglePopup());
      el.addEventListener("mouseleave", () => marker.togglePopup());

      markersRef.current.push(marker);
    }

    // Fit bounds to property extent.
    const bounds = new maplibregl.LngLatBounds();
    for (const p of properties) bounds.extend([p.lng, p.lat]);
    if (!bounds.isEmpty()) {
      map.fitBounds(bounds as LngLatBoundsLike, {
        padding: 60,
        duration: 600,
        maxZoom: 12,
      });
    }
  }, [properties, selectedId, onSelect, router]);

  return (
    <div
      className="rounded-[var(--radius-card-lg)] border overflow-hidden relative"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
        height,
      }}
    >
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
