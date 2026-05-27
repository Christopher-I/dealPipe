"use client";

import { LayoutGrid, Table } from "lucide-react";

type Props = {
  view: "kanban" | "table";
  onChange: (v: "kanban" | "table") => void;
};

export function ViewToggle({ view, onChange }: Props) {
  return (
    <div
      className="inline-flex items-center p-1 rounded-full border gap-1"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      {(["kanban", "table"] as const).map((v) => {
        const active = v === view;
        const Icon = v === "kanban" ? LayoutGrid : Table;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className="inline-flex items-center gap-2 h-8 px-4 rounded-full capitalize transition-colors duration-200"
            style={{
              backgroundColor: active ? "var(--color-ink)" : "transparent",
              color: active
                ? "var(--color-text-on-ink)"
                : "var(--color-text-2)",
              fontSize: "var(--text-chip)",
              fontWeight: 500,
            }}
          >
            <Icon size={14} />
            {v}
          </button>
        );
      })}
    </div>
  );
}
