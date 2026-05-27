"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/app/settings", label: "Organization" },
  { href: "/app/settings/users", label: "Members" },
  { href: "/app/settings/billing", label: "Billing" },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1
          className="font-medium tracking-tight"
          style={{
            color: "var(--color-text)",
            fontSize: "var(--text-display)",
            lineHeight: "var(--text-display--line-height)",
          }}
        >
          Settings
        </h1>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-body)",
          }}
        >
          Organization profile, member access, and billing.
        </p>
      </div>

      <nav
        className="inline-flex items-center p-1 rounded-full border gap-1"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="inline-flex items-center h-8 px-4 rounded-full transition-colors duration-200"
              style={{
                backgroundColor: active ? "var(--color-ink)" : "transparent",
                color: active
                  ? "var(--color-text-on-ink)"
                  : "var(--color-text-2)",
                fontSize: "var(--text-chip)",
                fontWeight: 500,
              }}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <div>{children}</div>
    </div>
  );
}
