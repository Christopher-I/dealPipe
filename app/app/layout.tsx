import { RequirePersona } from "@/components/shared/RequirePersona";
import { Topbar } from "@/components/shared/Topbar";

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequirePersona>
      <div
        className="min-h-screen p-4"
        style={{ backgroundColor: "var(--color-page)" }}
      >
        <div
          className="min-h-[calc(100vh-2rem)] rounded-[var(--radius-shell)] p-6"
          style={{ backgroundColor: "var(--color-bg)" }}
        >
          <Topbar />
          <main className="mt-6">{children}</main>
        </div>
      </div>
    </RequirePersona>
  );
}
