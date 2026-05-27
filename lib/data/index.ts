/**
 * V0 mock data layer.
 *
 * Components must import from here only — never from lib/data/seed/* directly.
 * That seam is what keeps the future Supabase swap drop-in.
 */

import type {
  Activity,
  Deal,
  DocumentRef,
  Organization,
  Property,
  User,
} from "@/types/domain";
import {
  getDealById,
  getOrg,
  getPropertyById,
  getUser,
  listActivitiesForDeal,
  listActivitiesForOrg,
  listDealsForOrg,
  listDocumentsForDeal,
  listPropertiesForOrg,
  listUsersForOrg,
} from "./seed";

/* ─── Orgs ────────────────────────────────────────────────── */

export async function getOrganization(args: {
  orgId: string;
}): Promise<Organization | null> {
  return getOrg(args.orgId);
}

/* ─── Properties ──────────────────────────────────────────── */

export type ListPropertiesArgs = {
  orgId: string;
  limit?: number;
};

export async function listProperties(
  args: ListPropertiesArgs,
): Promise<Property[]> {
  const all = listPropertiesForOrg(args.orgId).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  return typeof args.limit === "number" ? all.slice(0, args.limit) : all;
}

export async function getProperty(args: {
  id: string;
}): Promise<Property | null> {
  return getPropertyById(args.id);
}

/* ─── Deals ───────────────────────────────────────────────── */

export type ListDealsArgs = {
  orgId: string;
  stage?: Deal["stage"];
  limit?: number;
};

export async function listDeals(args: ListDealsArgs): Promise<Deal[]> {
  let all = listDealsForOrg(args.orgId).sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
  if (args.stage) {
    all = all.filter((d) => d.stage === args.stage);
  }
  return typeof args.limit === "number" ? all.slice(0, args.limit) : all;
}

export async function getDeal(args: { id: string }): Promise<Deal | null> {
  return getDealById(args.id);
}

/* ─── Activities ──────────────────────────────────────────── */

export async function listActivities(args: {
  orgId: string;
  dealId?: string;
  limit?: number;
}): Promise<Activity[]> {
  if (args.dealId) return listActivitiesForDeal(args.dealId);
  return listActivitiesForOrg(args.orgId, args.limit);
}

/* ─── Documents ───────────────────────────────────────────── */

export async function listDocuments(args: {
  dealId: string;
}): Promise<DocumentRef[]> {
  return listDocumentsForDeal(args.dealId);
}

/* ─── Users / members ─────────────────────────────────────── */

export async function listOrgMembers(args: {
  orgId: string;
}): Promise<User[]> {
  return listUsersForOrg(args.orgId);
}

export async function getMember(args: { id: string }): Promise<User | null> {
  return getUser(args.id);
}

/* ─── Aggregates ──────────────────────────────────────────── */

export type DealsSummary = {
  totalCount: number;
  pipelineValueUsd: number;
  byStage: Record<Deal["stage"], { count: number; valueUsd: number }>;
};

export async function getDealsSummary(args: {
  orgId: string;
}): Promise<DealsSummary> {
  const deals = listDealsForOrg(args.orgId);
  const byStage: DealsSummary["byStage"] = {
    sourcing: { count: 0, valueUsd: 0 },
    loi: { count: 0, valueUsd: 0 },
    diligence: { count: 0, valueUsd: 0 },
    closing: { count: 0, valueUsd: 0 },
    closed_won: { count: 0, valueUsd: 0 },
    closed_lost: { count: 0, valueUsd: 0 },
  };
  let pipelineValueUsd = 0;
  for (const d of deals) {
    byStage[d.stage].count += 1;
    byStage[d.stage].valueUsd += d.amountUsd;
    if (d.stage !== "closed_lost") pipelineValueUsd += d.amountUsd;
  }
  return {
    totalCount: deals.length,
    pipelineValueUsd,
    byStage,
  };
}
