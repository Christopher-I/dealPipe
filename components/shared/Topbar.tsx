import { Menu, Search } from "lucide-react";
import { Logo } from "./Logo";
import { PersonaPill } from "./PersonaPill";

export function Topbar() {
  return (
    <header className="flex items-center justify-between gap-4 px-2">
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Menu"
          className="w-11 h-11 rounded-full flex items-center justify-center border transition-colors duration-200"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            color: "var(--color-text-2)",
          }}
        >
          <Menu size={18} />
        </button>
        <Logo size="md" />
      </div>

      <div className="flex items-center gap-3 flex-1 max-w-2xl ml-6">
        <div
          className="flex items-center gap-2 h-11 px-5 rounded-full border flex-1"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <Search size={16} style={{ color: "var(--color-text-subtle)" }} />
          <input
            type="text"
            placeholder="Start searching here ..."
            className="flex-1 bg-transparent outline-none placeholder:opacity-100"
            style={{
              color: "var(--color-text)",
              fontSize: "var(--text-body)",
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <PersonaPill />
      </div>
    </header>
  );
}
