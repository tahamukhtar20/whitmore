// The portfolio as a constellation: Whitmore at the centre, companies orbiting on two rings,
// sized by revenue and coloured by sector. Hovering, focusing or tapping a company shows its card.
import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { HOLDINGS, SECTOR_COLOR } from "./data.ts";
import type { Holding } from "./data.ts";
import { reducedMotion } from "./Motion.tsx";

const C = 300;
// Bigger companies sit on the outer ring; each ring turns at its own slow speed.
const placed = HOLDINGS.map((h, i) => {
  const outer = h.size >= 20;
  const ring = HOLDINGS.filter((x) => (x.size >= 20) === outer);
  const k = ring.indexOf(h);
  return { h, r: outer ? 220 : 128, a0: (k / ring.length) * Math.PI * 2 + (outer ? 0.3 : 0.9), speed: outer ? 0.00004 : -0.00006, i };
});
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

export function Constellation() {
  const svg = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<{ h: Holding; x: number; y: number } | null>(null);
  const pos = useRef(placed.map((p) => ({ x: C + p.r * Math.cos(p.a0), y: C + p.r * Math.sin(p.a0) })));
  // The orbit stops while a company is shown, so the card stays next to it.
  const paused = useRef(false);
  // A press focuses the node before its click; let the click decide instead of the focus.
  const pressing = useRef("");

  useEffect(() => {
    if (reducedMotion()) return;
    let raf = 0, t = 0, last = performance.now();
    const tick = (now: number) => {
      if (!paused.current) t += Math.min(now - last, 100);
      last = now;
      const root = svg.current;
      if (root && !paused.current) {
        placed.forEach((p, i) => {
          const a = p.a0 + t * p.speed;
          const x = C + p.r * Math.cos(a), y = C + p.r * Math.sin(a);
          pos.current[i] = { x, y };
          root.querySelector(`[data-i="${i}"]`)?.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
          const line = root.querySelector(`[data-l="${i}"]`);
          line?.setAttribute("x2", x.toFixed(1));
          line?.setAttribute("y2", y.toFixed(1));
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const show = (i: number) => {
    paused.current = true;
    setHover({ h: placed[i].h, ...pos.current[i] });
  };
  const hide = () => {
    paused.current = false;
    setHover(null);
  };
  // Touch has no hover: a tap toggles the card, and lifting the finger does not hide it.
  const leave = (e: PointerEvent) => {
    if (e.pointerType === "mouse") hide();
  };

  // Keep the card inside the picture: flip it near the edges and below the node near the top.
  const side = hover ? (hover.x > 430 ? " right" : hover.x < 170 ? " left" : "") : "";
  const below = hover && hover.y < 150 ? " below" : "";

  return (
    <div className="constellation">
      <svg ref={svg} viewBox="0 0 600 600" role="group" aria-label={`Whitmore's ${HOLDINGS.length} companies`}>
        <defs>
          <radialGradient id="halo" cx=".5" cy=".5" r=".5">
            <stop offset="0" stopColor="#d8b46a" stopOpacity=".32" />
            <stop offset="1" stopColor="#d8b46a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={C} cy={C} r="295" fill="url(#halo)" />
        {[128, 220].map((r) => (
          <circle key={r} cx={C} cy={C} r={r} fill="none" stroke="#24334f" strokeDasharray="3 7" />
        ))}
        {placed.map((p, i) => (
          <line key={i} data-l={i} x1={C} y1={C} x2={pos.current[i].x} y2={pos.current[i].y} stroke={SECTOR_COLOR[p.h.sector]} strokeOpacity=".22" />
        ))}
        {placed.map((p, i) => {
          const col = SECTOR_COLOR[p.h.sector];
          return (
            <g
              key={p.h.name}
              data-i={i}
              transform={`translate(${pos.current[i].x} ${pos.current[i].y})`}
              className="node"
              tabIndex={0}
              role="img"
              aria-label={`${p.h.name}: ${p.h.sector}, owned since ${p.h.since}, ${p.h.revenue} revenue, ${p.h.people} people`}
              onPointerEnter={(e) => e.pointerType === "mouse" && show(i)}
              onPointerLeave={leave}
              onPointerDown={(e) => (pressing.current = e.pointerType)}
              onClick={() => {
                const by = pressing.current;
                pressing.current = "";
                // A mouse already shows the card on hover; clicks toggle it for touch and keys.
                if (by === "mouse") show(i);
                else if (hover?.h === p.h) hide();
                else show(i);
              }}
              onFocus={() => !pressing.current && show(i)}
              onBlur={hide}
            >
              <circle r={p.h.size + 8} fill={col} opacity=".08" className="pulse" style={{ animationDelay: `${i * -0.7}s` }} />
              <circle r={p.h.size} fill="#0f1a2c" stroke={col} strokeWidth="1.6" />
              <circle r={p.h.size * 0.45} fill={col} opacity=".9" />
              <text y={p.h.size + 16} textAnchor="middle">
                {p.h.name}
              </text>
            </g>
          );
        })}
        <circle cx={C} cy={C} r="48" fill="#0f1a2c" stroke="#d8b46a" strokeWidth="2" />
        <path d={`M${C} ${C - 24} C ${C - 12} ${C - 8} ${C - 12} ${C + 6} ${C} ${C + 22} C ${C + 12} ${C + 6} ${C + 12} ${C - 8} ${C} ${C - 24} Z`} fill="#d8b46a" />
      </svg>
      {hover && (
        <div className={`node-card${side}${below}`} style={{ left: `${(hover.x / 600) * 100}%`, top: `${(hover.y / 600) * 100}%` }} aria-hidden>
          <b>{hover.h.name}</b>
          <span>
            {cap(hover.h.sector)} · since {hover.h.since}
          </span>
          <span>
            {hover.h.revenue} revenue · {hover.h.people} people
          </span>
        </div>
      )}
    </div>
  );
}
