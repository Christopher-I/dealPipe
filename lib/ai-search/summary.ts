import type { Deal, Property } from "@/types/domain";
import { ASSET_CLASS_LABEL, STAGE_LABEL, formatCompactMoney } from "@/lib/format";
import type { DealFilter, PropertyFilter } from "./types";

function describePropertyFilter(f: PropertyFilter): string {
  const parts: string[] = [];
  if (f.asset_class)
    parts.push(ASSET_CLASS_LABEL[f.asset_class].toLowerCase());
  parts.push("properties");
  if (f.state) parts.push(`in ${f.state}`);
  else if (f.city) parts.push(`in ${f.city}`);
  if (typeof f.min_cap_rate === "number")
    parts.push(`with cap rate ≥ ${f.min_cap_rate}%`);
  if (typeof f.max_cap_rate === "number")
    parts.push(`with cap rate ≤ ${f.max_cap_rate}%`);
  if (typeof f.min_price_usd === "number" && typeof f.max_price_usd === "number")
    parts.push(
      `priced ${formatCompactMoney(f.min_price_usd)}–${formatCompactMoney(f.max_price_usd)}`,
    );
  else if (typeof f.min_price_usd === "number")
    parts.push(`above ${formatCompactMoney(f.min_price_usd)}`);
  else if (typeof f.max_price_usd === "number")
    parts.push(`under ${formatCompactMoney(f.max_price_usd)}`);
  return parts.join(" ");
}

function describeDealFilter(f: DealFilter): string {
  const parts: string[] = [];
  parts.push("deals");
  if (f.stage) parts.push(`in ${STAGE_LABEL[f.stage]}`);
  if (typeof f.min_amount_usd === "number" && typeof f.max_amount_usd === "number")
    parts.push(
      `${formatCompactMoney(f.min_amount_usd)}–${formatCompactMoney(f.max_amount_usd)}`,
    );
  else if (typeof f.min_amount_usd === "number")
    parts.push(`above ${formatCompactMoney(f.min_amount_usd)}`);
  else if (typeof f.max_amount_usd === "number")
    parts.push(`under ${formatCompactMoney(f.max_amount_usd)}`);
  if (typeof f.closing_within_days === "number")
    parts.push(`closing within ${f.closing_within_days} days`);
  if (typeof f.closed_within_days === "number")
    parts.push(`closed in the last ${f.closed_within_days} days`);
  if (f.owner_name) parts.push(`owned by ${f.owner_name}`);
  return parts.join(" ");
}

export function summarisePropertyResults(
  filter: PropertyFilter,
  results: Property[],
): string {
  const desc = describePropertyFilter(filter);
  if (results.length === 0) return `No ${desc} in your portfolio.`;
  if (results.length === 1) return `Found 1 match: ${desc}.`;
  return `Found ${results.length} ${desc}.`;
}

export function summariseDealResults(
  filter: DealFilter,
  results: Deal[],
): string {
  const desc = describeDealFilter(filter);
  if (results.length === 0) return `No ${desc} found.`;
  const total = results.reduce((acc, d) => acc + d.amountUsd, 0);
  if (results.length === 1)
    return `Found 1 match: ${desc} (${formatCompactMoney(total)} total).`;
  return `Found ${results.length} ${desc} totaling ${formatCompactMoney(total)}.`;
}
