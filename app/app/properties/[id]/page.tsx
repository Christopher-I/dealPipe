"use client";

import { ArrowLeft, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { usePersona } from "@/components/shared/PersonaProvider";
import { getProperty, listDeals } from "@/lib/data";
import {
  ASSET_CLASS_LABEL,
  formatCompactMoney,
  formatDate,
  STAGE_LABEL,
} from "@/lib/format";
import type { Deal, Property } from "@/types/domain";

const PropertyMap = dynamic(
  () => import("@/components/properties/PropertyMap").then((m) => m.PropertyMap),
  { ssr: false },
);

export default function PropertyDetailPage() {
  const { persona } = usePersona();
  const params = useParams<{ id: string }>();
  const propertyId = params.id;

  const [property, setProperty] = useState<Property | null>(null);
  const [linkedDeals, setLinkedDeals] = useState<Deal[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const p = await getProperty({ id: propertyId });
      if (!alive) return;
      if (!p || p.orgId !== persona.orgId) {
        setProperty(null);
        setLoaded(true);
        return;
      }
      const deals = await listDeals({ orgId: persona.orgId });
      if (!alive) return;
      setProperty(p);
      setLinkedDeals(deals.filter((d) => d.propertyId === p.id));
      setLoaded(true);
    })();
    return () => {
      alive = false;
    };
  }, [propertyId, persona.orgId]);

  if (loaded && !property) {
    return (
      <div className="space-y-4">
        <Link
          href="/app/properties"
          className="inline-flex items-center gap-1.5"
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-body)",
          }}
        >
          <ArrowLeft size={14} />
          Back to properties
        </Link>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-body)",
          }}
        >
          That property isn&apos;t available in {persona.orgName}.
        </p>
      </div>
    );
  }

  if (!property) {
    return (
      <p style={{ color: "var(--color-text-muted)" }}>Loading property…</p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <Link
          href="/app/properties"
          className="inline-flex items-center gap-1.5 self-start hover:underline"
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-body)",
          }}
        >
          <ArrowLeft size={14} />
          Back to properties
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
                {ASSET_CLASS_LABEL[property.assetClass]}
              </span>
              <p
                className="inline-flex items-center gap-1"
                style={{
                  color: "var(--color-text-muted)",
                  fontSize: "var(--text-body)",
                }}
              >
                <MapPin size={12} />
                {property.address} · {property.city}, {property.state}{" "}
                {property.zip}
              </p>
            </div>
            <h1
              className="font-medium tracking-tight"
              style={{
                color: "var(--color-text)",
                fontSize: "var(--text-display)",
                lineHeight: "var(--text-display--line-height)",
              }}
            >
              {property.name}
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
            {formatCompactMoney(property.priceUsd).replace("$", "")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {property.photoUrl && (
            <div
              className="relative w-full aspect-[16/8] rounded-[var(--radius-card)] overflow-hidden border"
              style={{
                backgroundColor: "var(--color-surface-warm)",
                borderColor: "var(--color-border)",
              }}
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
          <div
            className="rounded-[var(--radius-card)] border p-6 space-y-3"
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
              About this property
            </p>
            <p
              style={{
                color: "var(--color-text-2)",
                fontSize: "var(--text-body)",
                lineHeight: "var(--text-body--line-height)",
              }}
            >
              {property.description}
            </p>
            <div
              className="grid grid-cols-3 gap-4 pt-3"
              style={{ borderTop: "1px solid var(--color-border)" }}
            >
              <Field label="Cap rate" value={`${property.capRate.toFixed(2)}%`} />
              <Field
                label="Square feet"
                value={property.sqft.toLocaleString("en-US")}
              />
              <Field label="Year built" value={String(property.yearBuilt)} />
            </div>
          </div>

          <div
            className="rounded-[var(--radius-card)] border p-6 space-y-3"
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
              Linked deals
            </p>
            {linkedDeals.length === 0 ? (
              <p
                style={{
                  color: "var(--color-text-muted)",
                  fontSize: "var(--text-body)",
                }}
              >
                No deals linked to this property.
              </p>
            ) : (
              <ul className="divide-y">
                {linkedDeals.map((d) => (
                  <li key={d.id} className="py-3">
                    <Link
                      href={`/app/deals/${d.id}`}
                      className="flex items-center justify-between gap-3 hover:underline"
                      style={{
                        color: "var(--color-text)",
                        fontSize: "var(--text-body)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{d.name}</span>
                        <span
                          className="inline-flex items-center px-2.5 h-6 rounded-full"
                          style={{
                            backgroundColor: "var(--color-surface-warm)",
                            color: "var(--color-text-2)",
                            fontSize: "var(--text-meta)",
                          }}
                        >
                          {STAGE_LABEL[d.stage]}
                        </span>
                      </div>
                      <div
                        className="flex items-center gap-4 tabular"
                        style={{
                          color: "var(--color-text-2)",
                          fontSize: "var(--text-meta)",
                        }}
                      >
                        <span>
                          <span style={{ color: "var(--color-accent)" }}>
                            $
                          </span>
                          {formatCompactMoney(d.amountUsd).replace("$", "")}
                        </span>
                        <span>{formatDate(d.expectedClose)}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <PropertyMap properties={[property]} height={320} />
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
              Location
            </p>
            <Field label="Address" value={property.address} />
            <Field
              label="City"
              value={`${property.city}, ${property.state} ${property.zip}`}
            />
            <Field
              label="Coordinates"
              value={`${property.lat.toFixed(4)}, ${property.lng.toFixed(4)}`}
            />
          </div>
        </div>
      </div>
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
