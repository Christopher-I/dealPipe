"use client";

import Image from "next/image";
import Link from "next/link";
import { ASSET_CLASS_LABEL, formatCompactMoney } from "@/lib/format";
import type { Property } from "@/types/domain";

type Props = {
  property: Property;
  selected?: boolean;
  onHover?: (id: string | null) => void;
};

export function PropertyCard({ property: p, selected, onHover }: Props) {
  return (
    <Link
      href={`/app/properties/${p.id}`}
      onMouseEnter={() => onHover?.(p.id)}
      onMouseLeave={() => onHover?.(null)}
      className="rounded-[var(--radius-card)] border overflow-hidden block transition-transform duration-200 hover:-translate-y-0.5"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: selected ? "var(--color-accent)" : "var(--color-border)",
        outline: selected ? "1px solid var(--color-accent)" : undefined,
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
    </Link>
  );
}
