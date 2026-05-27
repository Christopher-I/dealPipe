import type { Deal, Property } from "@/types/domain";
import type { DealFilter, PropertyFilter } from "./types";

export function filterProperties(
  properties: Property[],
  f: PropertyFilter,
): Property[] {
  let out = properties;
  if (f.asset_class) out = out.filter((p) => p.assetClass === f.asset_class);
  if (f.state) {
    const s = f.state.toUpperCase();
    out = out.filter((p) => p.state === s);
  }
  if (f.city) {
    const c = f.city.toLowerCase();
    out = out.filter((p) => p.city.toLowerCase().includes(c));
  }
  if (typeof f.min_cap_rate === "number")
    out = out.filter((p) => p.capRate >= f.min_cap_rate!);
  if (typeof f.max_cap_rate === "number")
    out = out.filter((p) => p.capRate <= f.max_cap_rate!);
  if (typeof f.min_price_usd === "number")
    out = out.filter((p) => p.priceUsd >= f.min_price_usd!);
  if (typeof f.max_price_usd === "number")
    out = out.filter((p) => p.priceUsd <= f.max_price_usd!);
  if (f.keyword) {
    const k = f.keyword.toLowerCase();
    out = out.filter((p) =>
      `${p.name} ${p.description} ${p.city}`.toLowerCase().includes(k),
    );
  }
  return out.slice(0, f.limit ?? 50);
}

export function filterDeals(
  deals: Deal[],
  f: DealFilter,
  members: Map<string, { name: string }>,
): Deal[] {
  let out = deals;
  if (f.stage) out = out.filter((d) => d.stage === f.stage);
  if (typeof f.min_amount_usd === "number")
    out = out.filter((d) => d.amountUsd >= f.min_amount_usd!);
  if (typeof f.max_amount_usd === "number")
    out = out.filter((d) => d.amountUsd <= f.max_amount_usd!);
  if (typeof f.min_probability === "number")
    out = out.filter((d) => d.probability >= f.min_probability!);
  if (typeof f.max_probability === "number")
    out = out.filter((d) => d.probability <= f.max_probability!);
  if (f.owner_name) {
    const n = f.owner_name.toLowerCase();
    out = out.filter((d) =>
      members.get(d.ownerId)?.name.toLowerCase().includes(n) ?? false,
    );
  }
  if (typeof f.closing_within_days === "number") {
    const horizon =
      Date.now() + f.closing_within_days * 24 * 60 * 60 * 1000;
    out = out.filter(
      (d) =>
        d.stage !== "closed_won" &&
        d.stage !== "closed_lost" &&
        new Date(d.expectedClose).getTime() <= horizon &&
        new Date(d.expectedClose).getTime() >= Date.now(),
    );
  }
  if (typeof f.closed_within_days === "number") {
    const horizon =
      Date.now() - f.closed_within_days * 24 * 60 * 60 * 1000;
    out = out.filter(
      (d) =>
        (d.stage === "closed_won" || d.stage === "closed_lost") &&
        new Date(d.updatedAt).getTime() >= horizon,
    );
  }
  if (f.keyword) {
    const k = f.keyword.toLowerCase();
    out = out.filter((d) =>
      `${d.name} ${d.notes}`.toLowerCase().includes(k),
    );
  }
  return out.slice(0, f.limit ?? 50);
}
