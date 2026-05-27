"use client";

import { Check, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { subscribe, type Toast } from "@/lib/toast";

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => subscribe(setToasts), []);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="rounded-full border inline-flex items-center gap-2 pl-3 pr-4 h-11 dp-rise pointer-events-auto"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            color: "var(--color-text)",
            fontSize: "var(--text-body)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
          }}
        >
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={{
              backgroundColor:
                t.tone === "success"
                  ? "var(--color-surface-peach)"
                  : "var(--color-surface-warm)",
              color:
                t.tone === "success"
                  ? "var(--color-accent)"
                  : "var(--color-text-2)",
            }}
          >
            {t.tone === "success" ? (
              <Check size={14} />
            ) : (
              <Sparkles size={12} />
            )}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  );
}
