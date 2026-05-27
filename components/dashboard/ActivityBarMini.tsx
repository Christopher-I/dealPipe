"use client";

import { useState } from "react";
import { toast } from "@/lib/toast";

type Props = {
  amount: string;
  currency?: string;
};

const BAR_HEIGHTS_BY_PAGE = [
  [0.55, 0.85, 0.45, 0.95, 0.6, 0.75, 0.4, 0.7, 0.5, 0.65, 0.35, 0.5],
  [0.65, 0.4, 0.8, 0.5, 0.7, 0.35, 0.85, 0.45, 0.6, 0.55, 0.5, 0.4],
  [0.45, 0.7, 0.55, 0.6, 0.85, 0.4, 0.5, 0.8, 0.65, 0.3, 0.75, 0.55],
];

const BAR_FILLS = [
  "var(--color-accent-bar-mute)",
  "var(--color-accent)",
  "var(--color-accent-bar-mute)",
  "var(--color-accent)",
  "var(--color-accent-bar-mute)",
  "var(--color-accent)",
  "var(--color-accent-bar-mute)",
  "var(--color-accent)",
  "var(--color-accent-bar-mute)",
  "var(--color-accent)",
  "var(--color-accent-bar-mute)",
  "var(--color-accent)",
];

const PAGE_LABELS = ["This week", "Last week", "Two weeks ago"];

export function ActivityBarMini({ amount, currency = "USD" }: Props) {
  const [page, setPage] = useState(1);
  const heights = BAR_HEIGHTS_BY_PAGE[page];

  const barWidth = 14;
  const gap = 10;
  const chartH = 70;
  const totalW = heights.length * (barWidth + gap) - gap;

  return (
    <div
      className="rounded-[var(--radius-sub-card)] border p-5 flex flex-col gap-3"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <p
        className="font-medium tabular"
        style={{
          color: "var(--color-text)",
          fontSize: "var(--text-metric-lg)",
        }}
      >
        <span className="mr-1">$</span>
        {amount}
        <span
          className="ml-2"
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-meta)",
          }}
        >
          {currency}
        </span>
      </p>
      <svg
        key={page}
        viewBox={`0 0 ${totalW} ${chartH}`}
        preserveAspectRatio="none"
        width="100%"
        height={chartH}
        aria-hidden
      >
        {heights.map((h, i) => {
          const height = h * chartH;
          const x = i * (barWidth + gap);
          const y = chartH - height;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={barWidth}
              height={height}
              rx={6}
              fill={BAR_FILLS[i]}
              className="dp-grow-y"
              style={{
                transformOrigin: `${x + barWidth / 2}px ${chartH}px`,
                animationDelay: `${i * 50}ms`,
              }}
            />
          );
        })}
      </svg>
      <div className="flex items-center justify-center gap-1.5">
        {[0, 1, 2].map((d) => (
          <button
            key={d}
            type="button"
            aria-label={`Show ${PAGE_LABELS[d]}`}
            onClick={() => {
              setPage(d);
              toast(PAGE_LABELS[d]);
            }}
            className="rounded-full"
            style={{
              width: 6,
              height: 6,
              padding: 0,
              backgroundColor:
                d === page
                  ? "var(--color-accent)"
                  : "var(--color-border-strong)",
              border: "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}
