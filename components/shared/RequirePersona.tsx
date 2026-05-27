"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getActivePersonaId } from "@/lib/data/session";

export function RequirePersona({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!getActivePersonaId()) {
      router.replace("/login");
      return;
    }
    setChecked(true);
  }, [router]);

  if (!checked) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ color: "var(--color-text-muted)" }}
      >
        <span style={{ fontSize: "var(--text-body)" }}>Loading…</span>
      </div>
    );
  }
  return <>{children}</>;
}
