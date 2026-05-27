"use client";

import { useEffect, useState } from "react";
import { usePersona } from "@/components/shared/PersonaProvider";
import {
  type DealsSummary,
  getDealsSummary,
  listActivities,
  listProperties,
} from "@/lib/data";
import { formatCompactMoney } from "@/lib/format";

export default function DashboardPage() {
  const { persona } = usePersona();
  const firstName = persona.name.split(" ")[0];

  const [summary, setSummary] = useState<DealsSummary | null>(null);
  const [propertyCount, setPropertyCount] = useState<number>(0);
  const [activityCount, setActivityCount] = useState<number>(0);

  useEffect(() => {
    let alive = true;
    Promise.all([
      getDealsSummary({ orgId: persona.orgId }),
      listProperties({ orgId: persona.orgId }),
      listActivities({ orgId: persona.orgId }),
    ]).then(([s, props, acts]) => {
      if (!alive) return;
      setSummary(s);
      setPropertyCount(props.length);
      setActivityCount(acts.length);
    });
    return () => {
      alive = false;
    };
  }, [persona.orgId]);

  const kpis = [
    {
      label: "Open deals",
      value: summary
        ? String(
            summary.totalCount -
              summary.byStage.closed_won.count -
              summary.byStage.closed_lost.count,
          )
        : "—",
    },
    {
      label: "Pipeline value",
      value: summary ? formatCompactMoney(summary.pipelineValueUsd) : "—",
    },
    {
      label: "Properties tracked",
      value: String(propertyCount),
    },
    {
      label: "Activity items",
      value: String(activityCount),
    },
  ];

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-label)",
          }}
        >
          {persona.orgName}
        </p>
        <h1
          className="font-medium tracking-tight"
          style={{
            color: "var(--color-text)",
            fontSize: "var(--text-display)",
            lineHeight: "var(--text-display--line-height)",
          }}
        >
          Hi {firstName} — here&apos;s your pipeline.
        </h1>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-body)",
          }}
        >
          Phase 3 turns this into the pixel-parity dashboard. For now, a
          read on what&apos;s in the seed.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-[var(--radius-card)] border p-6"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <p
              style={{
                color: "var(--color-text-muted)",
                fontSize: "var(--text-label)",
              }}
            >
              {k.label}
            </p>
            <p
              className="font-medium tabular mt-2"
              style={{
                color: "var(--color-text)",
                fontSize: "var(--text-metric-xl)",
              }}
            >
              {k.value}
            </p>
          </div>
        ))}
      </div>

      {summary && (
        <div
          className="rounded-[var(--radius-card-lg)] border p-6"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <p
            className="font-medium mb-4"
            style={{
              color: "var(--color-text)",
              fontSize: "var(--text-label)",
            }}
          >
            By stage
          </p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {(
              Object.entries(summary.byStage) as [
                keyof typeof summary.byStage,
                (typeof summary.byStage)[keyof typeof summary.byStage],
              ][]
            ).map(([stage, info]) => (
              <div
                key={stage}
                className="rounded-[var(--radius-sub-card)] p-4"
                style={{ backgroundColor: "var(--color-surface-warm)" }}
              >
                <p
                  className="capitalize"
                  style={{
                    color: "var(--color-text-muted)",
                    fontSize: "var(--text-meta)",
                  }}
                >
                  {stage.replace("_", " ")}
                </p>
                <p
                  className="font-medium tabular mt-1"
                  style={{
                    color: "var(--color-text)",
                    fontSize: "var(--text-metric-md)",
                  }}
                >
                  {info.count}
                </p>
                <p
                  className="tabular mt-0.5"
                  style={{
                    color: "var(--color-text-muted)",
                    fontSize: "var(--text-meta)",
                  }}
                >
                  {formatCompactMoney(info.valueUsd)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
