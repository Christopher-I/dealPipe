import { ChevronDown } from "lucide-react";

type Ring = {
  label: string;
  diameterPct: number;
  fillOpacity: number;
};

const RINGS: Ring[] = [
  { label: "$14M", diameterPct: 100, fillOpacity: 0.18 },
  { label: "$9.3M", diameterPct: 75, fillOpacity: 0.35 },
  { label: "$6.8M", diameterPct: 52, fillOpacity: 0.6 },
  { label: "$4M", diameterPct: 30, fillOpacity: 1 },
];

// Place each non-center label on its ring's edge at this angle from north.
// 50° lands at ~1 o'clock — upper-right — and matches the reference.
const LABEL_ANGLE_DEG = 50;

export function AnnualProfitsCard() {
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
        <button
          type="button"
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border"
          style={{
            backgroundColor: "var(--color-surface-warm)",
            borderColor: "var(--color-border)",
            color: "var(--color-text-2)",
            fontSize: "var(--text-chip)",
          }}
        >
          2026
          <ChevronDown size={12} />
        </button>
      </div>

      {/* SVG renders the rings; labels are positioned in polar coordinates
          so each lands on its ring's upper-right edge — no overlap. */}
      <div className="relative w-full flex-1 aspect-square max-h-[280px] self-center">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          aria-hidden
        >
          {RINGS.map((r) => (
            <circle
              key={r.label}
              cx="50"
              cy="50"
              r={r.diameterPct / 2}
              fill="var(--color-accent)"
              fillOpacity={r.fillOpacity}
            />
          ))}
        </svg>
        {RINGS.map((r) => {
          const isCenter = r.diameterPct < 35;
          const angleRad = (LABEL_ANGLE_DEG * Math.PI) / 180;
          const radiusPct = r.diameterPct / 2 - 6; // slight inset so labels sit just inside the edge
          const x = isCenter ? 50 : 50 + Math.sin(angleRad) * radiusPct;
          const y = isCenter ? 50 : 50 - Math.cos(angleRad) * radiusPct;
          return (
            <span
              key={r.label}
              className="absolute font-medium tabular -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                color: isCenter
                  ? "var(--color-text-on-accent)"
                  : "var(--color-accent)",
                fontSize: isCenter
                  ? "var(--text-label)"
                  : "var(--text-body)",
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
