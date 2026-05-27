"use client";

import { ArrowUpRight, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePersona } from "@/components/shared/PersonaProvider";
import { DealTable } from "@/components/deals/DealTable";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { listOrgMembers, listProperties } from "@/lib/data";
import type { SearchInterpretation, SearchResponse } from "@/lib/ai-search/types";
import type { Deal, Property, User } from "@/types/domain";

const SAMPLES = [
  "Office buildings in Texas with cap rate above 7% under $20M",
  "Show me multifamily deals in the diligence stage",
  "Industrial properties between $5M and $15M",
  "Recently closed deals worth more than $10M",
  "Hospitality properties in California with cap rate above 6%",
];

export default function SearchPage() {
  const { persona } = usePersona();
  const params = useSearchParams();
  const initialQ = params.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);
  const [busy, setBusy] = useState(false);
  const [response, setResponse] = useState<SearchResponse | null>(null);
  const [propertyMap, setPropertyMap] = useState<Map<string, Property>>(new Map());
  const [memberMap, setMemberMap] = useState<Map<string, User>>(new Map());

  useEffect(() => {
    let alive = true;
    Promise.all([
      listProperties({ orgId: persona.orgId }),
      listOrgMembers({ orgId: persona.orgId }),
    ]).then(([p, m]) => {
      if (!alive) return;
      setPropertyMap(new Map(p.map((x) => [x.id, x])));
      setMemberMap(new Map(m.map((x) => [x.id, x])));
    });
    return () => {
      alive = false;
    };
  }, [persona.orgId]);

  // Auto-run when arriving with ?q=…
  useEffect(() => {
    if (initialQ) {
      runQuery(initialQ);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runQuery = async (q: string) => {
    if (!q.trim()) return;
    setBusy(true);
    setResponse(null);
    try {
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query: q, orgId: persona.orgId }),
      });
      const data: SearchResponse = await res.json();
      setResponse(data);
    } catch (err) {
      setResponse({
        ok: false,
        error: (err as Error).message ?? "Request failed",
      });
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runQuery(query);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1
          className="font-medium tracking-tight"
          style={{
            color: "var(--color-text)",
            fontSize: "var(--text-display)",
            lineHeight: "var(--text-display--line-height)",
          }}
        >
          Ask anything about your portfolio.
        </h1>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-body)",
          }}
        >
          Natural language goes in, structured filters come out, and the
          right slice of {persona.orgName}&apos;s data comes back.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="flex items-center gap-3 rounded-full border p-1.5"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: "var(--color-surface-warm)",
            color: "var(--color-accent)",
          }}
        >
          <Sparkles size={18} />
        </div>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Office buildings in Texas with cap rate above 7%…"
          className="flex-1 bg-transparent outline-none"
          style={{
            color: "var(--color-text)",
            fontSize: "var(--text-headline)",
          }}
        />
        <button
          type="submit"
          disabled={busy || !query.trim()}
          className="inline-flex items-center gap-2 h-11 pl-5 pr-2 rounded-full font-medium transition-[filter] duration-200 disabled:opacity-50 disabled:pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, #EB6A4D 0%, #E15B3F 50%, #D74D31 100%)",
            color: "var(--color-text-on-accent)",
            fontSize: "var(--text-body)",
          }}
        >
          {busy ? "Searching…" : "Search"}
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--color-ink)" }}
          >
            <ArrowUpRight size={14} color="white" />
          </span>
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <span
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-meta)",
          }}
        >
          Try
        </span>
        {SAMPLES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setQuery(s);
              runQuery(s);
            }}
            className="px-3 h-8 rounded-full border transition-colors duration-200"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-2)",
              fontSize: "var(--text-chip)",
            }}
          >
            <Search
              size={11}
              className="inline mr-1.5"
              style={{ color: "var(--color-text-subtle)" }}
            />
            {s}
          </button>
        ))}
      </div>

      {response && <ResultBlock response={response} propertyMap={propertyMap} memberMap={memberMap} />}
    </div>
  );
}

function ResultBlock({
  response,
  propertyMap,
  memberMap,
}: {
  response: SearchResponse;
  propertyMap: Map<string, Property>;
  memberMap: Map<string, User>;
}) {
  if (!response.ok) {
    return (
      <div
        className="rounded-[var(--radius-card)] border p-6"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <p
          className="font-medium"
          style={{
            color: "var(--color-text)",
            fontSize: "var(--text-body)",
          }}
        >
          Search failed
        </p>
        <p
          className="mt-1"
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-meta)",
          }}
        >
          {response.error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <SummaryStrip
        summary={response.summary}
        backend={response.backend}
        interpretation={response.interpretation}
      />
      {response.type === "properties" ? (
        <PropertyResults results={response.results} />
      ) : (
        <DealResults results={response.results} propertyMap={propertyMap} memberMap={memberMap} />
      )}
    </div>
  );
}

function SummaryStrip({
  summary,
  backend,
  interpretation,
}: {
  summary: string;
  backend: "claude" | "fallback";
  interpretation: SearchInterpretation;
}) {
  return (
    <div
      className="rounded-[var(--radius-card)] border p-5"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex items-center gap-3 flex-wrap">
        <span
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{
            backgroundColor: "var(--color-surface-peach)",
            color: "var(--color-accent)",
          }}
        >
          <Sparkles size={16} />
        </span>
        <p
          className="font-medium flex-1 min-w-0"
          style={{
            color: "var(--color-text)",
            fontSize: "var(--text-headline)",
          }}
        >
          {summary}
        </p>
        <span
          className="inline-flex items-center px-3 h-7 rounded-full capitalize"
          style={{
            backgroundColor: "var(--color-surface-warm)",
            color: "var(--color-text-2)",
            fontSize: "var(--text-meta)",
          }}
        >
          {backend === "claude" ? "via Claude tool-use" : "via fallback parser"}
        </span>
      </div>
      <details className="mt-3">
        <summary
          className="cursor-pointer"
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-meta)",
          }}
        >
          Show interpreted filter
        </summary>
        <pre
          className="mt-2 p-3 rounded-xl overflow-x-auto"
          style={{
            backgroundColor: "var(--color-surface-warm)",
            color: "var(--color-text-2)",
            fontSize: "12px",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          {JSON.stringify(interpretation, null, 2)}
        </pre>
      </details>
    </div>
  );
}

function PropertyResults({ results }: { results: Property[] }) {
  if (results.length === 0) {
    return <EmptyResults what="properties" />;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {results.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  );
}

function DealResults({
  results,
  propertyMap,
  memberMap,
}: {
  results: Deal[];
  propertyMap: Map<string, Property>;
  memberMap: Map<string, User>;
}) {
  if (results.length === 0) {
    return <EmptyResults what="deals" />;
  }
  return <DealTable deals={results} properties={propertyMap} members={memberMap} />;
}

function EmptyResults({ what }: { what: string }) {
  return (
    <div
      className="rounded-[var(--radius-card)] border p-10 text-center"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <p
        className="font-medium"
        style={{
          color: "var(--color-text)",
          fontSize: "var(--text-body)",
        }}
      >
        No matching {what}.
      </p>
      <p
        className="mt-2"
        style={{
          color: "var(--color-text-muted)",
          fontSize: "var(--text-meta)",
        }}
      >
        Try a broader filter or a different query.
      </p>
      <Link
        href="/app/dashboard"
        className="inline-block mt-4 hover:underline"
        style={{
          color: "var(--color-accent)",
          fontSize: "var(--text-body)",
        }}
      >
        Back to dashboard →
      </Link>
    </div>
  );
}
