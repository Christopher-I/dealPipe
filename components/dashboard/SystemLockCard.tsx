"use client";

import { Lock, Unlock } from "lucide-react";
import { useState } from "react";
import { toast } from "@/lib/toast";

export function SystemLockCard() {
  const [locked, setLocked] = useState(true);
  const Icon = locked ? Lock : Unlock;
  return (
    <button
      type="button"
      onClick={() => {
        setLocked((v) => !v);
        toast(
          locked ? "Session unlocked" : "Session locked",
          { tone: locked ? "default" : "success" },
        );
      }}
      className="rounded-[var(--radius-card)] border p-5 flex flex-col items-center justify-center gap-2 h-full w-full"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <Icon
        size={26}
        style={{
          color: locked ? "var(--color-text)" : "var(--color-accent)",
        }}
      />
      <span
        className="font-medium"
        style={{
          color: "var(--color-text)",
          fontSize: "var(--text-label)",
        }}
      >
        {locked ? "System Lock" : "Unlocked"}
      </span>
    </button>
  );
}
