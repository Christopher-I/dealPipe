"use client";

import { BarChart2 } from "lucide-react";
import { useState } from "react";

type YearKey = "2026" | "2025";

type Data = { x: number; y: number };

const DATA_BY_YEAR: Record<YearKey, { active: Data; inactive: Data }> = {
  "2026": { active: { x: 150, y: 32 }, inactive: { x: 100, y: 70 } },
  "2025": { active: { x: 100, y: 38 }, inactive: { x: 150, y: 64 } },
};

export function YearChartCard() {
  const [active, setActive] = useState<YearKey>("2026");
  const inactive: YearKey = active === "2026" ? "2025" : "2026";
  const data = DATA_BY_YEAR[active];

  return (
    <div
      className="rounded-[var(--radius-card)] border p-5 flex flex-col gap-3 h-full"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: "var(--color-surface-warm)",
            color: "var(--color-text-2)",
          }}
        >
          <BarChart2 size={16} />
        </div>
        <div className="flex flex-col gap-1.5 items-end">
          <button
            type="button"
            onClick={() => setActive(active)}
            className="inline-flex items-center h-7 px-3 rounded-full font-medium"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-text-on-accent)",
              fontSize: "var(--text-chip)",
            }}
          >
            {active}
          </button>
          <button
            type="button"
            onClick={() => setActive(inactive)}
            className="inline-flex items-center h-7 px-3 rounded-full"
            style={{
              backgroundColor: "var(--color-surface-warm)",
              color: "var(--color-text-2)",
              fontSize: "var(--text-chip)",
            }}
          >
            {inactive}
          </button>
        </div>
      </div>

      <svg viewBox="0 0 200 110" className="w-full flex-1 min-h-[80px]">
        <defs>
          <pattern
            id="ycgrid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="200" height="110" fill="url(#ycgrid)" />

        <line
          x1={data.inactive.x}
          y1="110"
          x2={data.inactive.x}
          y2={data.inactive.y}
          stroke="var(--color-text-subtle)"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="dp-grow-y"
          style={{
            transformOrigin: `${data.inactive.x}px 110px`,
            animationDelay: "100ms",
          }}
        />
        <circle
          cx={data.inactive.x}
          cy={data.inactive.y}
          r="4"
          fill="var(--color-text-subtle)"
          className="dp-scale-in"
          style={{
            transformOrigin: `${data.inactive.x}px ${data.inactive.y}px`,
            animationDelay: "500ms",
          }}
        />

        <line
          x1={data.active.x}
          y1="110"
          x2={data.active.x}
          y2={data.active.y}
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          className="dp-grow-y"
          style={{
            transformOrigin: `${data.active.x}px 110px`,
            animationDelay: "260ms",
          }}
        />
        <circle
          cx={data.active.x}
          cy={data.active.y}
          r="5"
          fill="var(--color-accent)"
          className="dp-scale-in"
          style={{
            transformOrigin: `${data.active.x}px ${data.active.y}px`,
            animationDelay: "700ms",
          }}
        />
      </svg>
    </div>
  );
}
