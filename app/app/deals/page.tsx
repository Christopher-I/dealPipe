"use client";

import { useEffect, useMemo, useState } from "react";
import { usePersona } from "@/components/shared/PersonaProvider";
import { DealTable } from "@/components/deals/DealTable";
import { PipelineKanban } from "@/components/deals/PipelineKanban";
import { ViewToggle } from "@/components/deals/ViewToggle";
import { listDeals, listOrgMembers, listProperties } from "@/lib/data";
import { STAGE_LABEL } from "@/lib/format";
import type { Deal, DealStage, Property, User } from "@/types/domain";

const STAGE_ORDER: DealStage[] = [
  "sourcing",
  "loi",
  "diligence",
  "closing",
  "closed_won",
  "closed_lost",
];

export default function DealsPage() {
  const { persona } = usePersona();
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [deals, setDeals] = useState<Deal[]>([]);
  const [properties, setProperties] = useState<Map<string, Property>>(new Map());
  const [members, setMembers] = useState<Map<string, User>>(new Map());
  const [stageFilter, setStageFilter] = useState<DealStage | "all">("all");

  useEffect(() => {
    let alive = true;
    Promise.all([
      listDeals({ orgId: persona.orgId }),
      listProperties({ orgId: persona.orgId }),
      listOrgMembers({ orgId: persona.orgId }),
    ]).then(([d, p, m]) => {
      if (!alive) return;
      setDeals(d);
      setProperties(new Map(p.map((x) => [x.id, x])));
      setMembers(new Map(m.map((x) => [x.id, x])));
    });
    return () => {
      alive = false;
    };
  }, [persona.orgId]);

  const handleStageChange = (dealId: string, stage: DealStage) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage } : d)),
    );
  };

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: deals.length };
    for (const stage of STAGE_ORDER) {
      m[stage] = deals.filter((d) => d.stage === stage).length;
    }
    return m;
  }, [deals]);

  const tableDeals =
    stageFilter === "all"
      ? deals
      : deals.filter((d) => d.stage === stageFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
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
            Drag a card between stages to move the deal through the pipeline.
          </p>
        </div>
        <ViewToggle view={view} onChange={setView} />
      </div>

      {view === "table" && (
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip
            active={stageFilter === "all"}
            label={`All (${deals.length})`}
            onClick={() => setStageFilter("all")}
          />
          {STAGE_ORDER.map((stage) => (
            <FilterChip
              key={stage}
              active={stageFilter === stage}
              label={`${STAGE_LABEL[stage]} (${counts[stage] ?? 0})`}
              onClick={() => setStageFilter(stage)}
            />
          ))}
        </div>
      )}

      {view === "kanban" ? (
        <PipelineKanban
          deals={deals}
          properties={properties}
          members={members}
          orgAccentHex={persona.orgAccentHex}
          onStageChange={handleStageChange}
        />
      ) : (
        <DealTable
          deals={tableDeals}
          properties={properties}
          members={members}
        />
      )}
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
