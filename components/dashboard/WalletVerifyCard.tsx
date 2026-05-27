"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "@/lib/toast";

export function WalletVerifyCard() {
  const [enabled, setEnabled] = useState(false);

  const onClick = () => {
    if (enabled) {
      setEnabled(false);
      toast("2-step verification disabled");
    } else {
      setEnabled(true);
      toast("2-step verification enabled", { tone: "success" });
    }
  };

  return (
    <div
      className="rounded-[var(--radius-sub-card)] border p-5 flex flex-col gap-3 items-center text-center"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <SunIllustration />
      <div>
        <p
          className="font-medium"
          style={{
            color: "var(--color-text)",
            fontSize: "var(--text-headline)",
          }}
        >
          Account security
        </p>
        <p
          className="mt-1"
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-meta)",
          }}
        >
          {enabled
            ? "Two-step verification is on."
            : "Enable 2-step verification\nto protect your sign-in."}
        </p>
      </div>
      <button
        type="button"
        onClick={onClick}
        className="w-full h-11 rounded-full font-medium mt-1 inline-flex items-center justify-center gap-2"
        style={{
          backgroundColor: enabled
            ? "var(--color-surface-warm)"
            : "var(--color-accent)",
          color: enabled
            ? "var(--color-text-2)"
            : "var(--color-text-on-accent)",
          fontSize: "var(--text-body)",
          border: enabled ? "1px solid var(--color-border)" : "none",
        }}
      >
        {enabled && <Check size={16} />}
        {enabled ? "Enabled" : "Enable"}
      </button>
    </div>
  );
}

function SunIllustration() {
  const c = "var(--color-accent)";
  return (
    <svg
      viewBox="0 0 64 56"
      width="64"
      height="56"
      aria-hidden
      style={{ overflow: "visible" }}
    >
      <circle cx="32" cy="28" r="10" fill={c} />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 32 + Math.cos(angle) * 14;
        const y1 = 28 + Math.sin(angle) * 14;
        const x2 = 32 + Math.cos(angle) * 22;
        const y2 = 28 + Math.sin(angle) * 22;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={c}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}
