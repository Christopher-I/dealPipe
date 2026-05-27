import type { Activity, ActivityType } from "@/types/domain";
import {
  daysAgo,
  intBetween,
  mulberry32,
  pick,
} from "./_lib";
import { DEALS } from "./deals";
import { listUsersForOrg } from "./users";

const NOTE_BODIES = [
  "Confirmed parking ratio matches submarket comps.",
  "Seller open to seller-financing portion at 5.75%.",
  "Term sheet in final review with counsel.",
  "Adjusted underwriting for property-tax reassessment risk.",
  "Inspector flagged roof condition; budget revised.",
  "Capital partner approved acquisition committee memo.",
  "Local broker provided three additional comps; cap rate model tightened.",
  "PSA executed; opened escrow at First American.",
  "Encountered title issue; resolved with subordination agreement.",
  "Lender re-priced 25bps higher; still within underwriting threshold.",
  "Marketing materials shared with three potential equity LPs.",
  "Walked the asset with property manager; deferred maintenance modest.",
  "Updated NOI to include $0.20/sf additional reserves.",
  "Buyer's broker confirmed close date held; documents in dataroom.",
];

const STAGE_CHANGE_BODIES: Partial<Record<string, string>> = {
  sourcing_to_loi: "Moved to LOI after initial pricing alignment.",
  loi_to_diligence: "LOI executed; due diligence period begins.",
  diligence_to_closing: "Diligence cleared; PSA signed.",
  closing_to_closed_won: "Closed and funded.",
  any_to_closed_lost: "Deal terminated.",
};

function pickActivityType(
  rng: () => number,
  dealStage: string,
  index: number,
  total: number,
): ActivityType {
  if (index === 0) return "deal_created";
  if (index === total - 1 && dealStage === "closed_won") return "deal_won";
  if (index === total - 1 && dealStage === "closed_lost") return "deal_lost";
  return pick(rng, ["note", "stage_change", "note", "note"] as const);
}

function bodyFor(rng: () => number, type: ActivityType, dealName: string): string {
  switch (type) {
    case "deal_created":
      return `${dealName} created.`;
    case "deal_won":
      return `${dealName} closed and funded.`;
    case "deal_lost":
      return `${dealName} terminated.`;
    case "stage_change":
      return pick(rng, Object.values(STAGE_CHANGE_BODIES) as string[]);
    case "note":
    default:
      return pick(rng, NOTE_BODIES);
    case "document_upload":
      return "Uploaded document to dataroom.";
  }
}

function generateActivitiesForDeal(
  dealId: string,
  orgId: string,
  dealName: string,
  dealStage: string,
  rngSeed: number,
): Activity[] {
  const rng = mulberry32(rngSeed);
  const users = listUsersForOrg(orgId).filter((u) => u.role !== "admin");
  if (!users.length) return [];

  const total = intBetween(rng, 4, 7);
  const out: Activity[] = [];

  for (let i = 0; i < total; i++) {
    const type = pickActivityType(rng, dealStage, i, total);
    const user = pick(rng, users);
    out.push({
      id: `act_${dealId}_${i}`,
      orgId,
      dealId,
      userId: user.id,
      type,
      body: bodyFor(rng, type, dealName),
      createdAt: daysAgo(Math.max(1, 200 - i * 25 - intBetween(rng, 0, 8))),
    });
  }
  return out;
}

export const ACTIVITIES: Activity[] = DEALS.flatMap((d, i) =>
  generateActivitiesForDeal(d.id, d.orgId, d.name, d.stage, 9000 + i),
);

export function listActivitiesForOrg(orgId: string, limit?: number): Activity[] {
  const filtered = ACTIVITIES.filter((a) => a.orgId === orgId).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  return typeof limit === "number" ? filtered.slice(0, limit) : filtered;
}

export function listActivitiesForDeal(dealId: string): Activity[] {
  return ACTIVITIES.filter((a) => a.dealId === dealId).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}
