import { Filter, MoreVertical, ChevronsDownUp, Search, X } from "lucide-react";
import { ActivityBarMini } from "./ActivityBarMini";
import { WorkspacesList } from "./WorkspacesList";
import { WalletVerifyCard } from "./WalletVerifyCard";

export function ActivityManagerCard({ amount }: { amount: string }) {
  return (
    <div
      className="rounded-[var(--radius-card-lg)] border p-6 flex flex-col gap-5"
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
          Activity manager
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="More"
            style={{ color: "var(--color-text-2)" }}
          >
            <MoreVertical size={16} />
          </button>
          <button
            type="button"
            aria-label="Collapse"
            style={{ color: "var(--color-text-2)" }}
          >
            <ChevronsDownUp size={16} />
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-2)",
              fontSize: "var(--text-chip)",
            }}
          >
            <Filter size={12} />
            Filters
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 flex-1 h-10 px-4 rounded-full"
          style={{ backgroundColor: "var(--color-surface-warm)" }}
        >
          <Search size={14} style={{ color: "var(--color-text-subtle)" }} />
          <input
            type="text"
            placeholder="Search in activities ..."
            className="flex-1 bg-transparent outline-none placeholder:opacity-100"
            style={{
              color: "var(--color-text)",
              fontSize: "var(--text-body)",
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-2 h-8 px-3 rounded-full border"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-2)",
              fontSize: "var(--text-chip)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "var(--color-accent)" }}
            />
            Team
          </span>
          <span
            className="inline-flex items-center gap-1.5 h-8 pl-3 pr-2 rounded-full"
            style={{
              backgroundColor: "var(--color-surface-warm)",
              color: "var(--color-text-2)",
              fontSize: "var(--text-chip)",
            }}
          >
            Insights
            <X size={12} />
          </span>
          <span
            className="inline-flex items-center gap-1.5 h-8 pl-3 pr-2 rounded-full"
            style={{
              backgroundColor: "var(--color-surface-warm)",
              color: "var(--color-text-2)",
              fontSize: "var(--text-chip)",
            }}
          >
            Today
            <X size={12} />
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ActivityBarMini amount={amount} />
        <WorkspacesList />
        <WalletVerifyCard />
      </div>
    </div>
  );
}
