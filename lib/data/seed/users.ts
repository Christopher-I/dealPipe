import type { Role, User } from "@/types/domain";

type Seed = {
  name: string;
  title: string;
  role: Role;
};

const HUDSON: Seed[] = [
  { name: "Dwayne Tatum", title: "CEO Assistant", role: "admin" },
  { name: "Eleanor Briggs", title: "Managing Principal", role: "principal" },
  { name: "Marcus Lin", title: "Senior Broker", role: "broker" },
  { name: "Priya Anand", title: "Acquisitions Broker", role: "broker" },
  { name: "Theo Whitfield", title: "Capital Markets", role: "broker" },
  { name: "Sasha Volkov", title: "Operations Lead", role: "admin" },
];

const PHOENIX: Seed[] = [
  { name: "Maya Chen", title: "Acquisitions Principal", role: "principal" },
  { name: "Roman Castillo", title: "Managing Director", role: "admin" },
  { name: "Linnea Holm", title: "Broker", role: "broker" },
  { name: "Jaden Foster", title: "Broker", role: "broker" },
  { name: "Aiyana Patel", title: "Associate Broker", role: "broker" },
];

const ATLANTIC: Seed[] = [
  { name: "James Park", title: "Senior Broker", role: "broker" },
  { name: "Adelaide Cross", title: "Partner", role: "principal" },
  { name: "Hugo Bautista", title: "Partner", role: "principal" },
  { name: "Camille Doyle", title: "Operations", role: "admin" },
  { name: "Wren Okafor", title: "Junior Broker", role: "broker" },
  { name: "Tobias Ren", title: "Asset Manager", role: "principal" },
];

function makeId(prefix: string, name: string): string {
  return `user_${prefix}_${name.toLowerCase().split(" ")[0]}`;
}

function emailFor(name: string, orgSlug: string): string {
  const [first, last] = name.toLowerCase().split(" ");
  return `${first}.${last}@${orgSlug}.com`;
}

function buildUsers(orgId: string, orgSlug: string, seeds: Seed[]): User[] {
  return seeds.map((s) => ({
    id: makeId(orgSlug.split("-")[0]!, s.name),
    orgId,
    name: s.name,
    email: emailFor(s.name, orgSlug),
    role: s.role,
    title: s.title,
  }));
}

export const USERS: User[] = [
  ...buildUsers("org_hudson", "hudson-bay", HUDSON),
  ...buildUsers("org_phoenix", "phoenix-cre", PHOENIX),
  ...buildUsers("org_atlantic", "atlantic-realty", ATLANTIC),
];

export function listUsersForOrg(orgId: string): User[] {
  return USERS.filter((u) => u.orgId === orgId);
}

export function getUser(id: string): User | null {
  return USERS.find((u) => u.id === id) ?? null;
}
