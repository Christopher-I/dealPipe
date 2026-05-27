"use client";

import Link from "next/link";
import {
  ASSET_CLASS_LABEL,
  formatCompactMoney,
  formatDate,
  STAGE_LABEL,
} from "@/lib/format";
import type { Deal, Property, User } from "@/types/domain";

type Props = {
  deals: Deal[];
  properties: Map<string, Property>;
  members: Map<string, User>;
};

export function DealTable({ deals, properties, members }: Props) {
  return (
    <div
      className="rounded-[var(--radius-card-lg)] border overflow-hidden"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="overflow-x-auto">
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
                  className="px-5 py-3 whitespace-nowrap"
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
            {deals.map((d, i) => {
              const prop = properties.get(d.propertyId);
              const owner = members.get(d.ownerId);
              return (
                <tr
                  key={d.id}
                  style={{
                    borderTop:
                      i === 0 ? undefined : "1px solid var(--color-border)",
                  }}
                >
                  <td className="px-5 py-4 whitespace-nowrap">
                    <Link
                      href={`/app/deals/${d.id}`}
                      className="font-medium hover:underline"
                      style={{
                        color: "var(--color-text)",
                        fontSize: "var(--text-body)",
                      }}
                    >
                      {d.name}
                    </Link>
                  </td>
                  <td
                    className="px-5 py-4 whitespace-nowrap"
                    style={{
                      color: "var(--color-text-2)",
                      fontSize: "var(--text-body)",
                    }}
                  >
                    {prop ? `${prop.name}, ${prop.city}` : "—"}
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
                    className="px-5 py-4 tabular whitespace-nowrap"
                    style={{
                      color: "var(--color-text)",
                      fontSize: "var(--text-body)",
                    }}
                  >
                    <span style={{ color: "var(--color-accent)" }}>$</span>
                    {formatCompactMoney(d.amountUsd).replace("$", "")}
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
                    className="px-5 py-4 whitespace-nowrap"
                    style={{
                      color: "var(--color-text-2)",
                      fontSize: "var(--text-body)",
                    }}
                  >
                    {owner?.name ?? "—"}
                  </td>
                  <td
                    className="px-5 py-4 tabular whitespace-nowrap"
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
            {deals.length === 0 && (
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
