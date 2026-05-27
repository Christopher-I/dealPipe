import { Lock } from "lucide-react";

export function SystemLockCard() {
  return (
    <div
      className="rounded-[var(--radius-card)] border p-6 flex flex-col items-center justify-center gap-3"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <Lock size={28} style={{ color: "var(--color-text)" }} />
      <span
        className="font-medium"
        style={{
          color: "var(--color-text)",
          fontSize: "var(--text-label)",
        }}
      >
        System Lock
      </span>
    </div>
  );
}
