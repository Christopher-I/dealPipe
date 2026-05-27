import { Mic } from "lucide-react";

export function AiPromptHero({
  greeting = "Hey, Need help?",
  emoji = "👋",
  placeholder = "Just ask me anything!",
}: {
  greeting?: string;
  emoji?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex items-center justify-end gap-6 flex-1">
      <div className="text-right">
        <p
          className="font-medium tracking-tight"
          style={{
            color: "var(--color-text)",
            fontSize: "var(--text-display)",
            lineHeight: "var(--text-display--line-height)",
          }}
        >
          {greeting}
          <span className="ml-1.5" aria-hidden>
            {emoji}
          </span>
        </p>
        <p
          className="font-medium tracking-tight cursor-blink"
          style={{
            color: "var(--color-text-subtle)",
            fontSize: "var(--text-display)",
            lineHeight: "var(--text-display--line-height)",
          }}
        >
          {placeholder}
        </p>
      </div>
      <button
        type="button"
        aria-label="Voice input"
        className="w-24 h-24 rounded-full flex items-center justify-center border transition-colors duration-200 shrink-0"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border-strong)",
          color: "var(--color-text-2)",
        }}
      >
        <Mic size={28} />
      </button>
    </div>
  );
}
