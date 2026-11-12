// The site's moving backdrop and page changes: a field of drifting dots that link up and
// react to the pointer, slow glowing orbs, turning rings, and panels that sweep across
// between pages. With reduced motion everything is drawn once and pages switch instantly.
import { useEffect, useRef } from "react";

export const reducedMotion = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

type Dot = { x: number; y: number; vx: number; vy: number; r: number; gold: boolean };

export function DotField() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvas.current!;
    const ctx = c.getContext("2d")!;
    let w = 0, h = 0, dpr = 1, raf = 0;
    let dots: Dot[] = [];
    const mouse = { x: -9999, y: -9999 };
    const still = reducedMotion();

    const resize = () => {
      dpr = Math.min(2, devicePixelRatio || 1);
      const widthChanged = innerWidth !== w;
      w = innerWidth;
      h = innerHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Phones change height when the address bar hides; keep the dots where they are.
      if (!widthChanged && dots.length) {
        if (still) draw();
        return;
      }
      const n = Math.min(110, Math.round((w * h) / 15000));
      dots = Array.from({ length: n }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1 + Math.random() * 1.6,
        gold: i % 4 === 0,
      }));
      if (still) draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const link = Math.min(140, w / 8);
      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < link) {
            ctx.strokeStyle = `rgba(216,180,106,${(1 - d / link) * 0.18})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        // Dots near the pointer reach out to it.
        const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (dm < 180) {
          ctx.strokeStyle = `rgba(95,179,161,${(1 - dm / 180) * 0.45})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
      for (const a of dots) {
        ctx.fillStyle = a.gold ? "rgba(216,180,106,.85)" : "rgba(170,186,210,.55)";
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      for (const a of dots) {
        // Gently pushed away from the pointer, like the original site's particles.
        const dx = a.x - mouse.x, dy = a.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 110 && d > 0) {
          a.vx += (dx / d) * 0.06;
          a.vy += (dy / d) * 0.06;
        }
        a.vx = Math.max(-1.2, Math.min(1.2, a.vx * 0.995));
        a.vy = Math.max(-1.2, Math.min(1.2, a.vy * 0.995));
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < -10) a.x = w + 10;
        if (a.x > w + 10) a.x = -10;
        if (a.y < -10) a.y = h + 10;
        if (a.y > h + 10) a.y = -10;
      }
      draw();
      raf = requestAnimationFrame(step);
    };

    resize();
    if (!still) raf = requestAnimationFrame(step);
    const onMove = (e: PointerEvent) => {
      // A finger lifting should not leave the dots attracted to where it was.
      if (e.pointerType !== "mouse") return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const reset = () => {
      mouse.x = mouse.y = -9999;
    };
    const onLeave = (e: PointerEvent) => {
      if (!e.relatedTarget) reset();
    };
    const onVisible = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !still) raf = requestAnimationFrame(step);
    };
    addEventListener("resize", resize);
    addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onLeave);
    addEventListener("blur", reset);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onLeave);
      removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);
  return <canvas ref={canvas} className="dots" aria-hidden />;
}

/** Soft glowing orbs and turning rings behind the content. */
export function Ornaments() {
  return (
    <div className="ornaments" aria-hidden>
      <span className="orb o1" />
      <span className="orb o2" />
      <span className="orb o3" />
      <svg className="rings" viewBox="0 0 400 400">
        <circle cx="200" cy="200" r="190" fill="none" stroke="#d8b46a" strokeOpacity=".22" strokeDasharray="2 10" />
        <circle cx="200" cy="200" r="150" fill="none" stroke="#5fb3a1" strokeOpacity=".2" strokeDasharray="40 14" />
        <circle cx="200" cy="200" r="110" fill="none" stroke="#d8b46a" strokeOpacity=".16" />
        <circle cx="390" cy="200" r="5" fill="#d8b46a" />
        <circle cx="200" cy="50" r="4" fill="#5fb3a1" />
      </svg>
    </div>
  );
}

/**
 * Page change: three panels sweep in from the right, the page swaps while it is covered,
 * and the panels carry on out to the left. Resolves when the new page is showing.
 */
export function sweep(swap: () => void): Promise<void> {
  const panels = [...document.querySelectorAll<HTMLElement>(".sweep span")];
  if (reducedMotion() || panels.length === 0) {
    swap();
    scrollTo(0, 0);
    return Promise.resolve();
  }
  const ease = "cubic-bezier(.7,0,.3,1)";
  const cover = panels.map((p, i) =>
    p.animate([{ transform: "translateX(100%)" }, { transform: "translateX(0)" }], { duration: 520, delay: i * 90, easing: ease, fill: "forwards" }).finished,
  );
  return Promise.all(cover).then(() => {
    swap();
    scrollTo(0, 0);
    const out = panels.map((p, i) =>
      p.animate([{ transform: "translateX(0)" }, { transform: "translateX(-100%)" }], { duration: 520, delay: 80 + (panels.length - 1 - i) * 90, easing: ease, fill: "forwards" }).finished,
    );
    return Promise.all(out).then(() => panels.forEach((p) => p.getAnimations().forEach((a) => a.cancel())));
  });
}

export function SweepPanels() {
  return (
    <div className="sweep" aria-hidden>
      <span />
      <span />
      <span />
    </div>
  );
}
