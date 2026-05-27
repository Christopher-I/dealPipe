"use client";

import { ArrowUpRight } from "lucide-react";

export function ShowMyTasksPill({
  label = "Show my deals",
  onClick,
}: {
  label?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex items-center gap-3 h-14 pl-7 pr-1.5 rounded-full font-medium transition-[filter,transform] duration-200"
      style={{
        background:
          "linear-gradient(180deg, #EB6A4D 0%, #E15B3F 50%, #D74D31 100%)",
        color: "var(--color-text-on-accent)",
        fontSize: "var(--text-body)",
      }}
    >
      {label}
      <span
        className="w-11 h-11 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        style={{ backgroundColor: "var(--color-ink)" }}
      >
        <ArrowUpRight size={18} color="white" />
      </span>
    </button>
  );
}
