"use client";

import { useEffect, useState } from "react";
import { usePersona } from "@/components/shared/PersonaProvider";
import { getOrganization, listOrgMembers, listProperties, listDeals } from "@/lib/data";
import { formatCompactMoney } from "@/lib/format";
import type { Organization } from "@/types/domain";

export default function OrganizationSettingsPage() {
  const { persona } = usePersona();
  const [org, setOrg] = useState<Organization | null>(null);
  const [stats, setStats] = useState<{ members: number; properties: number; deals: number } | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([
      getOrganization({ orgId: persona.orgId }),
      listOrgMembers({ orgId: persona.orgId }),
      listProperties({ orgId: persona.orgId }),
      listDeals({ orgId: persona.orgId }),
    ]).then(([o, m, p, d]) => {
      if (!alive) return;
      setOrg(o);
      setStats({
        members: m.length,
        properties: p.length,
        deals: d.length,
      });
    });
    return () => {
      alive = false;
    };
  }, [persona.orgId]);

  if (!org) {
    return <p style={{ color: "var(--color-text-muted)" }}>Loading…</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-5">
        <Section title="Organization profile">
          <Field label="Name" value={org.name} />
          <Field label="Slug" value={org.slug} />
          <Field
            label="Brand color"
            value={
              <span className="inline-flex items-center gap-2">
                <span
                  className="w-5 h-5 rounded-full inline-block"
                  style={{ backgroundColor: org.brandColor }}
                />
                <span className="tabular">{org.brandColor}</span>
              </span>
            }
          />
        </Section>

        <Section title="Integrations">
          <Field label="Slack" value={<Mute>Not connected</Mute>} />
          <Field label="DocuSign" value={<Mute>Not connected</Mute>} />
          <Field label="Email digest" value={<Mute>Daily, opt-out</Mute>} />
        </Section>
      </div>

      <div className="space-y-5">
        <Section title="At a glance">
          {stats ? (
            <>
              <Field label="Members" value={String(stats.members)} />
              <Field label="Properties" value={String(stats.properties)} />
              <Field label="Open deals" value={String(stats.deals)} />
            </>
          ) : (
            <Mute>—</Mute>
          )}
        </Section>
        <Section title="Plan">
          <Field label="Tier" value={<TierChip />} />
          <Field label="Seats" value={`${stats?.members ?? 0} of 50`} />
          <Field label="Billing cycle" value="Monthly" />
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
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
        {title}
      </p>
      <div className="space-y-3">{children}</div>
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

function Mute({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ color: "var(--color-text-muted)" }}>{children}</span>
  );
}

function TierChip() {
  return (
    <span
      className="inline-flex items-center px-3 h-7 rounded-full"
      style={{
        backgroundColor: "var(--color-surface-peach)",
        color: "var(--color-accent)",
        fontSize: "var(--text-chip)",
      }}
    >
      Professional
    </span>
  );
}
