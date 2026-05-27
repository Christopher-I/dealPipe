import type {
  AssetClass,
  Deal,
  DealStage,
  Property,
} from "@/types/domain";

export type PropertyFilter = {
  asset_class?: AssetClass;
  state?: string; // 2-letter US state
  city?: string;
  min_cap_rate?: number;
  max_cap_rate?: number;
  min_price_usd?: number;
  max_price_usd?: number;
  keyword?: string;
  limit?: number;
};

export type DealFilter = {
  stage?: DealStage;
  min_amount_usd?: number;
  max_amount_usd?: number;
  min_probability?: number;
  max_probability?: number;
  owner_name?: string;
  closing_within_days?: number;
  closed_within_days?: number;
  keyword?: string;
  limit?: number;
};

export type SearchInterpretation =
  | { kind: "properties"; filter: PropertyFilter; explanation?: string }
  | { kind: "deals"; filter: DealFilter; explanation?: string };

export type SearchResponse =
  | {
      ok: true;
      type: "properties";
      summary: string;
      results: Property[];
      interpretation: SearchInterpretation;
      backend: "claude" | "fallback";
    }
  | {
      ok: true;
      type: "deals";
      summary: string;
      results: Deal[];
      interpretation: SearchInterpretation;
      backend: "claude" | "fallback";
    }
  | { ok: false; error: string };
