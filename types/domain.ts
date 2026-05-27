export type Role = "admin" | "principal" | "broker";

export type Organization = {
  id: string;
  name: string;
  slug: string;
  brandColor: string;
  logoPath?: string;
};

export type User = {
  id: string;
  orgId: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  title?: string;
};

export type AssetClass =
  | "office"
  | "retail"
  | "industrial"
  | "multifamily"
  | "hospitality"
  | "mixed_use";

export type Property = {
  id: string;
  orgId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  assetClass: AssetClass;
  priceUsd: number;
  capRate: number;
  sqft: number;
  yearBuilt: number;
  photoUrl?: string;
  description: string;
  createdAt: string;
};

export type DealStage =
  | "sourcing"
  | "loi"
  | "diligence"
  | "closing"
  | "closed_won"
  | "closed_lost";

export type Deal = {
  id: string;
  orgId: string;
  propertyId: string;
  name: string;
  stage: DealStage;
  amountUsd: number;
  probability: number;
  ownerId: string;
  expectedClose: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type ActivityType =
  | "note"
  | "stage_change"
  | "document_upload"
  | "deal_created"
  | "deal_won"
  | "deal_lost";

export type Activity = {
  id: string;
  orgId: string;
  dealId?: string;
  propertyId?: string;
  userId: string;
  type: ActivityType;
  body: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

export type DocumentRef = {
  id: string;
  orgId: string;
  dealId: string;
  storagePath: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  uploadedBy: string;
  createdAt: string;
};
