"use client";

import { useEffect, useState } from "react";
import { usePersona } from "@/components/shared/PersonaProvider";
import {
  getDealsSummary,
  listDeals,
  listOrgMembers,
  listProperties,
} from "@/lib/data";
import {
  ASSET_CLASS_LABEL,
  formatCompactMoney,
  formatDate,
  STAGE_LABEL,
} from "@/lib/format";
import type { Deal, Property, User } from "@/types/domain";

const STAGE_ORDER: Deal["stage"][] = [
  "sourcing",
  "loi",
  "diligence",
  "closing",
  "closed_won",
  "closed_lost",
];

export default function DealsPage() {
  const { persona } = usePersona();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [properties, setProperties] = useState<Map<string, Property>>(new Map());
  const [members, setMembers] = useState<Map<string, User>>(new Map());
  const [summary, setSummary] = useState<Awaited<
    ReturnType<typeof getDealsSummary>
  > | null>(null);
  const [stageFilter, setStageFilter] = useState<Deal["stage"] | "all">("all");

  useEffect(() => {
    let alive = true;
    Promise.all([
      listDeals({ orgId: persona.orgId }),
      listProperties({ orgId: persona.orgId }),
      listOrgMembers({ orgId: persona.orgId }),
      getDealsSummary({ orgId: persona.orgId }),
    ]).then(([d, p, m, s]) => {
      if (!alive) return;
      setDeals(d);
      setProperties(new Map(p.map((x) => [x.id, x])));
      setMembers(new Map(m.map((x) => [x.id, x])));
      setSummary(s);
    });
    return () => {
      alive = false;
    };
  }, [persona.orgId]);

  const filtered = stageFilter === "all"
    ? deals
    : deals.filter((d) => d.stage === stageFilter);

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
          Deals
        </h1>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-body)",
          }}
        >
          Phase 4 turns this into a draggable Kanban with a deal detail view.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setStageFilter("all")}
          className="px-4 h-9 rounded-full border transition-colors duration-200"
          style={{
            backgroundColor:
              stageFilter === "all"
                ? "var(--color-ink)"
                : "var(--color-surface)",
            borderColor: "var(--color-border)",
            color:
              stageFilter === "all"
                ? "var(--color-text-on-ink)"
                : "var(--color-text-2)",
            fontSize: "var(--text-chip)",
          }}
        >
          All ({deals.length})
        </button>
        {STAGE_ORDER.map((stage) => {
          const count = summary?.byStage[stage].count ?? 0;
          const active = stageFilter === stage;
          return (
            <button
              key={stage}
              type="button"
              onClick={() => setStageFilter(stage)}
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
              {STAGE_LABEL[stage]} ({count})
            </button>
          );
        })}
      </div>

      <div
        className="rounded-[var(--radius-card-lg)] border overflow-hidden"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <table className="w-full text-left">
          <thead>
            <tr style={{ backgroundColor: "var(--color-surface-warm)" }}>
              {[
                "Deal",
                "Property",
                "Asset",
                "Stage",
                "Amount",
                "Prob.",
                "Owner",
                "Expected close",
              ].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3"
                  style={{
                    color: "var(--color-text-muted)",
                    fontSize: "var(--text-meta)",
                    fontWeight: 500,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, i) => {
              const prop = properties.get(d.propertyId);
              const owner = members.get(d.ownerId);
              return (
                <tr
                  key={d.id}
                  style={{
                    borderTop:
                      i === 0 ? undefined : `1px solid var(--color-border)`,
                  }}
                >
                  <td
                    className="px-5 py-4 font-medium"
                    style={{
                      color: "var(--color-text)",
                      fontSize: "var(--text-body)",
                    }}
                  >
                    {d.name}
                  </td>
                  <td
                    className="px-5 py-4"
                    style={{
                      color: "var(--color-text-2)",
                      fontSize: "var(--text-body)",
                    }}
                  >
                    {prop
                      ? `${prop.name}, ${prop.city}`
                      : <span style={{ color: "var(--color-text-subtle)" }}>—</span>}
                  </td>
                  <td
                    className="px-5 py-4"
                    style={{
                      color: "var(--color-text-2)",
                      fontSize: "var(--text-body)",
                    }}
                  >
                    {prop ? ASSET_CLASS_LABEL[prop.assetClass] : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="inline-flex items-center px-3 h-7 rounded-full"
                      style={{
                        backgroundColor: "var(--color-surface-warm)",
                        color: "var(--color-text-2)",
                        fontSize: "var(--text-meta)",
                      }}
                    >
                      {STAGE_LABEL[d.stage]}
                    </span>
                  </td>
                  <td
                    className="px-5 py-4 tabular"
                    style={{
                      color: "var(--color-text)",
                      fontSize: "var(--text-body)",
                    }}
                  >
                    {formatCompactMoney(d.amountUsd)}
                  </td>
                  <td
                    className="px-5 py-4 tabular"
                    style={{
                      color: "var(--color-text-2)",
                      fontSize: "var(--text-body)",
                    }}
                  >
                    {d.probability}%
                  </td>
                  <td
                    className="px-5 py-4"
                    style={{
                      color: "var(--color-text-2)",
                      fontSize: "var(--text-body)",
                    }}
                  >
                    {owner?.name ?? "—"}
                  </td>
                  <td
                    className="px-5 py-4 tabular"
                    style={{
                      color: "var(--color-text-2)",
                      fontSize: "var(--text-body)",
                    }}
                  >
                    {formatDate(d.expectedClose)}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-10 text-center"
                  style={{
                    color: "var(--color-text-muted)",
                    fontSize: "var(--text-body)",
                  }}
                >
                  No deals match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
