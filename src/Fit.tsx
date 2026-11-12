// "Is your company a fit?": sliders in, an indicative valuation and a verdict out.
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { CircleCheck, CircleHelp, CircleX } from "lucide-react";
import { DEFAULT_COMPANY, LIMITS, SECTORS, money, value } from "./lib/valuation.ts";
import type { Company, SectorId } from "./lib/valuation.ts";
import { reducedMotion } from "./Motion.tsx";

function useTween(target: number, ms = 500) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    if (reducedMotion()) return setV(target);
    const start = performance.now(), a = from.current;
    let id = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const x = a + (target - a) * (1 - Math.pow(1 - t, 3));
      from.current = x;
      setV(x);
      if (t < 1) id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [target, ms]);
  return v;
}

type Slider = { key: "revenue" | "margin" | "growth" | "recurring"; label: string; min: number; max: number; step: number; show: (v: number) => string };
const SLIDERS: Slider[] = [
  { key: "revenue", label: "Annual revenue", min: LIMITS.revenue[0], max: LIMITS.revenue[1], step: 1e6, show: (v) => money(v) },
  { key: "margin", label: "EBITDA margin", min: LIMITS.margin[0], max: LIMITS.margin[1], step: 0.01, show: (v) => `${Math.round(v * 100)}%` },
  { key: "growth", label: "Revenue growth", min: LIMITS.growth[0], max: LIMITS.growth[1], step: 0.01, show: (v) => `${v >= 0 ? "" : "−"}${Math.abs(Math.round(v * 100))}% a year` },
  { key: "recurring", label: "Recurring revenue", min: 0, max: 1, step: 0.05, show: (v) => `${Math.round(v * 100)}%` },
];

export function Fit() {
  const [c, setC] = useState<Company>(DEFAULT_COMPANY);
  const r = useMemo(() => value(c), [c]);
  const ebitda = useTween(r.ebitda);
  const lo = useTween(r.ours[0]);
  const hi = useTween(r.ours[1]);
  // Axis: from zero to a round number above the highest method.
  const top = Math.max(...r.methods.map((m) => m.range[1]), r.ours[1], 1);
  const unit = Math.pow(10, Math.floor(Math.log10(top)));
  const axisMax = Math.ceil(top / unit) * unit;
  const pct = (n: number) => `${(Math.max(0, n) / axisMax) * 100}%`;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((k) => k * axisMax);
  const Icon = r.verdict === "strong" ? CircleCheck : r.verdict === "possible" ? CircleHelp : CircleX;
  const verdict = r.verdict === "strong" ? "Strong fit" : r.verdict === "possible" ? "Possible fit" : "Not a fit for us";
  // Screen readers hear the result once the sliders settle, not on every step.
  const summary = `${verdict}. Enterprise value ${money(r.ours[0])} to ${money(r.ours[1])}.`;
  const [said, setSaid] = useState("");
  useEffect(() => {
    const id = setTimeout(() => setSaid(summary), 700);
    return () => clearTimeout(id);
  }, [summary]);

  return (
    <div className="est">
      <div className="inputs">
        <fieldset>
          <legend>Sector</legend>
          <div className="chips">
            {SECTORS.map((s) => (
              <label key={s.id} className={`chip${c.sector === s.id ? " on" : ""}`}>
                <input type="radio" name="sector" className="sr" checked={c.sector === s.id} onChange={() => setC((x) => ({ ...x, sector: s.id as SectorId }))} />
                {s.name}
              </label>
            ))}
          </div>
        </fieldset>
        {SLIDERS.map((s) => (
          <label className="slider" key={s.key}>
            <span className="lbl">
              {s.label} <b>{s.show(c[s.key])}</b>
            </span>
            <input
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={c[s.key]}
              style={{ ["--pct" as string]: `${((c[s.key] - s.min) / (s.max - s.min)) * 100}%` } as CSSProperties}
              onChange={(e) => setC((x) => ({ ...x, [s.key]: +e.target.value }))}
            />
          </label>
        ))}
      </div>
      <div className="out">
        <div className="out-head">
          <h3>Indicative valuation</h3>
          <p className={`verdict ${r.verdict}`}>
            <Icon size={16} aria-hidden />
            <b>
              {verdict}
              {r.reasons.length > 0 ? ":" : ""}
            </b>
            {r.reasons.length > 0 && <span>{r.reasons.join(", ")}</span>}
          </p>
        </div>
        <div className="figures">
          <div>
            <span>EBITDA</span>
            <b>{money(ebitda)}</b>
          </div>
          <div>
            <span>Enterprise value</span>
            <b>
              {money(lo)}–{money(hi)}
            </b>
          </div>
          <div>
            <span>Implied multiple</span>
            <b>{r.multiple ? `${r.multiple[0].toFixed(1)}–${r.multiple[1].toFixed(1)}×` : "–"}</b>
          </div>
        </div>
        <div className="ff" role="img" aria-label={`Valuation ranges: ${r.methods.map((m) => `${m.name} ${money(m.range[0])} to ${money(m.range[1])}`).join("; ")}; our range ${money(r.ours[0])} to ${money(r.ours[1])}.`}>
          <div className="ff-axis">
            {ticks.map((t, i) => (
              <span key={t} style={{ left: `${i * 25}%` }}>
                {money(t)}
              </span>
            ))}
          </div>
          {r.methods.map((m) => (
            <div className="ff-row" key={m.id}>
              <span>
                {m.name}
                {m.range[1] <= 0 && <em className="na">n/a without profit</em>}
              </span>
              <span className="ff-track">
                <span className="ff-bar" style={{ left: pct(m.range[0]), width: `calc(${pct(m.range[1])} - ${pct(m.range[0])})` }} />
              </span>
            </div>
          ))}
          <div className="ff-row ours">
            <span>Our range</span>
            <span className="ff-track">
              <span className="ff-bar" style={{ left: pct(r.ours[0]), width: `calc(${pct(r.ours[1])} - ${pct(r.ours[0])})` }} />
            </span>
          </div>
        </div>
        <p className="sr" aria-live="polite">
          {said}
        </p>
        <p className="note">
          Illustrative. Multiples by sector, adjusted for growth and recurring revenue; the cash flow method assumes 60% of EBITDA becomes free cash, growth fading to 3% over five years. Our range is the middle method, plus or minus 12%.
        </p>
      </div>
    </div>
  );
}
