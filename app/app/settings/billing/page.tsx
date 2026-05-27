"use client";

import { CreditCard, Download } from "lucide-react";
import { usePersona } from "@/components/shared/PersonaProvider";

const INVOICES = [
  { id: "INV-2026-008", date: "2026-05-01", amount: 480, status: "Paid" },
  { id: "INV-2026-007", date: "2026-04-01", amount: 480, status: "Paid" },
  { id: "INV-2026-006", date: "2026-03-01", amount: 480, status: "Paid" },
  { id: "INV-2026-005", date: "2026-02-01", amount: 360, status: "Paid" },
  { id: "INV-2026-004", date: "2026-01-01", amount: 360, status: "Paid" },
];

export default function BillingPage() {
  const { persona } = usePersona();

  return (
    <div className="space-y-5">
      <div
        className="rounded-[var(--radius-card-lg)] border p-6 flex items-center justify-between gap-4 flex-wrap"
        style={{
          backgroundColor: "var(--color-surface-peach)",
          borderColor: "var(--color-surface-peach)",
        }}
      >
        <div>
          <p
            className="font-medium"
            style={{
              color: "var(--color-text)",
              fontSize: "var(--text-headline)",
            }}
          >
            Professional plan
          </p>
          <p
            className="mt-1"
            style={{
              color: "var(--color-text-2)",
              fontSize: "var(--text-body)",
            }}
          >
            $480/month · billed to {persona.orgName} · next charge June 1, 2026
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-full font-medium transition-[filter] duration-200"
          style={{
            backgroundColor: "var(--color-ink)",
            color: "var(--color-text-on-ink)",
            fontSize: "var(--text-body)",
          }}
        >
          Manage subscription
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div
          className="rounded-[var(--radius-card)] border p-6 space-y-4 lg:col-span-2"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <p
            className="font-medium"
            style={{
              color: "var(--color-text)",
              fontSize: "var(--text-label)",
            }}
          >
            Payment method
          </p>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "var(--color-surface-warm)",
                  color: "var(--color-text)",
                }}
              >
                <CreditCard size={18} />
              </span>
              <div>
                <p
                  className="font-medium tabular"
                  style={{
                    color: "var(--color-text)",
                    fontSize: "var(--text-body)",
                  }}
                >
                  Visa •••• 2719
                </p>
                <p
                  className="tabular"
                  style={{
                    color: "var(--color-text-muted)",
                    fontSize: "var(--text-meta)",
                  }}
                >
                  Expires 08/29
                </p>
              </div>
            </div>
            <button
              type="button"
              className="inline-flex items-center h-9 px-4 rounded-full border"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-2)",
                fontSize: "var(--text-chip)",
              }}
            >
              Update
            </button>
          </div>
        </div>

        <div
          className="rounded-[var(--radius-card)] border p-6 space-y-3"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <p
            className="font-medium"
            style={{
              color: "var(--color-text)",
              fontSize: "var(--text-label)",
            }}
          >
            Billing contact
          </p>
          <Field label="Email" value="billing@dealpipe.demo" />
          <Field label="VAT" value="—" />
        </div>
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
              {["Invoice", "Date", "Amount", "Status", ""].map((h) => (
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
            {INVOICES.map((inv, i) => (
              <tr
                key={inv.id}
                style={{
                  borderTop:
                    i === 0 ? undefined : "1px solid var(--color-border)",
                }}
              >
                <td
                  className="px-5 py-4 font-medium tabular"
                  style={{
                    color: "var(--color-text)",
                    fontSize: "var(--text-body)",
                  }}
                >
                  {inv.id}
                </td>
                <td
                  className="px-5 py-4 tabular"
                  style={{
                    color: "var(--color-text-2)",
                    fontSize: "var(--text-body)",
                  }}
                >
                  {new Date(inv.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td
                  className="px-5 py-4 tabular"
                  style={{
                    color: "var(--color-text)",
                    fontSize: "var(--text-body)",
                  }}
                >
                  <span style={{ color: "var(--color-accent)" }}>$</span>
                  {inv.amount.toFixed(2)}
                </td>
                <td className="px-5 py-4">
                  <span
                    className="inline-flex items-center px-3 h-7 rounded-full"
                    style={{
                      backgroundColor: "var(--color-surface-warm)",
                      color: "var(--color-text-2)",
                      fontSize: "var(--text-meta)",
                    }}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    aria-label="Download"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    <Download size={16} />
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

function Field({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span
        style={{
          color: "var(--color-text-muted)",
          fontSize: "var(--text-meta)",
        }}
      >
        {label}
      </span>
      <span
        className="font-medium text-right"
        style={{
          color: "var(--color-text)",
          fontSize: "var(--text-body)",
        }}
      >
        {value}
      </span>
    </div>
  );
}
