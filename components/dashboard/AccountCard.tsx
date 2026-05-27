import { ChevronDown, Pencil } from "lucide-react";

export function AccountCard() {
  return (
    <div
      className="rounded-[var(--radius-card)] border p-6 flex flex-col gap-5"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="italic font-bold tracking-tight"
          style={{
            color: "#1A1F71",
            fontSize: "1.25rem",
            letterSpacing: "0.04em",
          }}
        >
          VISA
        </span>
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
          Direct Debits
          <ChevronDown size={12} />
        </button>
      </div>

      <div>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-meta)",
          }}
        >
          Linked to main account
        </p>
        <p
          className="font-medium tabular mt-1"
          style={{
            color: "var(--color-text)",
            fontSize: "var(--text-metric-lg)",
            letterSpacing: "0.02em",
          }}
        >
          <span className="mr-2">•••• ••••</span>
          <span>2719</span>
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="h-11 px-7 rounded-full font-medium transition-[filter] duration-200"
          style={{
            backgroundColor: "var(--color-ink)",
            color: "var(--color-text-on-ink)",
            fontSize: "var(--text-body)",
          }}
        >
          Receive
        </button>
        <button
          type="button"
          className="h-11 px-7 rounded-full font-medium border transition-colors duration-200"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            color: "var(--color-text-2)",
            fontSize: "var(--text-body)",
          }}
        >
          Send
        </button>
      </div>

      <div
        className="h-px"
        style={{ backgroundColor: "var(--color-border)" }}
      />

      <div className="flex items-end justify-between">
        <div>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "var(--text-meta)",
            }}
          >
            Monthly regular fee
          </p>
          <p
            className="font-medium tabular mt-1"
            style={{
              color: "var(--color-text)",
              fontSize: "var(--text-metric-md)",
            }}
          >
            <span className="mr-1">$</span>25.00
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-3 pl-2 pr-4 h-12 rounded-full"
          style={{ backgroundColor: "var(--color-surface-peach)" }}
        >
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-text-on-accent)",
            }}
          >
            <Pencil size={14} />
          </span>
          <span
            className="flex flex-col leading-tight items-start"
            style={{ color: "var(--color-text-2)", fontSize: "var(--text-chip)" }}
          >
            <span>Edit</span>
            <span>cards limitation</span>
          </span>
        </button>
      </div>
    </div>
  );
}
