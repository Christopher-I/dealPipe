export type FormattedMoney = {
  sign: string;
  amount: string;
};

export function formatMoney(value: number, currency = "USD"): FormattedMoney {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formatted = formatter.format(value);
  const match = formatted.match(/^([^\d-]+)?(-?[\d.,]+)/);
  const sign = match?.[1]?.trim() ?? "$";
  const amount = match?.[2] ?? formatted;
  return { sign, amount };
}

export function formatCompactMoney(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}K`;
  }
  return `$${value}`;
}

export function formatPercent(value: number, fractionDigits = 1): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(fractionDigits)}%`;
}
