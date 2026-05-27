import type { Deal, DealStage } from "@/types/domain";
import {
  daysAgo,
  daysFromNow,
  floatBetween,
  intBetween,
  mulberry32,
  pick,
  weightedPick,
} from "./_lib";
import { ORGS } from "./orgs";
import { listPropertiesForOrg } from "./properties";
import { listUsersForOrg } from "./users";

const STAGE_WEIGHTS: { value: DealStage; weight: number }[] = [
  { value: "sourcing", weight: 0.3 },
  { value: "loi", weight: 0.2 },
  { value: "diligence", weight: 0.15 },
  { value: "closing", weight: 0.1 },
  { value: "closed_won", weight: 0.15 },
  { value: "closed_lost", weight: 0.1 },
];

const STAGE_PROBABILITY: Record<DealStage, [number, number]> = {
  sourcing: [10, 25],
  loi: [30, 50],
  diligence: [55, 75],
  closing: [80, 95],
  closed_won: [100, 100],
  closed_lost: [0, 0],
};

const NOTE_OPTIONS = [
  "Sourced via repeat broker relationship; sellers signaling end-of-quarter close.",
  "First call held with seller's counsel; awaiting OM and rent roll.",
  "T-12 received, normalizing for one-time items; cap rate looks defensible.",
  "Site visit scheduled; targeting walkthrough next week.",
  "Inspection findings minor; HVAC reserve increased $0.45/sf.",
  "Lender LOI received at SOFR + 250bps, 65% LTC.",
  "PSA in second markup; key reps & warranties resolved.",
  "Capital partner committed; closing checklist 80% complete.",
];

function generateDealsFor(orgId: string): Deal[] {
  const orgIndex = ORGS.findIndex((o) => o.id === orgId);
  const rng = mulberry32(5000 + orgIndex);
  const props = listPropertiesForOrg(orgId);
  const users = listUsersForOrg(orgId);
  const brokers = users.filter((u) => u.role !== "admin");
  const count = 20;
  const out: Deal[] = [];

  const adjectives = [
    "Project",
    "Initiative",
    "Acquisition",
    "Portfolio",
    "Recap",
    "Disposition",
    "Take-out",
  ];
  const codenames = [
    "Aurora",
    "Tundra",
    "Maverick",
    "Compass",
    "Lighthouse",
    "Pioneer",
    "Crescent",
    "Beacon",
    "Sundial",
    "Northstar",
    "Trident",
    "Anchor",
    "Cardinal",
    "Mercury",
    "Orion",
    "Vesper",
    "Cobalt",
    "Granite",
    "Echo",
    "Helix",
  ];

  for (let i = 0; i < count; i++) {
    const property = pick(rng, props);
    const stage = weightedPick(rng, STAGE_WEIGHTS);
    const [probLo, probHi] = STAGE_PROBABILITY[stage];
    const probability = intBetween(rng, probLo, probHi);
    const owner = pick(rng, brokers.length ? brokers : users);

    const amountVariance = floatBetween(rng, 0.92, 1.06, 3);
    const amountUsd = Math.round(property.priceUsd * amountVariance);

    const createdDaysAgo = intBetween(rng, 14, 220);
    const updatedDaysAgo = Math.max(0, createdDaysAgo - intBetween(rng, 1, 80));
    const expectedDays =
      stage === "closed_won" || stage === "closed_lost"
        ? -intBetween(rng, 1, 60)
        : intBetween(rng, 14, 180);

    const adj = pick(rng, adjectives);
    const code = pick(rng, codenames);

    out.push({
      id: `deal_${orgId.replace("org_", "")}_${i.toString().padStart(3, "0")}`,
      orgId,
      propertyId: property.id,
      name: `${adj} ${code}`,
      stage,
      amountUsd,
      probability,
      ownerId: owner.id,
      expectedClose: daysFromNow(expectedDays),
      notes: pick(rng, NOTE_OPTIONS),
      createdAt: daysAgo(createdDaysAgo),
      updatedAt: daysAgo(updatedDaysAgo),
    });
  }
  return out;
}

export const DEALS: Deal[] = ORGS.flatMap((o) => generateDealsFor(o.id));

export function listDealsForOrg(orgId: string): Deal[] {
  return DEALS.filter((d) => d.orgId === orgId);
}

export function getDealById(id: string): Deal | null {
  return DEALS.find((d) => d.id === id) ?? null;
}
