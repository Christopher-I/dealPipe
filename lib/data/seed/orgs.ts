import type { Organization } from "@/types/domain";

export const ORGS: Organization[] = [
  {
    id: "org_hudson",
    name: "Hudson Bay Partners",
    slug: "hudson-bay",
    brandColor: "#2F6B4A",
  },
  {
    id: "org_phoenix",
    name: "Phoenix CRE",
    slug: "phoenix-cre",
    brandColor: "#C94427",
  },
  {
    id: "org_atlantic",
    name: "Atlantic Realty Group",
    slug: "atlantic-realty",
    brandColor: "#1F3D6B",
  },
];

export function getOrg(orgId: string): Organization | null {
  return ORGS.find((o) => o.id === orgId) ?? null;
}
