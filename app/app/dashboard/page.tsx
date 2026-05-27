export default function DashboardPage() {
  return (
    <div className="space-y-2">
      <h1
        className="font-medium"
        style={{
          color: "var(--color-text)",
          fontSize: "var(--text-display)",
          lineHeight: "var(--text-display--line-height)",
        }}
      >
        Dashboard
      </h1>
      <p
        style={{
          color: "var(--color-text-muted)",
          fontSize: "var(--text-body)",
        }}
      >
        Phase 3 builds the pixel-parity KPI surface here.
      </p>
    </div>
  );
}
