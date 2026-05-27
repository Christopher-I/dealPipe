"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { usePersona } from "@/components/shared/PersonaProvider";
import { listProperties } from "@/lib/data";
import { ASSET_CLASS_LABEL, formatCompactMoney } from "@/lib/format";
import type { AssetClass, Property } from "@/types/domain";

const ASSET_CLASSES: AssetClass[] = [
  "office",
  "retail",
  "industrial",
  "multifamily",
  "hospitality",
  "mixed_use",
];

export default function PropertiesPage() {
  const { persona } = usePersona();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filter, setFilter] = useState<AssetClass | "all">("all");

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

  const visible = filter === "all"
    ? properties
    : properties.filter((p) => p.assetClass === filter);

  return (
    <div className="space-y-8">
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
          Phase 5 turns this into a Mapbox map + filterable list. For now, a
          straight grid against the seed.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className="px-4 h-9 rounded-full border transition-colors duration-200"
          style={{
            backgroundColor:
              filter === "all" ? "var(--color-ink)" : "var(--color-surface)",
            borderColor: "var(--color-border)",
            color:
              filter === "all"
                ? "var(--color-text-on-ink)"
                : "var(--color-text-2)",
            fontSize: "var(--text-chip)",
          }}
        >
          All ({counts.all ?? 0})
        </button>
        {ASSET_CLASSES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className="px-4 h-9 rounded-full border transition-colors duration-200"
            style={{
              backgroundColor:
                filter === c ? "var(--color-ink)" : "var(--color-surface)",
              borderColor: "var(--color-border)",
              color:
                filter === c
                  ? "var(--color-text-on-ink)"
                  : "var(--color-text-2)",
              fontSize: "var(--text-chip)",
            }}
          >
            {ASSET_CLASS_LABEL[c]} ({counts[c] ?? 0})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {visible.map((p) => (
          <div
            key={p.id}
            className="rounded-[var(--radius-card)] border overflow-hidden"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <div
              className="relative w-full aspect-[4/3]"
              style={{ backgroundColor: "var(--color-surface-warm)" }}
            >
              {p.photoUrl && (
                <Image
                  src={p.photoUrl}
                  alt={p.name}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              )}
              <span
                className="absolute top-3 left-3 px-3 h-7 inline-flex items-center rounded-full"
                style={{
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text-2)",
                  fontSize: "var(--text-meta)",
                }}
              >
                {ASSET_CLASS_LABEL[p.assetClass]}
              </span>
            </div>
            <div className="p-5">
              <p
                className="font-medium"
                style={{
                  color: "var(--color-text)",
                  fontSize: "var(--text-headline)",
                }}
              >
                {p.name}
              </p>
              <p
                className="mt-0.5"
                style={{
                  color: "var(--color-text-muted)",
                  fontSize: "var(--text-meta)",
                }}
              >
                {p.address} · {p.city}, {p.state}
              </p>
              <div className="flex items-end justify-between mt-4">
                <div>
                  <p
                    style={{
                      color: "var(--color-text-muted)",
                      fontSize: "var(--text-meta)",
                    }}
                  >
                    Price
                  </p>
                  <p
                    className="font-medium tabular"
                    style={{
                      color: "var(--color-text)",
                      fontSize: "var(--text-metric-md)",
                    }}
                  >
                    <span style={{ color: "var(--color-accent)" }}>$</span>
                    {formatCompactMoney(p.priceUsd).replace("$", "")}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    style={{
                      color: "var(--color-text-muted)",
                      fontSize: "var(--text-meta)",
                    }}
                  >
                    Cap rate
                  </p>
                  <p
                    className="font-medium tabular"
                    style={{
                      color: "var(--color-text)",
                      fontSize: "var(--text-metric-md)",
                    }}
                  >
                    {p.capRate.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
