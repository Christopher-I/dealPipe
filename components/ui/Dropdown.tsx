"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type DropdownProps = {
  options: string[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  align?: "left" | "right";
  className?: string;
};

export function Dropdown({
  options,
  defaultValue,
  value: controlledValue,
  onChange,
  align = "left",
  className,
}: DropdownProps) {
  const [internal, setInternal] = useState(defaultValue ?? options[0]);
  const value = controlledValue ?? internal;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={ref} className={`relative inline-block ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border"
        style={{
          backgroundColor: "var(--color-surface-warm)",
          borderColor: "var(--color-border)",
          color: "var(--color-text-2)",
          fontSize: "var(--text-chip)",
        }}
      >
        {value}
        <ChevronDown
          size={12}
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 150ms ease-out",
          }}
        />
      </button>
      {open && (
        <div
          className={`absolute mt-1.5 min-w-[160px] rounded-2xl border p-1 z-50 dp-rise ${
            align === "right" ? "right-0" : "left-0"
          }`}
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
          }}
        >
          {options.map((opt) => {
            const active = opt === value;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  if (!controlledValue) setInternal(opt);
                  setOpen(false);
                  onChange?.(opt);
                }}
                className="flex items-center justify-between gap-3 w-full px-3 py-2 rounded-xl text-left"
                style={{
                  color: active
                    ? "var(--color-text)"
                    : "var(--color-text-2)",
                  fontSize: "var(--text-body)",
                  fontWeight: active ? 500 : 400,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--color-surface-warm)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {opt}
                {active && (
                  <Check
                    size={14}
                    style={{ color: "var(--color-accent)" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
