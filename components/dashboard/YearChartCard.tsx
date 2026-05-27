import { BarChart2 } from "lucide-react";

export function YearChartCard() {
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
          <span
            className="inline-flex items-center h-7 px-3 rounded-full font-medium"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-text-on-accent)",
              fontSize: "var(--text-chip)",
            }}
          >
            2026
          </span>
          <span
            className="inline-flex items-center h-7 px-3 rounded-full"
            style={{
              backgroundColor: "var(--color-surface-warm)",
              color: "var(--color-text-2)",
              fontSize: "var(--text-chip)",
            }}
          >
            2025
          </span>
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

        {/* 2025 marker (gray, lower) — extend up from baseline + dot pop */}
        <line
          x1="100"
          y1="110"
          x2="100"
          y2="70"
          stroke="var(--color-text-subtle)"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="dp-grow-y"
          style={{ transformOrigin: "100px 110px", animationDelay: "100ms" }}
        />
        <circle
          cx="100"
          cy="70"
          r="4"
          fill="var(--color-text-subtle)"
          className="dp-scale-in"
          style={{ transformOrigin: "100px 70px", animationDelay: "500ms" }}
        />

        {/* 2026 marker (coral, higher) */}
        <line
          x1="150"
          y1="110"
          x2="150"
          y2="32"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          className="dp-grow-y"
          style={{ transformOrigin: "150px 110px", animationDelay: "260ms" }}
        />
        <circle
          cx="150"
          cy="32"
          r="5"
          fill="var(--color-accent)"
          className="dp-scale-in"
          style={{ transformOrigin: "150px 32px", animationDelay: "700ms" }}
        />
      </svg>
    </div>
  );
}
