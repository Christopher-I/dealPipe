import { PersonaProvider } from "@/components/shared/PersonaProvider";
import { Topbar } from "@/components/shared/Topbar";

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PersonaProvider>
      <div
        className="min-h-screen p-4"
        style={{ backgroundColor: "var(--color-page)" }}
      >
        <div
          className="min-h-[calc(100vh-2rem)] rounded-[var(--radius-shell)] p-5"
          style={{ backgroundColor: "var(--color-bg)" }}
        >
          <Topbar />
          <main className="mt-4">{children}</main>
        </div>
      </div>
    </PersonaProvider>
  );
}
