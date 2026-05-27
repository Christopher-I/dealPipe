/**
 * V0 mock data layer.
 *
 * Phase 1: type-only stubs. All read functions return empty results.
 * Phase 2: seed lands under lib/data/seed/* and these stubs return real data.
 *
 * Components must import from here only — never from lib/data/seed/* directly.
 * That seam is what keeps the future Supabase swap drop-in.
 */

import type { Activity, Deal, DocumentRef, Property, User } from "@/types/domain";

/* ─── Properties ──────────────────────────────────────────── */

export type ListPropertiesArgs = {
  orgId: string;
  limit?: number;
};

export async function listProperties(_args: ListPropertiesArgs): Promise<Property[]> {
  return [];
}

export async function getProperty(_args: { id: string }): Promise<Property | null> {
  return null;
}

/* ─── Deals ───────────────────────────────────────────────── */

export type ListDealsArgs = {
  orgId: string;
  stage?: Deal["stage"];
  limit?: number;
};

export async function listDeals(_args: ListDealsArgs): Promise<Deal[]> {
  return [];
}

export async function getDeal(_args: { id: string }): Promise<Deal | null> {
  return null;
}

/* ─── Activities ──────────────────────────────────────────── */

export async function listActivities(_args: {
  orgId: string;
  dealId?: string;
  limit?: number;
}): Promise<Activity[]> {
  return [];
}

/* ─── Documents ───────────────────────────────────────────── */

export async function listDocuments(_args: {
  dealId: string;
}): Promise<DocumentRef[]> {
  return [];
}

/* ─── Users / members ─────────────────────────────────────── */

export async function listOrgMembers(_args: { orgId: string }): Promise<User[]> {
  return [];
}
