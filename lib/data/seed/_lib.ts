/**
 * Deterministic seed helpers. No external deps.
 * Same seed → same dataset every run.
 */

export function mulberry32(seed: number) {
  let state = seed >>> 0;
  return function rng(): number {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Rng = () => number;

export function intBetween(rng: Rng, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function floatBetween(
  rng: Rng,
  min: number,
  max: number,
  fractionDigits = 2,
): number {
  const raw = rng() * (max - min) + min;
  return Number(raw.toFixed(fractionDigits));
}

export function pick<T>(rng: Rng, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

export function weightedPick<T>(
  rng: Rng,
  arr: readonly { value: T; weight: number }[],
): T {
  const total = arr.reduce((acc, x) => acc + x.weight, 0);
  let r = rng() * total;
  for (const item of arr) {
    r -= item.weight;
    if (r <= 0) return item.value;
  }
  return arr[arr.length - 1].value;
}

export function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0]!;
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
