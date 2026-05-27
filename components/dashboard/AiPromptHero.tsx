import { Mic, Sparkles } from "lucide-react";

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
        <div className="flex items-center justify-end gap-2 mb-1">
          <span
            className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full"
            style={{
              backgroundColor: "var(--color-surface-peach)",
              color: "var(--color-accent)",
              fontSize: "var(--text-meta)",
              fontWeight: 500,
            }}
          >
            <Sparkles size={11} />
            DealPipe AI · Voice
          </span>
        </div>
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
        aria-label="Talk to DealPipe AI"
        title="Talk to DealPipe AI"
        className="relative w-24 h-24 rounded-full flex items-center justify-center border transition-colors duration-200 shrink-0 dp-mic-pulse"
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
