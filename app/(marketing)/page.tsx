import {
  ArrowUpRight,
  FileText,
  Mic,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

const FEATURE_CARDS = [
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
    body: '"Office buildings in Texas with cap rate above 7% under $20M." It just answers.',
  },
];

const AI_FEATURES = [
  {
    icon: Mic,
    title: "Voice chat",
    body: "Press the mic on your dashboard. Ask anything — pipeline, properties, deal status — out loud.",
  },
  {
    icon: Search,
    title: "Natural-language search",
    body: "Translate a brief into a structured query. Claude tool-use under the hood, your portfolio scoped automatically.",
  },
  {
    icon: FileText,
    title: "Deal briefings",
    body: "One-paragraph status on any deal: where it sits, what's blocking, who's owning what.",
  },
  {
    icon: TrendingUp,
    title: "At-risk detection",
    body: "Pipeline insights flag deals stalling past their stage-typical timeline before they slip.",
  },
  {
    icon: Sparkles,
    title: "Comp finder",
    body: "Ask for comparable transactions. The assistant pulls comps from your portfolio + the market.",
  },
];

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
          <span
            className="inline-flex items-center gap-2 h-7 px-3 rounded-full mb-5"
            style={{
              backgroundColor: "var(--color-surface-peach)",
              color: "var(--color-accent)",
              fontSize: "var(--text-meta)",
              fontWeight: 500,
            }}
          >
            <Sparkles size={12} />
            AI assistant built in
          </span>
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
            Salesforce for CRE deals, with an AI assistant and a map view
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
            Track deals from sourcing through close. Talk to your portfolio
            out loud, search in plain English, and see every asset on a real
            map.
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

        {/* Core features (functional) */}
        <div
          className="mt-20 grid md:grid-cols-3 gap-5"
          aria-label="What DealPipe gives a CRE team"
        >
          {FEATURE_CARDS.map((card) => (
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

        {/* AI Assistant section */}
        <section className="mt-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div className="max-w-2xl">
              <span
                className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full mb-3"
                style={{
                  backgroundColor: "var(--color-surface-peach)",
                  color: "var(--color-accent)",
                  fontSize: "var(--text-meta)",
                  fontWeight: 500,
                }}
              >
                <Sparkles size={12} />
                DealPipe AI
              </span>
              <h2
                className="font-medium tracking-tight"
                style={{
                  color: "var(--color-text)",
                  fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                  lineHeight: 1.1,
                }}
              >
                The assistant lives in every surface.
              </h2>
              <p
                className="mt-3"
                style={{
                  color: "var(--color-text-muted)",
                  fontSize: "var(--text-headline)",
                  lineHeight: 1.5,
                }}
              >
                Not a chatbot tab bolted on the side. The assistant is in your
                topbar, your dashboard mic, your search box, and your deal
                detail page — wherever you&apos;d normally have to type more.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {AI_FEATURES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-[var(--radius-card)] border p-6 flex flex-col gap-3"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                }}
              >
                <span
                  className="w-11 h-11 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: "var(--color-surface-peach)",
                    color: "var(--color-accent)",
                  }}
                >
                  <Icon size={18} />
                </span>
                <h3
                  className="font-medium"
                  style={{
                    color: "var(--color-text)",
                    fontSize: "var(--text-headline)",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    color: "var(--color-text-muted)",
                    fontSize: "var(--text-body)",
                    lineHeight: "var(--text-body--line-height)",
                  }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
