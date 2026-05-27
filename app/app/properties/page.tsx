"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { usePersona } from "@/components/shared/PersonaProvider";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { listProperties } from "@/lib/data";
import { ASSET_CLASS_LABEL } from "@/lib/format";
import type { AssetClass, Property } from "@/types/domain";

const ASSET_CLASSES: AssetClass[] = [
  "office",
  "retail",
  "industrial",
  "multifamily",
  "hospitality",
  "mixed_use",
];

// Loaded only on the client — maplibre-gl uses window/document.
const PropertyMap = dynamic(
  () => import("@/components/properties/PropertyMap").then((m) => m.PropertyMap),
  { ssr: false, loading: () => <MapSkeleton /> },
);

function MapSkeleton() {
  return (
    <div
      className="rounded-[var(--radius-card-lg)] border h-[520px] flex items-center justify-center"
      style={{
        backgroundColor: "var(--color-surface-warm)",
        borderColor: "var(--color-border)",
        color: "var(--color-text-muted)",
        fontSize: "var(--text-body)",
      }}
    >
      Loading map…
    </div>
  );
}

export default function PropertiesPage() {
  const { persona } = usePersona();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filter, setFilter] = useState<AssetClass | "all">("all");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    listProperties({ orgId: persona.orgId }).then((p) => {
      if (!alive) return;
      setProperties(p);
    });
    return () => {
      alive = false;
    };
  }, [persona.orgId]);

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: properties.length };
    for (const c of ASSET_CLASSES) {
      m[c] = properties.filter((p) => p.assetClass === c).length;
    }
    return m;
  }, [properties]);

  const visible =
    filter === "all"
      ? properties
      : properties.filter((p) => p.assetClass === filter);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1
          className="font-medium tracking-tight"
          style={{
            color: "var(--color-text)",
            fontSize: "var(--text-display)",
            lineHeight: "var(--text-display--line-height)",
          }}
        >
          Properties
        </h1>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-body)",
          }}
        >
          Every property in {persona.orgName} pinned to its real coordinates.
          Hover a card to highlight on the map; click to open the detail.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterChip
          active={filter === "all"}
          label={`All (${counts.all ?? 0})`}
          onClick={() => setFilter("all")}
        />
        {ASSET_CLASSES.map((c) => (
          <FilterChip
            key={c}
            active={filter === c}
            label={`${ASSET_CLASS_LABEL[c]} (${counts[c] ?? 0})`}
            onClick={() => setFilter(c)}
          />
        ))}
      </div>

      <PropertyMap properties={visible} selectedId={hoveredId} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {visible.map((p) => (
          <PropertyCard
            key={p.id}
            property={p}
            selected={p.id === hoveredId}
            onHover={setHoveredId}
          />
        ))}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 h-9 rounded-full border transition-colors duration-200"
      style={{
        backgroundColor: active
          ? "var(--color-ink)"
          : "var(--color-surface)",
        borderColor: "var(--color-border)",
        color: active
          ? "var(--color-text-on-ink)"
          : "var(--color-text-2)",
        fontSize: "var(--text-chip)",
      }}
    >
      {label}
    </button>
  );
}
