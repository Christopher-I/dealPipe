"use client";

import { Mic, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "@/lib/toast";

export function AiPromptHero({
  greeting = "Hey, Need help?",
  emoji = "👋",
  placeholder = "Just ask me anything!",
}: {
  greeting?: string;
  emoji?: string;
  placeholder?: string;
}) {
  const [listening, setListening] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onMicClick = () => {
    if (listening) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setListening(false);
      toast("Voice input cancelled");
      return;
    }
    setListening(true);
    toast("Listening… (demo)");
    timerRef.current = setTimeout(() => {
      setListening(false);
      toast(
        '"Show me office deals in Texas closing this quarter"',
        { tone: "success", duration: 3200 },
      );
    }, 2200);
  };

  return (
    <div className="flex items-center justify-end gap-4 sm:gap-6 flex-1 min-w-0">
      <div className="text-right min-w-0 flex-1">
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
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
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
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            lineHeight: "var(--text-display--line-height)",
          }}
        >
          {listening ? "Listening…" : placeholder}
        </p>
      </div>
      <button
        type="button"
        aria-label="Talk to DealPipe AI"
        title="Talk to DealPipe AI"
        onClick={onMicClick}
        className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center border shrink-0"
        style={{
          backgroundColor: listening
            ? "var(--color-accent)"
            : "var(--color-surface)",
          borderColor: listening
            ? "var(--color-accent)"
            : "var(--color-border-strong)",
          color: listening
            ? "var(--color-text-on-accent)"
            : "var(--color-text-2)",
          animation: listening
            ? "dp-mic-pulse 1.2s ease-in-out infinite"
            : "dp-mic-pulse 3s ease-in-out infinite",
        }}
      >
        <Mic size={24} className="sm:hidden" />
        <Mic size={28} className="hidden sm:block" />
      </button>
    </div>
  );
}
