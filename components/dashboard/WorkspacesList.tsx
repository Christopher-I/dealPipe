import {
  Briefcase,
  BarChart3,
  Users,
  type LucideIcon,
  MoreVertical,
} from "lucide-react";

type Item = {
  label: string;
  icon: LucideIcon;
};

const ITEMS: Item[] = [
  { label: "Underwriting", icon: Briefcase },
  { label: "Asset reports", icon: BarChart3 },
  { label: "Team management", icon: Users },
];

export function WorkspacesList() {
  return (
    <div
      className="rounded-[var(--radius-sub-card)] border p-5 flex flex-col gap-4"
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
          Business plans
        </p>
        <button
          type="button"
          aria-label="More"
          style={{ color: "var(--color-text-muted)" }}
        >
          <MoreVertical size={16} />
        </button>
      </div>

      <div className="flex flex-col gap-1">
        {ITEMS.map((it, i) => {
          const Icon = it.icon;
          const isFirst = i === 0;
          return (
            <div
              key={it.label}
              className="flex items-center gap-3 rounded-full px-3 py-2"
              style={{
                backgroundColor: isFirst
                  ? "var(--color-surface-warm)"
                  : "transparent",
              }}
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "var(--color-surface-warm)",
                  color: "var(--color-accent)",
                }}
              >
                <Icon size={14} />
              </span>
              <span
                style={{
                  color: "var(--color-text-2)",
                  fontSize: "var(--text-body)",
                }}
              >
                {it.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
