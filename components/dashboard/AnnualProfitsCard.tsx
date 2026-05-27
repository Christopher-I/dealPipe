import { ChevronDown } from "lucide-react";

type Ring = {
  label: string;
  diameterPct: number;
  fillOpacity: number;
  // Where the label sits along the ring's right edge — radius pct from center
  labelOffsetPct: number;
};

const RINGS: Ring[] = [
  { label: "$14M", diameterPct: 100, fillOpacity: 0.18, labelOffsetPct: 42 },
  { label: "$9.3M", diameterPct: 75, fillOpacity: 0.35, labelOffsetPct: 30 },
  { label: "$6.8M", diameterPct: 52, fillOpacity: 0.6, labelOffsetPct: 19 },
  { label: "$4M", diameterPct: 30, fillOpacity: 1, labelOffsetPct: 0 },
];

export function AnnualProfitsCard() {
  return (
    <div
      className="rounded-[var(--radius-card-lg)] border p-7 flex flex-col gap-5 h-full"
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
          2023
          <ChevronDown size={12} />
        </button>
      </div>

      {/* SVG renders the rings; labels are positioned separately so opacity
          on the rings doesn't bleed into the type. */}
      <div className="relative w-full aspect-square">
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
          // Label sits on the right edge of its ring. labelOffsetPct measured
          // from card center. The innermost label sits at center.
          const left = 50 + r.labelOffsetPct;
          const isCenter = r.labelOffsetPct === 0;
          return (
            <span
              key={r.label}
              className="absolute font-medium tabular -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${left}%`,
                top: "50%",
                color: isCenter
                  ? "var(--color-text-on-accent)"
                  : "var(--color-accent)",
                fontSize:
                  r.diameterPct < 35
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
