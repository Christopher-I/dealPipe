import { Menu, Plus, Search } from "lucide-react";
import { Logo } from "./Logo";
import { PersonaPill } from "./PersonaPill";

export function Topbar() {
  return (
    <header className="flex items-center justify-between gap-5">
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Menu"
          className="w-12 h-12 rounded-full flex items-center justify-center border transition-colors duration-200"
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

      <div className="flex items-center gap-3 ml-auto">
        <button
          type="button"
          aria-label="New"
          className="w-12 h-12 rounded-full flex items-center justify-center border transition-colors duration-200"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            color: "var(--color-text-2)",
          }}
        >
          <Plus size={18} />
        </button>
        <PersonaPill />
        <div
          className="hidden lg:flex items-center gap-2 h-12 px-5 rounded-full border w-[280px]"
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
    </header>
  );
}
