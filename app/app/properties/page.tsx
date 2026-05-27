export default function PropertiesPage() {
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
        Properties
      </h1>
      <p
        style={{
          color: "var(--color-text-muted)",
          fontSize: "var(--text-body)",
        }}
      >
        Phase 5 builds the Mapbox map and property list here.
      </p>
    </div>
  );
}
