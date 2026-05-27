"use client";

import type { Role } from "@/types/domain";

export type Persona = {
  id: string;
  name: string;
  title: string;
  role: Role;
  orgId: string;
  orgName: string;
  orgAccentHex: string;
  initials: string;
};

// V0 hardcoded personas — replaced when the seed lands in Phase 2.
// Org IDs and persona IDs match (or will match) the seed in lib/data/seed/.
export const PERSONAS: Persona[] = [
  {
    id: "persona_dwayne",
    name: "Dwayne Tatum",
    title: "CEO Assistant",
    role: "admin",
    orgId: "org_hudson",
    orgName: "Hudson Bay Partners",
    orgAccentHex: "#2F6B4A",
    initials: "DT",
  },
  {
    id: "persona_maya",
    name: "Maya Chen",
    title: "Acquisitions Principal",
    role: "principal",
    orgId: "org_phoenix",
    orgName: "Phoenix CRE",
    orgAccentHex: "#C94427",
    initials: "MC",
  },
  {
    id: "persona_james",
    name: "James Park",
    title: "Senior Broker",
    role: "broker",
    orgId: "org_atlantic",
    orgName: "Atlantic Realty Group",
    orgAccentHex: "#1F3D6B",
    initials: "JP",
  },
];

const STORAGE_KEY = "dp.activePersonaId";

export function getActivePersonaId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

export function setActivePersonaId(personaId: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, personaId);
}

export function clearActivePersona(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function getActivePersona(): Persona | null {
  const id = getActivePersonaId();
  if (!id) return null;
  return PERSONAS.find((p) => p.id === id) ?? null;
}
