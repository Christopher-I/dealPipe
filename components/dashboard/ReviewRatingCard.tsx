"use client";

import { Frown, Meh, Smile, X } from "lucide-react";
import { useState } from "react";

const FACES = [
  { id: "very-sad", icon: <FaceVerySad />, label: "Very dissatisfied" },
  { id: "sad", icon: <Frown size={20} />, label: "Dissatisfied" },
  { id: "neutral", icon: <Meh size={20} />, label: "Neutral" },
  { id: "smile", icon: <Smile size={20} />, label: "Satisfied" },
  { id: "very-happy", icon: <FaceVeryHappy />, label: "Very satisfied" },
];

function FaceVerySad() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
      <line x1="8.5" y1="9" x2="9.5" y2="10" />
      <line x1="9.5" y1="9" x2="8.5" y2="10" />
      <line x1="14.5" y1="9" x2="15.5" y2="10" />
      <line x1="15.5" y1="9" x2="14.5" y2="10" />
    </svg>
  );
}
function FaceVeryHappy() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M7 13c0 3 2.5 5 5 5s5-2 5-5" />
      <path d="M7 10c.5-.6 1.2-1 2-1s1.5.4 2 1" />
      <path d="M13 10c.5-.6 1.2-1 2-1s1.5.4 2 1" />
    </svg>
  );
}

export function ReviewRatingCard({
  question = "How is your portfolio performing?",
}: { question?: string }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div
      className="rounded-[var(--radius-card)] border p-6 flex flex-col gap-4"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="block h-1.5 w-10 rounded-full"
          style={{ backgroundColor: "var(--color-text-subtle)", opacity: 0.5 }}
          aria-hidden
        />
        <button
          type="button"
          aria-label="Dismiss"
          style={{ color: "var(--color-text-2)" }}
        >
          <X size={16} />
        </button>
      </div>
      <div>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-meta)",
          }}
        >
          Review rating
        </p>
        <p
          className="font-medium mt-1"
          style={{
            color: "var(--color-text)",
            fontSize: "var(--text-headline)",
          }}
        >
          {question}
        </p>
      </div>
      <div className="flex items-center justify-between gap-1.5">
        {FACES.map((f) => {
          const active = selected === f.id;
          return (
            <button
              key={f.id}
              type="button"
              aria-label={f.label}
              onClick={() => setSelected(f.id)}
              className="w-11 h-11 rounded-full flex items-center justify-center border transition-colors duration-200"
              style={{
                backgroundColor: active
                  ? "var(--color-surface-peach)"
                  : "var(--color-surface)",
                borderColor: "var(--color-border)",
                color: active
                  ? "var(--color-accent)"
                  : "var(--color-text-2)",
              }}
            >
              {f.icon}
            </button>
          );
        })}
      </div>
    </div>
  );
}
