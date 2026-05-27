"use client";

import { useEffect, useState } from "react";

type Props = {
  percent: number;
  label?: string;
};

export function GrowthRateDial({ percent, label = "Growth rate" }: Props) {
  const size = 188;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const fraction = Math.max(0, Math.min(100, percent)) / 100;
  const gap = 6;
  const coralLen = Math.max(0, c * fraction - gap);
  const trackLen = Math.max(0, c * (1 - fraction) - gap);

  // Reveal both arcs on mount via dashoffset transition.
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="relative rounded-full flex items-center justify-center aspect-square"
      style={{
        backgroundColor: "var(--color-dial-bg)",
        width: size,
        height: size,
      }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 w-full h-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="dialArc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-dial-accent-top)" />
            <stop offset="100%" stopColor="var(--color-dial-accent-bottom)" />
          </linearGradient>
        </defs>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="url(#dialArc)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${coralLen} ${c}`}
            strokeDashoffset={revealed ? 0 : coralLen}
            style={{
              transition:
                "stroke-dashoffset 900ms cubic-bezier(0.215, 0.61, 0.355, 1)",
            }}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--color-dial-track)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${trackLen} ${c}`}
            strokeDashoffset={revealed ? -(coralLen + gap) : -(coralLen + gap) - trackLen}
            style={{
              transition:
                "stroke-dashoffset 900ms cubic-bezier(0.215, 0.61, 0.355, 1) 200ms",
            }}
          />
        </g>
      </svg>
      <div
        className="relative text-center z-10 dp-fade-in"
        style={{ animationDelay: "500ms" }}
      >
        <p
          className="font-medium tabular"
          style={{
            color: "var(--color-dial-text)",
            fontSize: "var(--text-metric-lg)",
          }}
        >
          {percent}%
        </p>
        <p
          className="mt-0.5"
          style={{
            color: "var(--color-dial-text-muted)",
            fontSize: "var(--text-meta)",
          }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}
