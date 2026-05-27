import { Activity } from "lucide-react";

type Props = {
  amount: { sign: string; integer: string; fraction: string };
  title: string;
  subtitle: string;
  deltaPercent: number;
};

// Hand-tuned smooth path so the line looks like a real market wave.
const LINE_PATH =
  "M 0 60 C 20 55, 30 35, 50 45 S 80 70, 100 50 S 130 20, 150 35 S 180 65, 200 50 S 230 25, 260 40 S 295 70, 320 50 S 355 30, 380 38 S 410 55, 440 30 S 470 5, 500 25";

export function MainStocksCard({ amount, title, subtitle, deltaPercent }: Props) {
  return (
    <div
      className="rounded-[var(--radius-card)] border p-6 flex flex-col gap-3"
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
          <Activity size={16} />
        </div>
        <p
          className="font-medium tabular text-right"
          style={{
            color: "var(--color-text)",
            fontSize: "var(--text-metric-lg)",
          }}
        >
          <span
            className="mr-1"
            style={{ color: "var(--color-accent-glyph)" }}
          >
            {amount.sign}
          </span>
          {amount.integer}.{amount.fraction}
        </p>
      </div>

      <svg
        viewBox="0 0 500 80"
        preserveAspectRatio="none"
        className="w-full h-20"
        aria-hidden
      >
        <path
          d={LINE_PATH}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="flex items-end justify-between">
        <div>
          <p
            className="font-medium"
            style={{
              color: "var(--color-text)",
              fontSize: "var(--text-label)",
            }}
          >
            {title}
          </p>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "var(--text-meta)",
            }}
          >
            {subtitle}
          </p>
        </div>
        <span
          className="inline-flex items-center h-7 px-3 rounded-full font-medium"
          style={{
            backgroundColor: "var(--color-surface-peach)",
            color: "var(--color-accent)",
            fontSize: "var(--text-chip)",
          }}
        >
          +{deltaPercent.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
