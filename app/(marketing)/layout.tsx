export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-page)" }}
    >
      {children}
    </div>
  );
}
