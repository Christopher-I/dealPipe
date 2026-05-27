import type {
  AssetClass,
  DealStage,
} from "@/types/domain";
import type {
  DealFilter,
  PropertyFilter,
  SearchInterpretation,
} from "./types";

const STATE_NAMES: Record<string, string> = {
  alabama: "AL",
  alaska: "AK",
  arizona: "AZ",
  arkansas: "AR",
  california: "CA",
  colorado: "CO",
  connecticut: "CT",
  delaware: "DE",
  florida: "FL",
  georgia: "GA",
  hawaii: "HI",
  idaho: "ID",
  illinois: "IL",
  indiana: "IN",
  iowa: "IA",
  kansas: "KS",
  kentucky: "KY",
  louisiana: "LA",
  maine: "ME",
  maryland: "MD",
  massachusetts: "MA",
  michigan: "MI",
  minnesota: "MN",
  mississippi: "MS",
  missouri: "MO",
  montana: "MT",
  nebraska: "NE",
  nevada: "NV",
  "new hampshire": "NH",
  "new jersey": "NJ",
  "new mexico": "NM",
  "new york": "NY",
  "north carolina": "NC",
  "north dakota": "ND",
  ohio: "OH",
  oklahoma: "OK",
  oregon: "OR",
  pennsylvania: "PA",
  "rhode island": "RI",
  "south carolina": "SC",
  "south dakota": "SD",
  tennessee: "TN",
  texas: "TX",
  utah: "UT",
  vermont: "VT",
  virginia: "VA",
  washington: "WA",
  "west virginia": "WV",
  wisconsin: "WI",
  wyoming: "WY",
};

const ASSET_KEYWORDS: Record<string, AssetClass> = {
  office: "office",
  retail: "retail",
  industrial: "industrial",
  logistic: "industrial",
  warehouse: "industrial",
  multifamily: "multifamily",
  "multi-family": "multifamily",
  apartment: "multifamily",
  residential: "multifamily",
  hospitality: "hospitality",
  hotel: "hospitality",
  resort: "hospitality",
  "mixed-use": "mixed_use",
  "mixed use": "mixed_use",
};

const STAGE_KEYWORDS: Record<string, DealStage> = {
  sourcing: "sourcing",
  loi: "loi",
  diligence: "diligence",
  closing: "closing",
  "closed won": "closed_won",
  "closed-won": "closed_won",
  won: "closed_won",
  "closed lost": "closed_lost",
  "closed-lost": "closed_lost",
  lost: "closed_lost",
};

function parseMoney(s: string): number {
  // matches like "$10M", "$5,000,000", "10M", "1.5K"
  const m = s.match(/\$?([\d,]+(?:\.\d+)?)\s*([MK])?/i);
  if (!m) return NaN;
  const n = Number(m[1].replace(/,/g, ""));
  const mult = m[2]?.toUpperCase() === "M" ? 1_000_000 : m[2]?.toUpperCase() === "K" ? 1_000 : 1;
  return n * mult;
}

function parsePercent(s: string): number {
  const m = s.match(/([\d.]+)\s*%/);
  return m ? Number(m[1]) : NaN;
}

export function parseFallback(query: string): SearchInterpretation {
  const q = query.toLowerCase();

  // Decide kind: deals vs properties.
  const dealSignals =
    /\bdeal[s]?\b|\bpipeline\b|\bowner\b|\bprobability\b|\bclos(ing|ed)\b|\bloi\b|\bsourcing\b|\bdiligence\b|\bwon\b|\blost\b/.test(
      q,
    );
  const propertySignals =
    /\bbuilding[s]?\b|\bproperties\b|\bproperty\b|\basset[s]?\b|\bcap rate\b|\bsqft\b|\bsquare feet\b/.test(
      q,
    );

  const kind: "deals" | "properties" =
    dealSignals && !propertySignals ? "deals" : "properties";

  // Asset class.
  let assetClass: AssetClass | undefined;
  for (const [kw, ac] of Object.entries(ASSET_KEYWORDS)) {
    if (q.includes(kw)) {
      assetClass = ac;
      break;
    }
  }

  // Stage.
  let stage: DealStage | undefined;
  for (const [kw, st] of Object.entries(STAGE_KEYWORDS)) {
    if (q.includes(kw)) {
      stage = st;
      break;
    }
  }

  // State.
  let state: string | undefined;
  for (const [name, abbrev] of Object.entries(STATE_NAMES)) {
    if (q.includes(name)) {
      state = abbrev;
      break;
    }
  }
  if (!state) {
    const stateAbbrev = q.match(/\b([A-Z]{2})\b/);
    if (stateAbbrev) state = stateAbbrev[1];
  }

  // Cap rate.
  let minCapRate: number | undefined;
  let maxCapRate: number | undefined;
  const capAbove = q.match(/cap rate (?:above|over|>)\s*([\d.]+\s*%)/i);
  const capBelow = q.match(/cap rate (?:below|under|<)\s*([\d.]+\s*%)/i);
  if (capAbove) minCapRate = parsePercent(capAbove[1]);
  if (capBelow) maxCapRate = parsePercent(capBelow[1]);
  if (!minCapRate && !maxCapRate) {
    const cap = q.match(/above\s*([\d.]+)\s*%/i);
    if (cap && (q.includes("cap") || q.includes("%"))) {
      minCapRate = Number(cap[1]);
    }
  }

  // Price.
  let minPrice: number | undefined;
  let maxPrice: number | undefined;
  const between = q.match(/between\s*\$?([\d.,]+\s*[MK]?)\s*(?:and|to|-)\s*\$?([\d.,]+\s*[MK]?)/i);
  if (between) {
    minPrice = parseMoney(between[1]);
    maxPrice = parseMoney(between[2]);
  }
  const under = q.match(/(?:under|below|less than|<)\s*\$?([\d.,]+\s*[MK]?)/i);
  if (under) maxPrice = parseMoney(under[1]);
  const over = q.match(/(?:over|above|more than|>)\s*\$?([\d.,]+\s*[MK]?)/i);
  if (over && !capAbove) minPrice = parseMoney(over[1]);

  // Recency for deals ("recently closed").
  let closedWithinDays: number | undefined;
  if (kind === "deals" && /recently/.test(q) && (stage === "closed_won" || stage === "closed_lost" || /closed/.test(q))) {
    closedWithinDays = 90;
  }

  if (kind === "properties") {
    const filter: PropertyFilter = {
      asset_class: assetClass,
      state,
      min_cap_rate: minCapRate,
      max_cap_rate: maxCapRate,
      min_price_usd: minPrice,
      max_price_usd: maxPrice,
      limit: 50,
    };
    return {
      kind,
      filter,
      explanation: "Parsed by the built-in keyword parser (no API key set).",
    };
  }

  const filter: DealFilter = {
    stage,
    min_amount_usd: minPrice,
    max_amount_usd: maxPrice,
    closed_within_days: closedWithinDays,
    limit: 50,
  };
  return {
    kind,
    filter,
    explanation: "Parsed by the built-in keyword parser (no API key set).",
  };
}
