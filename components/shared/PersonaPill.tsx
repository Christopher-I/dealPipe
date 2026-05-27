"use client";

import { useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { usePersona } from "./PersonaProvider";

export function PersonaPill() {
  const { persona, signOut } = usePersona();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 sm:gap-3 h-11 pl-1.5 pr-3 sm:pr-4 rounded-full border"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <span
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-medium shrink-0"
          style={{ backgroundColor: persona.orgAccentHex }}
        >
          {persona.initials}
        </span>
        {/* Name + title hidden on small screens — avatar+chevron only */}
        <span className="hidden md:flex flex-col leading-tight items-start min-w-0">
          <span
            className="font-medium truncate"
            style={{
              color: "var(--color-text)",
              fontSize: "var(--text-body)",
              maxWidth: "120px",
            }}
          >
            {persona.name}
          </span>
          <span
            className="truncate"
            style={{
              color: "var(--color-text-muted)",
              fontSize: "var(--text-meta)",
              maxWidth: "120px",
            }}
          >
            {persona.title}
          </span>
        </span>
        <ChevronDown
          size={14}
          style={{ color: "var(--color-text-muted)" }}
          className="shrink-0"
        />
      </button>
      {open && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-2xl border p-2 z-50"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="px-3 py-2">
            <p
              className="font-medium"
              style={{
                color: "var(--color-text)",
                fontSize: "var(--text-body)",
              }}
            >
              {persona.name}
            </p>
            <p
              style={{
                color: "var(--color-text-muted)",
                fontSize: "var(--text-meta)",
              }}
            >
              {persona.title}
            </p>
            <p
              className="capitalize mt-1.5"
              style={{
                color: "var(--color-text-muted)",
                fontSize: "var(--text-meta)",
              }}
            >
              {persona.orgName} · {persona.role}
            </p>
          </div>
          <div
            className="h-px my-1"
            style={{ backgroundColor: "var(--color-border)" }}
          />
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-left"
            style={{
              color: "var(--color-text-2)",
              fontSize: "var(--text-body)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "var(--color-surface-warm)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <LogOut size={16} />
            Switch persona
          </button>
        </div>
      )}
    </div>
  );
}
