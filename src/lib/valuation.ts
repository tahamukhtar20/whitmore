// "Is your company a fit?": an indicative valuation from three methods, and whether the
// business matches what Whitmore buys. Every number comes from the fixed rules below.

export const SECTORS = [
  { id: "software", name: "Software", ebitda: [8, 12], revenue: [1.5, 3], discount: 0.12 },
  { id: "health", name: "Health", ebitda: [7, 10], revenue: [0.8, 2], discount: 0.11 },
  { id: "logistics", name: "Logistics", ebitda: [5, 8], revenue: [0.4, 1], discount: 0.12 },
  { id: "consumer", name: "Consumer", ebitda: [6, 10], revenue: [0.6, 1.5], discount: 0.13 },
  { id: "industrial", name: "Industrial", ebitda: [5, 8], revenue: [0.5, 1.2], discount: 0.12 },
] as const;
export type SectorId = (typeof SECTORS)[number]["id"];

export type Company = {
  sector: SectorId;
  /** Annual revenue in dollars. */
  revenue: number;
  /** EBITDA margin, 0..1 (can be negative). */
  margin: number;
  /** Yearly revenue growth, -0.5..1. */
  growth: number;
  /** Share of revenue that recurs (subscriptions, contracts), 0..1. */
  recurring: number;
};

export type Range = [number, number];
export type Method = { id: "ebitda" | "revenue" | "dcf"; name: string; range: Range };
export type Verdict = "strong" | "possible" | "no";
export type Result = {
  ebitda: number;
  methods: Method[];
  ours: Range;
  multiple: Range | null;
  verdict: Verdict;
  reasons: string[];
};

export const LIMITS = { revenue: [1e6, 150e6], margin: [-0.2, 0.45], growth: [-0.2, 0.6], recurring: [0, 1] } as const;

const sector = (id: SectorId) => SECTORS.find((s) => s.id === id)!;
const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));

/**
 * Better businesses earn higher multiples: growth above 8% a year adds up to 25%,
 * and recurring revenue adds up to 10%. Shrinking businesses lose up to 25%.
 */
export function quality(c: Company): number {
  const growth = clamp(c.growth - 0.08, -0.25, 0.25);
  const recurring = clamp(c.recurring, 0, 1) * 0.1;
  return 1 + growth + recurring;
}

/** Five years of free cash flow (60% of EBITDA) growing towards 3%, then a terminal value. */
export function dcf(c: Company, discount: number): number {
  let cash = c.revenue * c.margin * 0.6;
  let value = 0;
  for (let year = 1; year <= 5; year++) {
    const g = c.growth + ((0.03 - c.growth) * (year - 1)) / 4;
    cash *= 1 + g;
    value += cash / Math.pow(1 + discount, year);
  }
  const terminal = (cash * 1.03) / (discount - 0.03);
  return value + terminal / Math.pow(1 + discount, 5);
}

export function value(c: Company): Result {
  const s = sector(c.sector);
  const ebitda = c.revenue * c.margin;
  const q = quality(c);
  const pos = (n: number) => Math.max(0, n);
  const methods: Method[] = [
    { id: "ebitda", name: "Sector EBITDA multiples", range: [pos(ebitda * s.ebitda[0] * q), pos(ebitda * s.ebitda[1] * q)] },
    { id: "revenue", name: "Revenue multiples", range: [c.revenue * s.revenue[0] * q, c.revenue * s.revenue[1] * q] },
    { id: "dcf", name: "Discounted cash flow", range: [pos(dcf(c, s.discount + 0.01)), pos(dcf(c, s.discount - 0.01))] },
  ];
  // Our range: the middle of the three methods' midpoints, plus or minus 12%. Without
  // profits the earnings methods say nothing, so the revenue method stands alone.
  const mid = (m: Method) => (m.range[0] + m.range[1]) / 2;
  const mids = methods.map(mid).sort((a, b) => a - b);
  const centre = ebitda > 0 ? mids[1] : mid(methods[1]);
  const ours: Range = [centre * 0.88, centre * 1.12];
  const multiple: Range | null = ebitda > 0 ? [ours[0] / ebitda, ours[1] / ebitda] : null;

  // What Whitmore buys: profitable, $5m to $100m revenue, not shrinking, at least 10% margins.
  const reasons: string[] = [];
  const good: string[] = [];
  if (ebitda <= 0) reasons.push("it is not yet profitable, and we only buy profitable companies");
  else if (ebitda < 1e6) reasons.push("EBITDA is under $1m, smaller than the companies we buy");
  else good.push("profitable");
  if (c.revenue < 5e6) reasons.push("revenue is under $5m");
  else if (c.revenue > 100e6) reasons.push("revenue is over $100m, beyond the size we buy");
  if (c.margin > 0 && c.margin < 0.1) reasons.push("margins under 10% leave little room in a bad year");
  if (c.growth < 0) reasons.push("revenue is shrinking");
  else if (c.growth >= 0.1) good.push("growing");
  if (c.recurring >= 0.5) good.push("mostly recurring");
  const verdict: Verdict = reasons.length === 0 && good.length >= 2 ? "strong" : reasons.length <= 1 && ebitda > 0 ? "possible" : "no";
  if (verdict === "possible" && reasons.length === 0) {
    if (c.growth < 0.1) reasons.push("growth under 10% a year");
    if (c.recurring < 0.5) reasons.push("under half of revenue recurring");
  }
  return { ebitda, methods, ours, multiple, verdict, reasons: verdict === "strong" ? good : reasons };
}

export const DEFAULT_COMPANY: Company = { sector: "software", revenue: 18e6, margin: 0.22, growth: 0.14, recurring: 0.7 };

export function money(n: number): string {
  const sign = n <= -500 ? "−" : "";
  let a = Math.abs(n);
  if (a < 500) return "$0";
  // Round first, so 999,600 reads as $1.0m rather than $1000k.
  if (a < 999.5e3) return `${sign}$${Math.round(a / 1e3)}k`;
  a = Math.max(a, 1e6);
  if (a < 99.95e6) return `${sign}$${(a / 1e6).toFixed(1)}m`;
  if (a < 999.5e6) return `${sign}$${Math.round(a / 1e6)}m`;
  return `${sign}$${(a / 1e9).toFixed(2)}bn`;
}
