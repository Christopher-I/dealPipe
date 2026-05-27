"use client";

import { Building2, Pencil } from "lucide-react";
import Link from "next/link";
import { Dropdown } from "@/components/ui/Dropdown";
import { toast } from "@/lib/toast";

export function AccountCard() {
  return (
    <div
      className="rounded-[var(--radius-card)] border p-5 flex flex-col gap-4 h-full"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: "var(--color-ink)",
              color: "var(--color-text-on-ink)",
            }}
          >
            <Building2 size={14} />
          </span>
          <span
            className="font-medium tracking-tight"
            style={{
              color: "var(--color-text)",
              fontSize: "var(--text-label)",
            }}
          >
            Treasury
          </span>
        </div>
        <Dropdown
          options={["Wire transfers", "ACH", "Checks", "All movements"]}
          defaultValue="Wire transfers"
          onChange={(v) => toast(`Filter: ${v}`)}
          align="right"
        />
      </div>

      <div>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-meta)",
          }}
        >
          Linked to fund operating account
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

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() =>
            toast("Demo: opens deposit flow", { tone: "success" })
          }
          className="h-10 px-6 rounded-full font-medium"
          style={{
            backgroundColor: "var(--color-ink)",
            color: "var(--color-text-on-ink)",
            fontSize: "var(--text-body)",
          }}
        >
          Deposit
        </button>
        <button
          type="button"
          onClick={() => toast("Demo: opens transfer flow")}
          className="h-10 px-6 rounded-full font-medium border"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            color: "var(--color-text-2)",
            fontSize: "var(--text-body)",
          }}
        >
          Transfer
        </button>
      </div>

      <div
        className="h-px"
        style={{ backgroundColor: "var(--color-border)" }}
      />

      <div className="flex items-end justify-between gap-3">
        <div>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "var(--text-meta)",
            }}
          >
            Platform fee
          </p>
          <p
            className="font-medium tabular mt-1"
            style={{
              color: "var(--color-text)",
              fontSize: "var(--text-metric-md)",
            }}
          >
            <span className="mr-1">$</span>25.00
            <span
              className="ml-1"
              style={{
                color: "var(--color-text-muted)",
                fontSize: "var(--text-meta)",
              }}
            >
              / mo
            </span>
          </p>
        </div>
        <Link
          href="/app/settings/billing"
          className="inline-flex items-center gap-2.5 pl-1.5 pr-3.5 h-11 rounded-full"
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
            style={{
              color: "var(--color-text-2)",
              fontSize: "var(--text-chip)",
            }}
          >
            Manage limits
          </span>
        </Link>
      </div>
    </div>
  );
}
