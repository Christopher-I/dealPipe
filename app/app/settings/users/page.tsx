"use client";

import { Mail, MoreVertical, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { usePersona } from "@/components/shared/PersonaProvider";
import { listOrgMembers } from "@/lib/data";
import type { User } from "@/types/domain";

const ROLE_LABEL: Record<User["role"], string> = {
  admin: "Admin",
  principal: "Principal",
  broker: "Broker",
};

export default function MembersPage() {
  const { persona } = usePersona();
  const [members, setMembers] = useState<User[]>([]);

  useEffect(() => {
    let alive = true;
    listOrgMembers({ orgId: persona.orgId }).then((m) => {
      if (!alive) return;
      setMembers(m);
    });
    return () => {
      alive = false;
    };
  }, [persona.orgId]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-body)",
          }}
        >
          {members.length} {members.length === 1 ? "member" : "members"} in{" "}
          {persona.orgName}
        </p>
        <button
          type="button"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-full font-medium transition-[filter] duration-200"
          style={{
            background:
              "linear-gradient(180deg, #EB6A4D 0%, #E15B3F 50%, #D74D31 100%)",
            color: "var(--color-text-on-accent)",
            fontSize: "var(--text-body)",
          }}
        >
          <UserPlus size={16} />
          Invite member
        </button>
      </div>

      <div
        className="rounded-[var(--radius-card-lg)] border overflow-hidden"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <table className="w-full text-left">
          <thead>
            <tr style={{ backgroundColor: "var(--color-surface-warm)" }}>
              {["Member", "Email", "Role", "Title", ""].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3"
                  style={{
                    color: "var(--color-text-muted)",
                    fontSize: "var(--text-meta)",
                    fontWeight: 500,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((u, i) => (
              <tr
                key={u.id}
                style={{
                  borderTop:
                    i === 0 ? undefined : "1px solid var(--color-border)",
                }}
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white"
                      style={{
                        backgroundColor: persona.orgAccentHex,
                        fontSize: "12px",
                        fontWeight: 500,
                      }}
                    >
                      {u.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                    <span
                      className="font-medium"
                      style={{
                        color: "var(--color-text)",
                        fontSize: "var(--text-body)",
                      }}
                    >
                      {u.name}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <a
                    href={`mailto:${u.email}`}
                    className="inline-flex items-center gap-1.5 hover:underline"
                    style={{
                      color: "var(--color-text-2)",
                      fontSize: "var(--text-body)",
                    }}
                  >
                    <Mail size={12} />
                    {u.email}
                  </a>
                </td>
                <td className="px-5 py-4">
                  <span
                    className="inline-flex items-center px-3 h-7 rounded-full"
                    style={{
                      backgroundColor:
                        u.role === "admin"
                          ? "var(--color-surface-peach)"
                          : "var(--color-surface-warm)",
                      color:
                        u.role === "admin"
                          ? "var(--color-accent)"
                          : "var(--color-text-2)",
                      fontSize: "var(--text-meta)",
                    }}
                  >
                    {ROLE_LABEL[u.role]}
                  </span>
                </td>
                <td
                  className="px-5 py-4"
                  style={{
                    color: "var(--color-text-2)",
                    fontSize: "var(--text-body)",
                  }}
                >
                  {u.title ?? "—"}
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    aria-label="More"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
