"use client";

import { ChevronsDownUp, Filter, MoreVertical, Search, X } from "lucide-react";
import { useState } from "react";
import { ActivityBarMini } from "./ActivityBarMini";
import { WalletVerifyCard } from "./WalletVerifyCard";
import { WorkspacesList } from "./WorkspacesList";
import { toast } from "@/lib/toast";

const ALL_FILTERS = ["Team", "Insights", "Today"] as const;
type Filter = (typeof ALL_FILTERS)[number];

export function ActivityManagerCard({ amount }: { amount: string }) {
  const [filters, setFilters] = useState<Filter[]>(["Team", "Insights", "Today"]);
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");

  const removeFilter = (name: Filter) => {
    setFilters((prev) => prev.filter((f) => f !== name));
    toast(`Removed "${name}" filter`);
  };

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
            aria-label="More options"
            onClick={() => toast("Demo: opens more options menu")}
            style={{ color: "var(--color-text-2)" }}
          >
            <MoreVertical size={16} />
          </button>
          <button
            type="button"
            aria-label="Collapse"
            onClick={() => {
              setCollapsed((v) => !v);
              toast(collapsed ? "Expanded" : "Collapsed");
            }}
            style={{ color: "var(--color-text-2)" }}
          >
            <ChevronsDownUp size={16} />
          </button>
          <button
            type="button"
            onClick={() => toast("Demo: opens filter panel")}
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search in activities ..."
            className="flex-1 bg-transparent outline-none placeholder:opacity-100"
            style={{
              color: "var(--color-text)",
              fontSize: "var(--text-body)",
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          {filters.includes("Team") && (
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
          )}
          {filters
            .filter((f) => f !== "Team")
            .map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => removeFilter(f)}
                className="inline-flex items-center gap-1.5 h-8 pl-3 pr-2 rounded-full"
                style={{
                  backgroundColor: "var(--color-surface-warm)",
                  color: "var(--color-text-2)",
                  fontSize: "var(--text-chip)",
                }}
              >
                {f}
                <X size={12} />
              </button>
            ))}
        </div>
      </div>

      {!collapsed && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActivityBarMini amount={amount} />
          <WorkspacesList />
          <WalletVerifyCard />
        </div>
      )}
    </div>
  );
}
