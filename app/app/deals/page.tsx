export default function DealsPage() {
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
        Deals
      </h1>
      <p
        style={{
          color: "var(--color-text-muted)",
          fontSize: "var(--text-body)",
        }}
      >
        Phase 4 builds the pipeline Kanban and deal detail here.
      </p>
    </div>
  );
}
