type Props = {
  amount: string;
  currency?: string;
};

const BAR_HEIGHTS = [
  0.55, 0.85, 0.45, 0.95, 0.6, 0.75, 0.4, 0.7, 0.5, 0.65, 0.35, 0.5,
];
const BAR_FILLS = [
  "var(--color-accent-bar-mute)",
  "var(--color-accent)",
  "var(--color-accent-bar-mute)",
  "var(--color-accent)",
  "var(--color-accent-bar-mute)",
  "var(--color-accent)",
  "var(--color-accent-bar-mute)",
  "var(--color-accent)",
  "var(--color-accent-bar-mute)",
  "var(--color-accent)",
  "var(--color-accent-bar-mute)",
  "var(--color-accent)",
];

export function ActivityBarMini({ amount, currency = "USD" }: Props) {
  const barWidth = 14;
  const gap = 10;
  const chartH = 70;
  const totalW = BAR_HEIGHTS.length * (barWidth + gap) - gap;

  return (
    <div
      className="rounded-[var(--radius-sub-card)] border p-5 flex flex-col gap-3"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <p
        className="font-medium tabular"
        style={{
          color: "var(--color-text)",
          fontSize: "var(--text-metric-lg)",
        }}
      >
        <span className="mr-1">$</span>
        {amount}
        <span
          className="ml-2"
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-meta)",
          }}
        >
          {currency}
        </span>
      </p>
      <svg
        viewBox={`0 0 ${totalW} ${chartH}`}
        preserveAspectRatio="none"
        width="100%"
        height={chartH}
        aria-hidden
      >
        {BAR_HEIGHTS.map((h, i) => {
          const height = h * chartH;
          const x = i * (barWidth + gap);
          const y = chartH - height;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={barWidth}
              height={height}
              rx={6}
              fill={BAR_FILLS[i]}
              className="dp-grow-y"
              style={{
                transformOrigin: `${x + barWidth / 2}px ${chartH}px`,
                animationDelay: `${i * 50}ms`,
              }}
            />
          );
        })}
      </svg>
      <div className="flex items-center justify-center gap-1.5">
        {[0, 1, 2].map((d) => (
          <span
            key={d}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor:
                d === 1 ? "var(--color-accent)" : "var(--color-border-strong)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
