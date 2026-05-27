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
  const gap = 6; // arc-length gap between active and track on each side
  const coralLen = Math.max(0, c * fraction - gap);
  const trackLen = Math.max(0, c * (1 - fraction) - gap);

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
        {/* Rotate so 0deg = 12 o'clock (default SVG start is 3 o'clock) */}
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
            strokeDashoffset={0}
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
            strokeDashoffset={-(coralLen + gap)}
          />
        </g>
      </svg>
      <div className="relative text-center z-10">
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
