"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  type DragEndEvent,
  type DragStartEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useMemo, useState } from "react";
import { DealCard } from "./DealCard";
import { StageColumn } from "./StageColumn";
import type { Deal, DealStage, Property, User } from "@/types/domain";

const STAGE_ORDER: DealStage[] = [
  "sourcing",
  "loi",
  "diligence",
  "closing",
  "closed_won",
  "closed_lost",
];

type Props = {
  deals: Deal[];
  properties: Map<string, Property>;
  members: Map<string, User>;
  orgAccentHex: string;
  onStageChange: (dealId: string, stage: DealStage) => void;
};

export function PipelineKanban({
  deals,
  properties,
  members,
  orgAccentHex,
  onStageChange,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const out: Record<DealStage, Deal[]> = {
      sourcing: [],
      loi: [],
      diligence: [],
      closing: [],
      closed_won: [],
      closed_lost: [],
    };
    for (const d of deals) out[d.stage].push(d);
    return out;
  }, [deals]);

  const totals = useMemo(() => {
    const out: Record<DealStage, number> = {
      sourcing: 0,
      loi: 0,
      diligence: 0,
      closing: 0,
      closed_won: 0,
      closed_lost: 0,
    };
    for (const d of deals) out[d.stage] += d.amountUsd;
    return out;
  }, [deals]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const over = event.over;
    if (!over) return;
    const overId = String(over.id);
    if (!overId.startsWith("stage:")) return;
    const targetStage = overId.replace("stage:", "") as DealStage;
    const dealId = String(event.active.id);
    const deal = deals.find((d) => d.id === dealId);
    if (!deal || deal.stage === targetStage) return;
    onStageChange(dealId, targetStage);
  };

  const activeDeal = activeId ? deals.find((d) => d.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
        {STAGE_ORDER.map((stage) => (
          <StageColumn
            key={stage}
            stage={stage}
            count={grouped[stage].length}
            totalUsd={totals[stage]}
          >
            {grouped[stage].map((d) => (
              <DealCard
                key={d.id}
                deal={d}
                property={properties.get(d.propertyId)}
                owner={members.get(d.ownerId)}
                orgAccentHex={orgAccentHex}
              />
            ))}
          </StageColumn>
        ))}
      </div>
      <DragOverlay>
        {activeDeal ? (
          <DealCard
            deal={activeDeal}
            property={properties.get(activeDeal.propertyId)}
            owner={members.get(activeDeal.ownerId)}
            orgAccentHex={orgAccentHex}
            draggable={false}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
