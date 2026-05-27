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
      className="rounded-[var(--radius-card-lg)] border p-6 flex flex-col gap-5 min-w-0"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
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

      {/* Search + chips: stacks below md, side-by-side above */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 min-w-0">
        <div
          className="flex items-center gap-2 flex-1 h-10 px-4 rounded-full min-w-0"
          style={{ backgroundColor: "var(--color-surface-warm)" }}
        >
          <Search
            size={14}
            style={{ color: "var(--color-text-subtle)" }}
            className="shrink-0"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search in activities ..."
            className="flex-1 min-w-0 bg-transparent outline-none placeholder:opacity-100"
            style={{
              color: "var(--color-text)",
              fontSize: "var(--text-body)",
            }}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {filters.includes("Team") && (
            <span
              className="inline-flex items-center gap-2 h-8 px-3 rounded-full border whitespace-nowrap"
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
                className="inline-flex items-center gap-1.5 h-8 pl-3 pr-2 rounded-full whitespace-nowrap"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[minmax(0,3fr)_minmax(0,5fr)_minmax(0,3fr)] gap-4">
          <ActivityBarMini amount={amount} />
          <WorkspacesList />
          <div className="sm:col-span-2 xl:col-span-1">
            <WalletVerifyCard />
          </div>
        </div>
      )}
    </div>
  );
}
