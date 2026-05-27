"use client";

import { Calendar } from "lucide-react";
import { ShowMyTasksPill } from "./ShowMyTasksPill";

export function DateTaskRow({ date }: { date: Date }) {
  const dayNum = date.getDate();
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const month = date.toLocaleDateString("en-US", { month: "long" });

  return (
    <div className="flex items-center gap-5">
      <div
        className="w-[72px] h-[72px] rounded-full flex items-center justify-center border"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border-strong)",
        }}
      >
        <span
          className="font-medium tabular"
          style={{
            color: "var(--color-text)",
            fontSize: "var(--text-metric-md)",
          }}
        >
          {dayNum}
        </span>
      </div>
      <div className="flex flex-col leading-tight">
        <span
          className="font-medium"
          style={{
            color: "var(--color-text)",
            fontSize: "var(--text-body)",
          }}
        >
          {weekday},
        </span>
        <span
          className="font-medium"
          style={{
            color: "var(--color-text)",
            fontSize: "var(--text-body)",
          }}
        >
          {month}
        </span>
      </div>
      <ShowMyTasksPill />
      <button
        type="button"
        aria-label="Calendar"
        className="relative w-12 h-12 rounded-full flex items-center justify-center border transition-colors duration-200"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
          color: "var(--color-text-2)",
        }}
      >
        <Calendar size={18} />
        <span
          className="absolute top-2 right-2 w-2 h-2 rounded-full"
          style={{ backgroundColor: "var(--color-accent)" }}
        />
      </button>
    </div>
  );
}
