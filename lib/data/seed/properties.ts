import type { AssetClass, Property } from "@/types/domain";
import {
  daysAgo,
  floatBetween,
  intBetween,
  mulberry32,
  pick,
  weightedPick,
} from "./_lib";
import { ORGS } from "./orgs";

type Metro = {
  city: string;
  state: string;
  zipBase: number;
  lat: number;
  lng: number;
};

const METROS: Metro[] = [
  { city: "New York", state: "NY", zipBase: 10001, lat: 40.7128, lng: -74.006 },
  { city: "Los Angeles", state: "CA", zipBase: 90001, lat: 34.0522, lng: -118.2437 },
  { city: "Chicago", state: "IL", zipBase: 60601, lat: 41.8781, lng: -87.6298 },
  { city: "Dallas", state: "TX", zipBase: 75201, lat: 32.7767, lng: -96.797 },
  { city: "Atlanta", state: "GA", zipBase: 30303, lat: 33.749, lng: -84.388 },
  { city: "Miami", state: "FL", zipBase: 33101, lat: 25.7617, lng: -80.1918 },
];

const STREET_NAMES = [
  "Lexington",
  "Madison",
  "Park",
  "Broadway",
  "Elm",
  "Cedar",
  "Wabash",
  "Sunset",
  "Peachtree",
  "Biscayne",
  "Magnolia",
  "Commerce",
  "Wilshire",
  "Vine",
  "Stuart",
  "Granville",
  "Harbor",
  "Pine",
  "Beech",
  "Oak",
];

const STREET_TYPES = ["Ave", "St", "Blvd", "Way", "Pl", "Dr"];

const PROPERTY_PREFIXES = [
  "Atrium",
  "Skyline",
  "Riverside",
  "Pinnacle",
  "Beacon",
  "Cornerstone",
  "Harbor",
  "Cedar",
  "Birch",
  "Summit",
  "Vista",
  "Crown",
  "Imperial",
  "Liberty",
  "Heritage",
  "Pacific",
  "Capital",
  "Metro",
  "Crescent",
  "Hudson",
  "Phoenix",
  "Atlantic",
  "Maple",
  "Olive",
  "Magnolia",
  "Aspen",
];

const PROPERTY_SUFFIXES = [
  "Tower",
  "Plaza",
  "Center",
  "Place",
  "Lofts",
  "Square",
  "Heights",
  "Court",
  "Park",
  "Crossing",
  "Commons",
  "Pavilion",
  "Reserve",
  "Junction",
  "Quarter",
  "Exchange",
  "Yards",
];

const ASSET_CLASS_WEIGHTS: { value: AssetClass; weight: number }[] = [
  { value: "office", weight: 0.28 },
  { value: "multifamily", weight: 0.22 },
  { value: "retail", weight: 0.18 },
  { value: "industrial", weight: 0.16 },
  { value: "mixed_use", weight: 0.1 },
  { value: "hospitality", weight: 0.06 },
];

const ASSET_RANGES: Record<
  AssetClass,
  { price: [number, number]; capRate: [number, number]; sqft: [number, number] }
> = {
  office: { price: [8_000_000, 60_000_000], capRate: [5.5, 8.5], sqft: [40_000, 250_000] },
  retail: { price: [3_000_000, 25_000_000], capRate: [5.5, 8.0], sqft: [12_000, 80_000] },
  industrial: { price: [5_000_000, 40_000_000], capRate: [5.0, 7.5], sqft: [60_000, 300_000] },
  multifamily: { price: [10_000_000, 80_000_000], capRate: [4.5, 6.5], sqft: [70_000, 240_000] },
  hospitality: { price: [15_000_000, 80_000_000], capRate: [7.0, 10.0], sqft: [50_000, 180_000] },
  mixed_use: { price: [8_000_000, 45_000_000], capRate: [5.5, 7.5], sqft: [40_000, 160_000] },
};

const UNSPLASH_PHOTOS: Record<AssetClass, string[]> = {
  office: [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900",
    "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=900",
  ],
  retail: [
    "https://images.unsplash.com/photo-1555529771-7888783a18d3?w=900",
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900",
  ],
  industrial: [
    "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=900",
    "https://images.unsplash.com/photo-1565891741441-64926e441838?w=900",
  ],
  multifamily: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900",
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=900",
    "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=900",
  ],
  hospitality: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900",
  ],
  mixed_use: [
    "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900",
    "https://images.unsplash.com/photo-1448630360428-65456885c650?w=900",
  ],
};

const DESCRIPTIONS: Partial<Record<AssetClass, string[]>> = {
  office: [
    "Class A office tower in a CBD submarket with strong tenant retention and stable occupancy.",
    "Recently renovated office property near major transit, attractive to creative tenants.",
    "Trophy office asset with long-term anchor tenant and below-market in-place rents.",
  ],
  retail: [
    "Grocery-anchored neighborhood center with a complementary mix of national and local tenants.",
    "Single-tenant net-lease property with credit tenant and 12+ years of term remaining.",
    "Urban-infill retail with high foot traffic and irreplaceable corner location.",
  ],
  industrial: [
    "Modern Class A logistics facility with 32' clear heights and ESFR sprinkler system.",
    "Last-mile distribution center within 30 minutes of major population center.",
    "Multi-tenant flex/industrial park with diversified rent roll.",
  ],
  multifamily: [
    "Garden-style multifamily community with significant value-add interior renovation upside.",
    "High-rise residential tower with amenity package competitive with newer construction.",
    "Suburban multifamily portfolio with proven NOI growth and below-market rents.",
  ],
  hospitality: [
    "Upscale select-service hotel in a high-barrier-to-entry leisure market.",
    "Full-service convention hotel with established F&B operations and group business.",
  ],
  mixed_use: [
    "Mixed-use asset combining ground-floor retail with residential rentals above.",
    "Live-work-play development anchored by experiential retail and creative office.",
  ],
};

function generatePropertiesFor(orgId: string): Property[] {
  const orgIndex = ORGS.findIndex((o) => o.id === orgId);
  const rng = mulberry32(1000 + orgIndex);
  const count = 50;
  const out: Property[] = [];

  for (let i = 0; i < count; i++) {
    const metro = pick(rng, METROS);
    const assetClass = weightedPick(rng, ASSET_CLASS_WEIGHTS);
    const ranges = ASSET_RANGES[assetClass];

    const prefix = pick(rng, PROPERTY_PREFIXES);
    const suffix = pick(rng, PROPERTY_SUFFIXES);
    const name = `${prefix} ${suffix}`;

    const streetNum = intBetween(rng, 100, 9999);
    const street = pick(rng, STREET_NAMES);
    const streetType = pick(rng, STREET_TYPES);
    const address = `${streetNum} ${street} ${streetType}`;

    const lat = floatBetween(rng, metro.lat - 0.08, metro.lat + 0.08, 4);
    const lng = floatBetween(rng, metro.lng - 0.08, metro.lng + 0.08, 4);

    const price = intBetween(rng, ranges.price[0], ranges.price[1]);
    const capRate = floatBetween(rng, ranges.capRate[0], ranges.capRate[1], 2);
    const sqft = intBetween(rng, ranges.sqft[0], ranges.sqft[1]);
    const yearBuilt = intBetween(rng, 1968, 2022);
    const photoPool = UNSPLASH_PHOTOS[assetClass] ?? UNSPLASH_PHOTOS.office;
    const photoUrl = pick(rng, photoPool);

    const descPool = DESCRIPTIONS[assetClass] ?? DESCRIPTIONS.office!;
    const description = pick(rng, descPool);

    out.push({
      id: `prop_${orgId.replace("org_", "")}_${i.toString().padStart(3, "0")}`,
      orgId,
      name,
      address,
      city: metro.city,
      state: metro.state,
      zip: String(metro.zipBase + intBetween(rng, 0, 200)),
      lat,
      lng,
      assetClass,
      priceUsd: price,
      capRate,
      sqft,
      yearBuilt,
      photoUrl,
      description,
      createdAt: daysAgo(intBetween(rng, 30, 540)),
    });
  }
  return out;
}

export const PROPERTIES: Property[] = ORGS.flatMap((o) =>
  generatePropertiesFor(o.id),
);

export function listPropertiesForOrg(orgId: string): Property[] {
  return PROPERTIES.filter((p) => p.orgId === orgId);
}

export function getPropertyById(id: string): Property | null {
  return PROPERTIES.find((p) => p.id === id) ?? null;
}
