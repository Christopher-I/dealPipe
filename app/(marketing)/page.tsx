import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

export default function LandingPage() {
  return (
    <div className="px-4 py-6 lg:py-10">
      <div
        className="rounded-[var(--radius-shell)] px-6 py-8 lg:px-12 lg:py-16"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <nav className="flex items-center justify-between mb-16 lg:mb-24">
          <Logo size="md" />
          <Link
            href="/login"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-full border transition-colors duration-200"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-2)",
              fontSize: "var(--text-body)",
            }}
          >
            Sign in
          </Link>
        </nav>

        <div className="max-w-3xl">
          <p
            className="mb-4"
            style={{
              color: "var(--color-text-muted)",
              fontSize: "var(--text-label)",
            }}
          >
            For commercial real estate teams
          </p>
          <h1
            className="font-medium tracking-tight"
            style={{
              color: "var(--color-text)",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              lineHeight: 1.05,
            }}
          >
            Salesforce for CRE deals, with an AI search and a map view
            incumbents still don&apos;t have in 2026.
          </h1>
          <p
            className="mt-6 max-w-2xl"
            style={{
              color: "var(--color-text-muted)",
              fontSize: "var(--text-headline)",
              lineHeight: 1.5,
            }}
          >
            Track deals from sourcing through close, ask questions in plain
            English, and see your portfolio on a real map.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-3 h-14 pl-7 pr-2 rounded-full font-medium transition-[filter,transform] duration-200"
              style={{
                background:
                  "linear-gradient(180deg, #EB6A4D 0%, #E15B3F 50%, #D74D31 100%)",
                color: "var(--color-text-on-accent)",
                fontSize: "var(--text-body)",
              }}
            >
              Try the demo
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--color-ink)" }}
              >
                <ArrowUpRight size={16} />
              </span>
            </Link>
            <Link
              href="/app/dashboard"
              className="inline-flex items-center h-14 px-7 rounded-full border transition-colors duration-200"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-2)",
                fontSize: "var(--text-body)",
              }}
            >
              Skip to dashboard
            </Link>
          </div>
        </div>

        <div
          className="mt-20 grid md:grid-cols-3 gap-5"
          aria-label="What DealPipe gives a CRE team"
        >
          {[
            {
              title: "Pipeline you can drag",
              body: "Sourcing → LOI → Diligence → Closing → Closed. Kanban or table. Real-time totals.",
            },
            {
              title: "Properties on a real map",
              body: "Every property pinned to its actual coordinates. Filter by cap rate, asset class, geography.",
            },
            {
              title: "AI search you can talk to",
              body: "“Office buildings in Texas with cap rate above 7% under $20M.” It just answers.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-[var(--radius-card)] border p-6"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <h3
                className="font-medium"
                style={{
                  color: "var(--color-text)",
                  fontSize: "var(--text-headline)",
                }}
              >
                {card.title}
              </h3>
              <p
                className="mt-2"
                style={{
                  color: "var(--color-text-muted)",
                  fontSize: "var(--text-body)",
                  lineHeight: "var(--text-body--line-height)",
                }}
              >
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
