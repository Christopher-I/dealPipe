"use client";

import {
  BarChart3,
  Briefcase,
  MoreVertical,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/lib/toast";

type Item = {
  label: string;
  icon: LucideIcon;
};

const ITEMS: Item[] = [
  { label: "Underwriting", icon: Briefcase },
  { label: "Asset reports", icon: BarChart3 },
  { label: "Team management", icon: Users },
];

export function WorkspacesList() {
  const [selected, setSelected] = useState<string>("Underwriting");

  return (
    <div
      className="rounded-[var(--radius-sub-card)] border p-5 flex flex-col gap-4 min-w-0"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex items-center justify-between gap-2 min-w-0">
        <p
          className="font-medium truncate"
          style={{
            color: "var(--color-text)",
            fontSize: "var(--text-label)",
          }}
        >
          Business plans
        </p>
        <button
          type="button"
          aria-label="More"
          onClick={() => toast("Demo: opens workspace settings")}
          className="shrink-0"
          style={{ color: "var(--color-text-muted)" }}
        >
          <MoreVertical size={16} />
        </button>
      </div>

      <div className="flex flex-col gap-1 min-w-0">
        {ITEMS.map((it) => {
          const Icon = it.icon;
          const active = selected === it.label;
          return (
            <button
              key={it.label}
              type="button"
              onClick={() => {
                setSelected(it.label);
                toast(it.label);
              }}
              className="flex items-center gap-3 rounded-full px-3 py-2 text-left min-w-0 w-full"
              style={{
                backgroundColor: active
                  ? "var(--color-surface-warm)"
                  : "transparent",
              }}
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: active
                    ? "var(--color-surface-peach)"
                    : "var(--color-surface-warm)",
                  color: "var(--color-accent)",
                }}
              >
                <Icon size={14} />
              </span>
              <span
                className="truncate min-w-0"
                style={{
                  color: "var(--color-text-2)",
                  fontSize: "var(--text-body)",
                  fontWeight: active ? 500 : 400,
                }}
              >
                {it.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
