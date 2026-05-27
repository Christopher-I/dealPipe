import { Clock } from "lucide-react";

type Props = {
  days: number;
  totalDays?: number;
  subtitle: string;
};

const DOT_COLS = 10;
const DOT_ROWS = 4;
const TOTAL_DOTS = DOT_COLS * DOT_ROWS;

export function DaysCountdownCard({ days, totalDays = 30, subtitle }: Props) {
  const filled = Math.round((days / totalDays) * TOTAL_DOTS);

  return (
    <div
      className="rounded-[var(--radius-card)] border p-5 flex flex-col gap-3 h-full"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: "var(--color-surface-warm)",
          color: "var(--color-text-2)",
        }}
      >
        <Clock size={16} />
      </div>
      <div>
        <p
          className="font-medium tabular"
          style={{
            color: "var(--color-text)",
            fontSize: "var(--text-metric-lg)",
          }}
        >
          {days} Days
        </p>
        <p
          className="tabular mt-0.5"
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-meta)",
          }}
        >
          {subtitle}
        </p>
      </div>
      <div
        className="grid mt-auto"
        style={{
          gridTemplateColumns: `repeat(${DOT_COLS}, 1fr)`,
          gap: 6,
        }}
        aria-hidden
      >
        {Array.from({ length: TOTAL_DOTS }).map((_, i) => {
          const isFilled = i < filled;
          return (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full block dp-scale-in"
              style={{
                backgroundColor: isFilled
                  ? "var(--color-accent)"
                  : "var(--color-border)",
                animationDelay: `${i * 15}ms`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
