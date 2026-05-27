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

// Place non-center labels on the ring's upper-right at this angle from north.
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

      {/* Ring SVG; labels positioned polar so each lands on its ring edge. */}
      <div className="relative w-full flex-1 aspect-square max-h-[280px] self-center">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          aria-hidden
        >
          {RINGS.map((r, i) => {
            // Outer rings animate first so the eye sees the gradient expanding.
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
        {RINGS.map((r, i) => {
          const isCenter = r.diameterPct < 35;
          const angleRad = (LABEL_ANGLE_DEG * Math.PI) / 180;
          const radiusPct = r.diameterPct / 2 - 6;
          const x = isCenter ? 50 : 50 + Math.sin(angleRad) * radiusPct;
          const y = isCenter ? 50 : 50 - Math.cos(angleRad) * radiusPct;
          const delay = i * 120 + 400;
          return (
            <span
              key={r.label}
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
