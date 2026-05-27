import { ChevronDown, type LucideIcon } from "lucide-react";

type MetricCardProps = {
  icon: LucideIcon;
  label: string;
  amount: { sign: string; integer: string; fraction?: string };
  cadence?: string;
  action?: {
    icon: LucideIcon;
    line1: string;
    line2: string;
  };
};

export function MetricCard({
  icon: Icon,
  label,
  amount,
  cadence = "Weekly",
  action,
}: MetricCardProps) {
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
          {cadence}
          <ChevronDown size={12} />
        </button>
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
              {amount.sign}
            </span>
            {amount.integer}
            {amount.fraction !== undefined && (
              <span>.{amount.fraction}</span>
            )}
          </p>
        </div>
        {action && (
          <button
            type="button"
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
