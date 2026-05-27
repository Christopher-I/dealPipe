"use client";

import { Activity } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCountUp } from "@/lib/hooks/useCountUp";

type Props = {
  value: number;
  title: string;
  subtitle: string;
  deltaPercent: number;
};

// Hand-tuned smooth path so the line looks like a real market wave.
const LINE_PATH =
  "M 0 60 C 20 55, 30 35, 50 45 S 80 70, 100 50 S 130 20, 150 35 S 180 65, 200 50 S 230 25, 260 40 S 295 70, 320 50 S 355 30, 380 38 S 410 55, 440 30 S 470 5, 500 25";

export function MainStocksCard({
  value,
  title,
  subtitle,
  deltaPercent,
}: Props) {
  const animated = useCountUp(value, 900);
  const fixed = animated.toFixed(2);
  const [int, frac] = fixed.split(".");
  const integer = Number(int).toLocaleString("en-US");

  // Measure path length so we can animate stroke-dashoffset cleanly.
  const pathRef = useRef<SVGPathElement>(null);
  const [length, setLength] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (pathRef.current) {
      setLength(pathRef.current.getTotalLength());
    }
  }, []);

  useEffect(() => {
    if (length == null) return;
    const raf = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(raf);
  }, [length]);

  return (
    <div
      className="rounded-[var(--radius-card)] border p-5 flex flex-col gap-3 h-full"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: "var(--color-surface-warm)",
            color: "var(--color-text-2)",
          }}
        >
          <Activity size={16} />
        </div>
        <p
          className="font-medium tabular text-right"
          style={{
            color: "var(--color-text)",
            fontSize: "var(--text-metric-lg)",
          }}
        >
          <span
            className="mr-1"
            style={{ color: "var(--color-accent-glyph)" }}
          >
            $
          </span>
          {integer}.{frac}
        </p>
      </div>

      <svg
        viewBox="0 0 500 80"
        preserveAspectRatio="none"
        className="w-full flex-1 min-h-[60px]"
        aria-hidden
      >
        <path
          ref={pathRef}
          d={LINE_PATH}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={length ?? 0}
          strokeDashoffset={revealed ? 0 : length ?? 0}
          style={{
            transition: revealed
              ? "stroke-dashoffset 1400ms cubic-bezier(0.215, 0.61, 0.355, 1)"
              : "none",
          }}
        />
      </svg>

      <div className="flex items-end justify-between">
        <div>
          <p
            className="font-medium"
            style={{
              color: "var(--color-text)",
              fontSize: "var(--text-label)",
            }}
          >
            {title}
          </p>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "var(--text-meta)",
            }}
          >
            {subtitle}
          </p>
        </div>
        <span
          className="inline-flex items-center h-7 px-3 rounded-full font-medium"
          style={{
            backgroundColor: "var(--color-surface-peach)",
            color: "var(--color-accent)",
            fontSize: "var(--text-chip)",
          }}
        >
          +{deltaPercent.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
