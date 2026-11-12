import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_COMPANY, dcf, money, quality, value } from "./valuation.ts";

test("the default company is a strong fit with sensible numbers", () => {
  const r = value(DEFAULT_COMPANY);
  assert.equal(r.verdict, "strong");
  assert.ok(Math.abs(r.ebitda - 3.96e6) < 1);
  assert.ok(r.multiple && r.multiple[0] > 5 && r.multiple[1] < 25, String(r.multiple));
  for (const m of r.methods) assert.ok(m.range[0] <= m.range[1], m.name);
  assert.ok(r.ours[0] < r.ours[1]);
});

test("growth and recurring revenue raise the value", () => {
  assert.ok(quality({ ...DEFAULT_COMPANY, growth: 0.3 }) > quality(DEFAULT_COMPANY));
  assert.ok(quality({ ...DEFAULT_COMPANY, recurring: 0 }) < quality(DEFAULT_COMPANY));
  assert.ok(value({ ...DEFAULT_COMPANY, growth: 0.3 }).ours[0] > value(DEFAULT_COMPANY).ours[0]);
});

test("a higher discount rate lowers the cash flow value", () => {
  assert.ok(dcf(DEFAULT_COMPANY, 0.14) < dcf(DEFAULT_COMPANY, 0.1));
});

test("loss-making, tiny or shrinking companies are not a fit, with reasons", () => {
  const loss = value({ ...DEFAULT_COMPANY, margin: -0.1 });
  assert.equal(loss.verdict, "no");
  assert.equal(loss.multiple, null);
  assert.ok(loss.methods.every((m) => m.range[0] >= 0));
  assert.match(loss.reasons.join(" "), /not yet profitable/);
  const tiny = value({ ...DEFAULT_COMPANY, revenue: 2e6 });
  assert.notEqual(tiny.verdict, "strong");
  assert.match(tiny.reasons.join(" "), /under \$5m/);
  assert.match(value({ ...DEFAULT_COMPANY, growth: -0.1 }).reasons.join(" "), /shrinking/);
});

test("sector changes the multiples", () => {
  assert.ok(value({ ...DEFAULT_COMPANY, sector: "logistics" }).ours[1] < value(DEFAULT_COMPANY).ours[1]);
});

test("money formats compactly", () => {
  assert.equal(money(3.96e6), "$4.0m");
  assert.equal(money(450e3), "$450k");
  assert.equal(money(1.25e9), "$1.25bn");
});

test("money formats signs and unit boundaries", () => {
  assert.equal(money(0), "$0");
  assert.equal(money(-3.6e6), "−$3.6m");
  assert.equal(money(999_600), "$1.0m");
  assert.equal(money(99.97e6), "$100m");
  assert.equal(money(450e3), "$450k");
});

test("a loss-making company is still valued on revenue", () => {
  const r = value({ ...DEFAULT_COMPANY, margin: -0.2 });
  assert.equal(r.verdict, "no");
  assert.ok(r.ours[0] > 0);
  assert.equal(r.multiple, null);
});
