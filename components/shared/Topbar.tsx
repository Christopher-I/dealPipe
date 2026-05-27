"use client";

import { ArrowLeft, Menu, Plus, Search } from "lucide-react";
import Link from "next/link";
import { Logo } from "./Logo";
import { PersonaPill } from "./PersonaPill";
import { toast } from "@/lib/toast";

export function Topbar() {
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          title="Back to home"
          aria-label="Back to home"
          className="w-11 h-11 rounded-full flex items-center justify-center border"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            color: "var(--color-text-2)",
          }}
        >
          <ArrowLeft size={16} />
        </Link>
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => toast("Demo: opens nav drawer")}
          className="w-11 h-11 rounded-full flex items-center justify-center border"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            color: "var(--color-text-2)",
          }}
        >
          <Menu size={16} />
        </button>
        <Logo size="md" href="/" />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          type="button"
          aria-label="New"
          onClick={() => toast("Demo: opens new-deal form")}
          className="w-11 h-11 rounded-full flex items-center justify-center border"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            color: "var(--color-text-2)",
          }}
        >
          <Plus size={16} />
        </button>
        <PersonaPill />
        <form
          action="/app/search"
          method="get"
          className="hidden lg:flex items-center gap-2 h-11 px-5 rounded-full border w-[240px]"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <Search size={14} style={{ color: "var(--color-text-subtle)" }} />
          <input
            type="text"
            name="q"
            placeholder="Start searching here ..."
            className="flex-1 bg-transparent outline-none placeholder:opacity-100"
            style={{
              color: "var(--color-text)",
              fontSize: "var(--text-body)",
            }}
          />
        </form>
      </div>
    </header>
  );
}
