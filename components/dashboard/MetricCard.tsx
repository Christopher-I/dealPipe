"use client";

import { type LucideIcon } from "lucide-react";
import { useState } from "react";
import { Dropdown } from "@/components/ui/Dropdown";
import { useCountUp } from "@/lib/hooks/useCountUp";
import { toast } from "@/lib/toast";

type MetricCardProps = {
  icon: LucideIcon;
  label: string;
  value: number;
  decimals?: number;
  cadence?: string;
  cadenceOptions?: string[];
  action?: {
    icon: LucideIcon;
    line1: string;
    line2: string;
    onClickToast?: string;
  };
};

const DEFAULT_CADENCES = ["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"];

export function MetricCard({
  icon: Icon,
  label,
  value,
  decimals = 2,
  cadence = "Weekly",
  cadenceOptions = DEFAULT_CADENCES,
  action,
}: MetricCardProps) {
  const [activeCadence, setActiveCadence] = useState(cadence);
  const animated = useCountUp(value, 850);
  const fixed = animated.toFixed(decimals);
  const [int, frac] = fixed.split(".");
  const integer = Number(int).toLocaleString("en-US");

  return (
    <div
      className="rounded-[var(--radius-card)] border p-5 flex flex-col gap-4 h-full"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: "var(--color-surface-warm)",
            color: "var(--color-text-2)",
          }}
        >
          <Icon size={16} />
        </div>
        <Dropdown
          options={cadenceOptions}
          value={activeCadence}
          onChange={(v) => {
            setActiveCadence(v);
            toast(`Cadence set to ${v.toLowerCase()}`);
          }}
          align="right"
        />
      </div>

      <div className="flex items-end justify-between gap-3 mt-auto">
        <div>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "var(--text-label)",
            }}
          >
            {label}
          </p>
          <p
            className="font-medium tabular mt-1"
            style={{
              color: "var(--color-text)",
              fontSize: "var(--text-metric-xl)",
            }}
          >
            <span
              className="mr-1"
              style={{ color: "var(--color-accent-glyph)" }}
            >
              $
            </span>
            {integer}
            {decimals > 0 && <span>.{frac}</span>}
          </p>
        </div>
        {action && (
          <button
            type="button"
            onClick={() =>
              toast(action.onClickToast ?? `Opens ${action.line2}`)
            }
            className="inline-flex items-center gap-2.5 pl-1.5 pr-3.5 h-11 rounded-full shrink-0"
            style={{ backgroundColor: "var(--color-surface-peach)" }}
          >
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-text-on-accent)",
              }}
            >
              <action.icon size={14} />
            </span>
            <span
              className="flex flex-col leading-tight items-start"
              style={{
                color: "var(--color-text-2)",
                fontSize: "var(--text-chip)",
              }}
            >
              <span>{action.line1}</span>
              <span>{action.line2}</span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
