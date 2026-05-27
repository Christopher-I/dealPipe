"use client";

import { useDroppable } from "@dnd-kit/core";
import { formatCompactMoney, STAGE_LABEL } from "@/lib/format";
import type { DealStage } from "@/types/domain";

type Props = {
  stage: DealStage;
  count: number;
  totalUsd: number;
  children: React.ReactNode;
};

export function StageColumn({ stage, count, totalUsd, children }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: `stage:${stage}` });

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col gap-3 min-w-[260px] rounded-[var(--radius-card)] p-3 transition-colors duration-150"
      style={{
        backgroundColor: isOver
          ? "var(--color-surface-peach)"
          : "var(--color-surface-warm)",
      }}
    >
      <div className="flex items-center justify-between px-2 py-1">
        <div className="flex items-center gap-2">
          <span
            className="font-medium"
            style={{
              color: "var(--color-text)",
              fontSize: "var(--text-label)",
            }}
          >
            {STAGE_LABEL[stage]}
          </span>
          <span
            className="inline-flex items-center h-5 px-2 rounded-full tabular"
            style={{
              backgroundColor: "var(--color-surface)",
              color: "var(--color-text-2)",
              fontSize: "10px",
            }}
          >
            {count}
          </span>
        </div>
        <span
          className="tabular"
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-meta)",
          }}
        >
          {formatCompactMoney(totalUsd)}
        </span>
      </div>
      <div className="flex flex-col gap-2 min-h-[120px]">{children}</div>
    </div>
  );
}
