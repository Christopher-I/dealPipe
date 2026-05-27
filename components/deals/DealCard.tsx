"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import { formatCompactMoney, formatDate } from "@/lib/format";
import type { Deal, Property, User } from "@/types/domain";

type Props = {
  deal: Deal;
  property?: Property;
  owner?: User;
  orgAccentHex: string;
  draggable?: boolean;
};

export function DealCard({
  deal,
  property,
  owner,
  orgAccentHex,
  draggable = true,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: deal.id,
      disabled: !draggable,
    });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    backgroundColor: "var(--color-surface)",
    borderColor: "var(--color-border)",
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-[var(--radius-sub-card)] border p-4 select-none touch-none"
      {...(draggable ? listeners : {})}
      {...attributes}
    >
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/app/deals/${deal.id}`}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="font-medium hover:underline"
          style={{
            color: "var(--color-text)",
            fontSize: "var(--text-body)",
          }}
        >
          {deal.name}
        </Link>
        <span
          className="tabular shrink-0"
          style={{
            color: "var(--color-text-2)",
            fontSize: "var(--text-meta)",
          }}
        >
          {deal.probability}%
        </span>
      </div>

      <p
        className="mt-1 truncate"
        style={{
          color: "var(--color-text-muted)",
          fontSize: "var(--text-meta)",
        }}
      >
        {property ? `${property.name} · ${property.city}` : "—"}
      </p>

      <div className="flex items-center justify-between mt-4">
        <p
          className="font-medium tabular"
          style={{
            color: "var(--color-text)",
            fontSize: "var(--text-body)",
          }}
        >
          <span style={{ color: "var(--color-accent)" }}>$</span>
          {formatCompactMoney(deal.amountUsd).replace("$", "")}
        </p>
        <div className="flex items-center gap-2">
          {owner && (
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-white"
              title={owner.name}
              style={{
                backgroundColor: orgAccentHex,
                fontSize: "10px",
                fontWeight: 500,
              }}
            >
              {owner.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </span>
          )}
          <span
            className="tabular"
            style={{
              color: "var(--color-text-muted)",
              fontSize: "var(--text-meta)",
            }}
          >
            {formatDate(deal.expectedClose)}
          </span>
        </div>
      </div>
    </div>
  );
}
