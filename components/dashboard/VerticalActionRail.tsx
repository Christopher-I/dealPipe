"use client";

import { CornerUpRight, Plus } from "lucide-react";
import { toast } from "@/lib/toast";

export function VerticalActionRail() {
  return (
    <div
      className="flex flex-col items-center gap-6 w-11 py-6 rounded-full border self-stretch"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <button
        type="button"
        aria-label="Add"
        onClick={() => toast("Demo: opens new-deal form")}
        className="w-6 h-6 flex items-center justify-center"
        style={{ color: "var(--color-text-2)" }}
      >
        <Plus size={20} />
      </button>
      <div
        className="w-5 h-px"
        style={{ backgroundColor: "var(--color-border)" }}
      />
      <button
        type="button"
        aria-label="Share"
        onClick={() => toast("Link copied to clipboard", { tone: "success" })}
        className="w-6 h-6 flex items-center justify-center"
        style={{ color: "var(--color-text-2)" }}
      >
        <CornerUpRight size={20} />
      </button>
    </div>
  );
}
