"use client";

import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/shared/Logo";
import {
  PERSONAS,
  type Persona,
  setActivePersonaId,
} from "@/lib/data/session";

export default function LoginPage() {
  const router = useRouter();

  const pick = (persona: Persona) => {
    setActivePersonaId(persona.id);
    router.push("/app/dashboard");
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="flex flex-col items-center text-center mb-10">
        <Logo size="lg" withWordmark={false} className="mb-6" />
        <h1
          className="font-medium tracking-tight"
          style={{
            color: "var(--color-text)",
            fontSize: "var(--text-display)",
            lineHeight: "var(--text-display--line-height)",
          }}
        >
          Welcome to DealPipe
        </h1>
        <p
          className="mt-3 max-w-md"
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-body)",
          }}
        >
          Pick a persona to explore the demo. Each persona belongs to a
          different brokerage with its own deals, properties, and pipeline.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PERSONAS.map((persona) => (
          <button
            key={persona.id}
            type="button"
            onClick={() => pick(persona)}
            className="group text-left rounded-[var(--radius-card)] border p-6 transition-colors duration-200"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "var(--color-surface-warm)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-surface)")
            }
          >
            <div className="flex items-start justify-between mb-6">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white font-medium"
                style={{
                  backgroundColor: persona.orgAccentHex,
                  fontSize: "var(--text-headline)",
                }}
              >
                {persona.initials}
              </div>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                style={{
                  backgroundColor: "var(--color-ink)",
                  color: "var(--color-text-on-ink)",
                }}
              >
                <ArrowUpRight size={16} />
              </div>
            </div>
            <p
              className="font-medium"
              style={{
                color: "var(--color-text)",
                fontSize: "var(--text-headline)",
              }}
            >
              {persona.name}
            </p>
            <p
              className="mt-1"
              style={{
                color: "var(--color-text-muted)",
                fontSize: "var(--text-body)",
              }}
            >
              {persona.title}
            </p>
            <div
              className="h-px my-4"
              style={{ backgroundColor: "var(--color-border)" }}
            />
            <p
              className="capitalize"
              style={{
                color: "var(--color-text-muted)",
                fontSize: "var(--text-meta)",
              }}
            >
              {persona.role}
            </p>
            <p
              className="mt-0.5"
              style={{
                color: "var(--color-text-2)",
                fontSize: "var(--text-body)",
              }}
            >
              {persona.orgName}
            </p>
          </button>
        ))}
      </div>

      <p
        className="text-center mt-10"
        style={{
          color: "var(--color-text-subtle)",
          fontSize: "var(--text-meta)",
        }}
      >
        This is a demo. No real account is created. All data is mock.
      </p>
    </div>
  );
}
