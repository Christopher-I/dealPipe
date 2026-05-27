"use client";

import { useState } from "react";
import { Dropdown } from "@/components/ui/Dropdown";

type Ring = {
  label: string;
  diameterPct: number;
  fillOpacity: number;
};

// Multi-year mock data so the dropdown actually changes the visualisation.
const YEAR_DATA: Record<string, Ring[]> = {
  "2026": [
    { label: "$14M", diameterPct: 100, fillOpacity: 0.18 },
    { label: "$9.3M", diameterPct: 75, fillOpacity: 0.35 },
    { label: "$6.8M", diameterPct: 52, fillOpacity: 0.6 },
    { label: "$4M", diameterPct: 30, fillOpacity: 1 },
  ],
  "2025": [
    { label: "$11M", diameterPct: 100, fillOpacity: 0.18 },
    { label: "$7.2M", diameterPct: 72, fillOpacity: 0.35 },
    { label: "$5.1M", diameterPct: 48, fillOpacity: 0.6 },
    { label: "$2.8M", diameterPct: 26, fillOpacity: 1 },
  ],
  "2024": [
    { label: "$8M", diameterPct: 100, fillOpacity: 0.18 },
    { label: "$5.4M", diameterPct: 70, fillOpacity: 0.35 },
    { label: "$3.6M", diameterPct: 44, fillOpacity: 0.6 },
    { label: "$1.9M", diameterPct: 22, fillOpacity: 1 },
  ],
};

const LABEL_ANGLE_DEG = 50;

export function AnnualProfitsCard() {
  const [year, setYear] = useState("2026");
  const rings = YEAR_DATA[year];

  return (
    <div
      className="rounded-[var(--radius-card-lg)] border p-6 flex flex-col gap-4 h-full"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex items-center justify-between">
        <p
          className="font-medium"
          style={{
            color: "var(--color-text)",
            fontSize: "var(--text-label)",
          }}
        >
          Annual profits
        </p>
        <Dropdown
          options={["2026", "2025", "2024"]}
          value={year}
          onChange={setYear}
          align="right"
        />
      </div>

      <div className="relative w-full flex-1 aspect-square max-h-[280px] self-center">
        <svg
          key={year}
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          aria-hidden
        >
          {rings.map((r, i) => {
            const delay = i * 120;
            return (
              <circle
                key={r.label}
                cx="50"
                cy="50"
                r={r.diameterPct / 2}
                fill="var(--color-accent)"
                fillOpacity={r.fillOpacity}
                className="dp-scale-in"
                style={{
                  transformOrigin: "50% 50%",
                  animationDelay: `${delay}ms`,
                }}
              />
            );
          })}
        </svg>
        {rings.map((r, i) => {
          const isCenter = r.diameterPct < 35;
          const angleRad = (LABEL_ANGLE_DEG * Math.PI) / 180;
          const radiusPct = r.diameterPct / 2 - 6;
          const x = isCenter ? 50 : 50 + Math.sin(angleRad) * radiusPct;
          const y = isCenter ? 50 : 50 - Math.cos(angleRad) * radiusPct;
          const delay = i * 120 + 400;
          return (
            <span
              key={`${year}-${r.label}`}
              className="absolute font-medium tabular -translate-x-1/2 -translate-y-1/2 dp-fade-in"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                color: isCenter
                  ? "var(--color-text-on-accent)"
                  : "var(--color-accent)",
                fontSize: isCenter
                  ? "var(--text-label)"
                  : "var(--text-body)",
                animationDelay: `${delay}ms`,
              }}
            >
              {r.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
