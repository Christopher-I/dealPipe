"use client";

import { ArrowLeft, FileText, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { usePersona } from "@/components/shared/PersonaProvider";
import {
  getDeal,
  getMember,
  getProperty,
  listActivities,
  listDocuments,
} from "@/lib/data";
import {
  ASSET_CLASS_LABEL,
  formatCompactMoney,
  formatDate,
  STAGE_LABEL,
} from "@/lib/format";
import type {
  Activity,
  Deal,
  DocumentRef,
  Property,
  User,
} from "@/types/domain";

const ACTIVITY_LABEL: Record<string, string> = {
  note: "Note",
  stage_change: "Stage change",
  document_upload: "Document",
  deal_created: "Created",
  deal_won: "Won",
  deal_lost: "Lost",
};

function formatBytes(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} MB`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)} KB`;
  return `${n} B`;
}

export default function DealDetailPage() {
  const { persona } = usePersona();
  const params = useParams<{ id: string }>();
  const dealId = params.id;

  const [deal, setDeal] = useState<Deal | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [documents, setDocuments] = useState<DocumentRef[]>([]);
  const [memberById, setMemberById] = useState<Map<string, User>>(new Map());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const d = await getDeal({ id: dealId });
      if (!alive) return;
      setDeal(d);
      if (!d || d.orgId !== persona.orgId) {
        setLoaded(true);
        return;
      }
      const [p, o, acts, docs] = await Promise.all([
        getProperty({ id: d.propertyId }),
        getMember({ id: d.ownerId }),
        listActivities({ orgId: d.orgId, dealId: d.id }),
        listDocuments({ dealId: d.id }),
      ]);
      if (!alive) return;
      setProperty(p);
      setOwner(o);
      setActivities(acts);
      setDocuments(docs);
      const userIds = new Set(acts.map((a) => a.userId));
      const members = await Promise.all(
        Array.from(userIds).map((id) => getMember({ id })),
      );
      const map = new Map<string, User>();
      for (const m of members) if (m) map.set(m.id, m);
      setMemberById(map);
      setLoaded(true);
    })();
    return () => {
      alive = false;
    };
  }, [dealId, persona.orgId]);

  if (loaded && (!deal || deal.orgId !== persona.orgId)) {
    return (
      <div className="space-y-4">
        <Link
          href="/app/deals"
          className="inline-flex items-center gap-1.5"
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-body)",
          }}
        >
          <ArrowLeft size={14} />
          Back to deals
        </Link>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-body)",
          }}
        >
          That deal isn&apos;t available in {persona.orgName}.
        </p>
      </div>
    );
  }

  if (!deal) {
    return (
      <p style={{ color: "var(--color-text-muted)" }}>
        Loading deal…
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <Link
          href="/app/deals"
          className="inline-flex items-center gap-1.5 self-start hover:underline"
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-body)",
          }}
        >
          <ArrowLeft size={14} />
          Back to deals
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span
                className="inline-flex items-center px-3 h-7 rounded-full"
                style={{
                  backgroundColor: "var(--color-surface-warm)",
                  color: "var(--color-text-2)",
                  fontSize: "var(--text-chip)",
                }}
              >
                {STAGE_LABEL[deal.stage]}
              </span>
              <span
                className="tabular"
                style={{
                  color: "var(--color-text-muted)",
                  fontSize: "var(--text-meta)",
                }}
              >
                {deal.probability}% probability
              </span>
            </div>
            <h1
              className="font-medium tracking-tight"
              style={{
                color: "var(--color-text)",
                fontSize: "var(--text-display)",
                lineHeight: "var(--text-display--line-height)",
              }}
            >
              {deal.name}
            </h1>
          </div>
          <p
            className="font-medium tabular"
            style={{
              color: "var(--color-text)",
              fontSize: "var(--text-metric-xl)",
            }}
          >
            <span style={{ color: "var(--color-accent)" }}>$</span>
            {formatCompactMoney(deal.amountUsd).replace("$", "")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {property && <PropertyCard property={property} />}
          <NotesCard notes={deal.notes} />
          <ActivityCard activities={activities} memberById={memberById} />
        </div>
        <div className="space-y-5">
          <DetailsCard deal={deal} owner={owner} />
          <DocumentsCard docs={documents} />
        </div>
      </div>
    </div>
  );
}

function PropertyCard({ property }: { property: Property }) {
  return (
    <div
      className="rounded-[var(--radius-card)] border overflow-hidden"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      {property.photoUrl && (
        <div
          className="relative w-full aspect-[16/7]"
          style={{ backgroundColor: "var(--color-surface-warm)" }}
        >
          <Image
            src={property.photoUrl}
            alt={property.name}
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p
              className="font-medium"
              style={{
                color: "var(--color-text)",
                fontSize: "var(--text-headline)",
              }}
            >
              {property.name}
            </p>
            <p
              className="inline-flex items-center gap-1 mt-1"
              style={{
                color: "var(--color-text-muted)",
                fontSize: "var(--text-body)",
              }}
            >
              <MapPin size={12} />
              {property.address} · {property.city}, {property.state}
            </p>
          </div>
          <span
            className="inline-flex items-center px-3 h-7 rounded-full"
            style={{
              backgroundColor: "var(--color-surface-warm)",
              color: "var(--color-text-2)",
              fontSize: "var(--text-chip)",
            }}
          >
            {ASSET_CLASS_LABEL[property.assetClass]}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-3" style={{ borderTop: "1px solid var(--color-border)" }}>
          <Field label="Price" value={formatCompactMoney(property.priceUsd)} />
          <Field label="Cap rate" value={`${property.capRate.toFixed(2)}%`} />
          <Field label="Year built" value={String(property.yearBuilt)} />
        </div>
        <p
          className="pt-2"
          style={{
            color: "var(--color-text-2)",
            fontSize: "var(--text-body)",
            lineHeight: "var(--text-body--line-height)",
          }}
        >
          {property.description}
        </p>
      </div>
    </div>
  );
}

function NotesCard({ notes }: { notes: string }) {
  return (
    <div
      className="rounded-[var(--radius-card)] border p-6"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <p
        className="font-medium mb-3"
        style={{
          color: "var(--color-text)",
          fontSize: "var(--text-label)",
        }}
      >
        Notes
      </p>
      <p
        style={{
          color: "var(--color-text-2)",
          fontSize: "var(--text-body)",
          lineHeight: "var(--text-body--line-height)",
        }}
      >
        {notes}
      </p>
    </div>
  );
}

function ActivityCard({
  activities,
  memberById,
}: {
  activities: Activity[];
  memberById: Map<string, User>;
}) {
  return (
    <div
      className="rounded-[var(--radius-card)] border p-6"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <p
        className="font-medium mb-4"
        style={{
          color: "var(--color-text)",
          fontSize: "var(--text-label)",
        }}
      >
        Activity
      </p>
      {activities.length === 0 ? (
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-body)",
          }}
        >
          No activity yet.
        </p>
      ) : (
        <ol className="space-y-3">
          {activities.map((a) => {
            const u = memberById.get(a.userId);
            return (
              <li key={a.id} className="flex items-start gap-3">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: "var(--color-surface-warm)",
                    color: "var(--color-accent)",
                    fontSize: "10px",
                    fontWeight: 500,
                  }}
                >
                  {ACTIVITY_LABEL[a.type]?.[0] ?? "·"}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    style={{
                      color: "var(--color-text-2)",
                      fontSize: "var(--text-body)",
                    }}
                  >
                    {a.body}
                  </p>
                  <p
                    className="mt-0.5 tabular"
                    style={{
                      color: "var(--color-text-muted)",
                      fontSize: "var(--text-meta)",
                    }}
                  >
                    {u?.name ?? "Unknown"} · {formatDate(a.createdAt)} ·{" "}
                    {ACTIVITY_LABEL[a.type] ?? a.type}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function DetailsCard({ deal, owner }: { deal: Deal; owner: User | null }) {
  return (
    <div
      className="rounded-[var(--radius-card)] border p-6 space-y-4"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <p
        className="font-medium"
        style={{
          color: "var(--color-text)",
          fontSize: "var(--text-label)",
        }}
      >
        Details
      </p>
      <Field label="Amount" value={
        <span className="tabular">
          <span style={{ color: "var(--color-accent)" }}>$</span>
          {formatCompactMoney(deal.amountUsd).replace("$", "")}
        </span>
      } />
      <Field label="Probability" value={`${deal.probability}%`} />
      <Field label="Expected close" value={formatDate(deal.expectedClose)} />
      <Field label="Owner" value={owner ? `${owner.name} · ${owner.title ?? owner.role}` : "—"} />
      <Field label="Created" value={formatDate(deal.createdAt)} />
      <Field label="Updated" value={formatDate(deal.updatedAt)} />
    </div>
  );
}

function DocumentsCard({ docs }: { docs: DocumentRef[] }) {
  return (
    <div
      className="rounded-[var(--radius-card)] border p-6"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <p
        className="font-medium mb-3"
        style={{
          color: "var(--color-text)",
          fontSize: "var(--text-label)",
        }}
      >
        Documents
      </p>
      {docs.length === 0 ? (
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-body)",
          }}
        >
          No documents.
        </p>
      ) : (
        <ul className="space-y-2">
          {docs.map((d) => (
            <li
              key={d.id}
              className="flex items-center gap-3 rounded-xl p-2 -mx-2"
            >
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: "var(--color-surface-warm)",
                  color: "var(--color-accent)",
                }}
              >
                <FileText size={14} />
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className="truncate"
                  style={{
                    color: "var(--color-text)",
                    fontSize: "var(--text-body)",
                  }}
                >
                  {d.filename}
                </p>
                <p
                  className="tabular"
                  style={{
                    color: "var(--color-text-muted)",
                    fontSize: "var(--text-meta)",
                  }}
                >
                  {formatBytes(d.sizeBytes)} · {formatDate(d.createdAt)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span
        style={{
          color: "var(--color-text-muted)",
          fontSize: "var(--text-meta)",
        }}
      >
        {label}
      </span>
      <span
        className="font-medium text-right"
        style={{
          color: "var(--color-text)",
          fontSize: "var(--text-body)",
        }}
      >
        {value}
      </span>
    </div>
  );
}
