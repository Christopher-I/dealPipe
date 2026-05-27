"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  type Persona,
  clearActivePersona,
  getActivePersona,
} from "@/lib/data/session";

type Ctx = {
  persona: Persona;
  signOut: () => void;
};

const PersonaContext = createContext<Ctx | null>(null);

export function usePersona(): Ctx {
  const v = useContext(PersonaContext);
  if (!v) {
    throw new Error("usePersona must be used inside <PersonaProvider>");
  }
  return v;
}

export function PersonaProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const p = getActivePersona();
    if (!p) {
      router.replace("/login");
      return;
    }
    setPersona(p);
    setChecked(true);
  }, [router]);

  const signOut = () => {
    clearActivePersona();
    setPersona(null);
    router.push("/login");
  };

  if (!checked || !persona) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ color: "var(--color-text-muted)" }}
      >
        <span style={{ fontSize: "var(--text-body)" }}>Loading…</span>
      </div>
    );
  }

  return (
    <PersonaContext.Provider value={{ persona, signOut }}>
      {children}
    </PersonaContext.Provider>
  );
}
