import { useEffect, useRef, useState } from "react";
import type { ElementType, MouseEvent, ReactNode } from "react";
import { ArrowRight, Briefcase, Compass, Home, Mail, Pause, Play, Scale, Users } from "lucide-react";
import { Constellation } from "./Constellation.tsx";
import { FAMILY, HOLDINGS, PRINCIPLES, PROCESS, QUOTES, SECTOR_COLOR } from "./data.ts";
import type { SectorKey } from "./data.ts";
import { Fit } from "./Fit.tsx";
import { DotField, Ornaments, SweepPanels, reducedMotion, sweep } from "./Motion.tsx";

const PAGES = [
  { path: "/", name: "Home", icon: Home },
  { path: "/approach", name: "Approach", icon: Compass },
  { path: "/portfolio", name: "Portfolio", icon: Briefcase },
  { path: "/fit", name: "Is it a fit?", icon: Scale },
  { path: "/family", name: "Family", icon: Users },
  { path: "/contact", name: "Contact", icon: Mail },
] as const;
const REPO = "https://github.com/tahamukhtar20/whitmore";
const known = (raw: string) => {
  const p = raw.length > 1 ? raw.replace(/\/+$/, "") : raw;
  return PAGES.some((x) => x.path === p) ? p : "/";
};

function Logo() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className="logo-mark">
      <path d="M20 3 L35 11.5 L35 28.5 L20 37 L5 28.5 L5 11.5 Z" fill="none" stroke="#d8b46a" strokeWidth="2" />
      <path d="M20 10 C 13.5 18 13.5 24 20 31 C 26.5 24 26.5 18 20 10 Z" fill="#d8b46a" />
    </svg>
  );
}

/** Children fade in from a direction, one after another, each time a page appears. */
const In = ({ d = 0, from = "up", as: Tag = "div", children, className = "" }: { d?: number; from?: "up" | "down" | "left" | "right"; as?: ElementType; children: ReactNode; className?: string }) => (
  <Tag className={`enter from-${from} ${className}`} style={{ ["--d" as string]: `${d * 0.09}s` }}>
    {children}
  </Tag>
);

function HomePage({ go }: { go: (p: string) => void }) {
  return (
    <section className="page home">
      <div className="home-copy">
        <In from="down">
          <h1>A family holding company that buys good businesses and keeps them.</h1>
        </In>
        <In d={1} from="down">
          <p className="lead">We own {HOLDINGS.length} companies across logistics, health, software and more. Founders stay on, nothing is sold on, and decisions are made by the family whose capital it is.</p>
        </In>
        <In d={2} from="down" className="actions">
          <a className="btn" href="/fit" onClick={(e) => (e.preventDefault(), go("/fit"))}>
            See if your company fits <ArrowRight size={16} aria-hidden />
          </a>
          <a className="btn ghost" href="/portfolio" onClick={(e) => (e.preventDefault(), go("/portfolio"))}>
            Our portfolio
          </a>
        </In>
        <In d={3} from="down" className="facts">
          <div>
            <b>{HOLDINGS.length}</b>
            <span>companies owned</span>
          </div>
          <div>
            <b>1987</b>
            <span>first acquisition</span>
          </div>
          <div>
            <b>0</b>
            <span>companies sold on</span>
          </div>
        </In>
      </div>
      <In d={2} from="right" className="home-art">
        <Constellation />
      </In>
    </section>
  );
}

function ApproachPage() {
  return (
    <section className="page">
      <In from="down">
        <h1>How we own companies</h1>
        <p className="lead">Three generations, one rule: buy businesses we would be proud to keep for the next three.</p>
      </In>
      <div className="grid4">
        {PRINCIPLES.map((p, i) => (
          <In key={p.title} d={i + 1} from="up" className="panel">
            <span className="num">0{i + 1}</span>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </In>
        ))}
      </div>
      <In d={5} from="down">
        <h3 className="h3">How a sale works</h3>
      </In>
      <ol className="process">
        {PROCESS.map((s, i) => (
          <In key={s.title} d={i + 6} from="left" as="li" className="step">
            <span className="when">{s.when}</span>
            <b>{s.title}</b>
            <p>{s.text}</p>
          </In>
        ))}
      </ol>
    </section>
  );
}

function PortfolioPage() {
  const [filter, setFilter] = useState<SectorKey | "all">("all");
  const sectors = [...new Set(HOLDINGS.map((h) => h.sector))];
  const shown = HOLDINGS.filter((h) => filter === "all" || h.sector === filter);
  return (
    <section className="page">
      <In from="down">
        <h1>The companies we own</h1>
        <p className="lead">Eleven businesses, the oldest bought in 1987 and run today by its founder's son.</p>
      </In>
      <In d={1} from="down" className="chips" >
        {(["all", ...sectors] as const).map((s) => (
          <button key={s} type="button" className={`chip${filter === s ? " on" : ""}`} aria-pressed={filter === s} onClick={() => setFilter(s)}>
            {s !== "all" && <i className="sw" style={{ background: SECTOR_COLOR[s] }} />}
            {s === "all" ? "All" : s[0].toUpperCase() + s.slice(1)}
          </button>
        ))}
      </In>
      <div className="holdings">
        {shown.map((h, i) => (
          <In key={h.name} d={i + 2} from="up" className="holding">
            <div className="h-top">
              <i className="sw" style={{ background: SECTOR_COLOR[h.sector] }} />
              <span>
                {h.sector[0].toUpperCase() + h.sector.slice(1)} · since {h.since}
              </span>
            </div>
            <h3>{h.name}</h3>
            <p>{h.text}</p>
            <div className="h-meta">
              <span>{h.revenue}</span>
              <span>{h.people} people</span>
            </div>
          </In>
        ))}
      </div>
    </section>
  );
}

function FitPage() {
  return (
    <section className="page">
      <In from="down">
        <h1>Is your company a fit?</h1>
        <p className="lead">Move the numbers. We show how we would value the business and whether it is the kind of company we buy.</p>
      </In>
      <In d={1} from="up">
        <Fit />
      </In>
    </section>
  );
}

function FamilyPage() {
  const [q, setQ] = useState(0);
  const [playing, setPlaying] = useState(() => !reducedMotion());
  const [held, setHeld] = useState(false);
  // Rotates every 8 seconds unless paused, hovered or focused; picking a quote restarts the clock.
  useEffect(() => {
    if (!playing || held) return;
    const id = setTimeout(() => setQ((x) => (x + 1) % QUOTES.length), 8000);
    return () => clearTimeout(id);
  }, [q, playing, held]);
  return (
    <section className="page">
      <In from="down">
        <h1>The family and the team</h1>
        <p className="lead">Eight people work at the centre and these six lead it. Everyone else works in the companies.</p>
      </In>
      <div className="people">
        {FAMILY.map((p, i) => (
          <In key={p.name} d={i + 1} from="up" className="person">
            <span className="mono">{p.initials}</span>
            <b>{p.name}</b>
            <span>{p.role}</span>
          </In>
        ))}
      </div>
      <In d={7} from="up" className="quotes">
        <div
          onPointerEnter={() => setHeld(true)}
          onPointerLeave={() => setHeld(false)}
          onFocus={() => setHeld(true)}
          onBlur={() => setHeld(false)}
        >
        <figure key={q} className="quote">
          <blockquote>{QUOTES[q].text}</blockquote>
          <figcaption>
            <b>{QUOTES[q].name}</b>
            <span>{QUOTES[q].role}</span>
          </figcaption>
        </figure>
        <div className="dots-nav" role="group" aria-label="Quotes">
          {QUOTES.map((x, i) => (
            <button key={x.name} type="button" aria-label={`Quote from ${x.name}`} aria-pressed={i === q} className={i === q ? "on" : ""} onClick={() => setQ(i)} />
          ))}
          <button type="button" className="play" aria-label={playing ? "Pause quotes" : "Play quotes"} onClick={() => setPlaying((x) => !x)}>
            {playing ? <Pause size={13} aria-hidden /> : <Play size={13} aria-hidden />}
          </button>
        </div>
        </div>
      </In>
    </section>
  );
}

function ContactPage() {
  const [state, setState] = useState<"idle" | "sent" | "invalid">("idle");
  const [bad, setBad] = useState<string[]>([]);
  return (
    <section className="page contact">
      <In from="left">
        <h1>Talk to us</h1>
        <p className="lead">Thinking about selling, or about who should own your company next? Start with a short note. Everything stays between us.</p>
        <p className="addr">
          hello@whitmore.example
          <br />
          14 Ropewalk, York YO1 7EP
        </p>
      </In>
      <In d={1} from="right">
        <form
          className="form"
          noValidate
          onInput={() => state === "sent" && setState("idle")}
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const f = new FormData(form);
            const wrong = [
              !String(f.get("name") ?? "").trim() && "name",
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(f.get("email") ?? "")) && "email",
              !String(f.get("note") ?? "").trim() && "note",
            ].filter((x): x is string => !!x);
            setBad(wrong);
            setState(wrong.length ? "invalid" : "sent");
            if (wrong.length) form.querySelector<HTMLElement>(`[name="${wrong[0]}"]`)?.focus();
            else form.reset();
          }}
        >
          <label>
            Name
            <input name="name" autoComplete="name" aria-invalid={bad.includes("name")} aria-describedby="form-msg" />
          </label>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" aria-invalid={bad.includes("email")} aria-describedby="form-msg" />
          </label>
          <label>
            About the company
            <textarea name="note" rows={5} aria-invalid={bad.includes("note")} aria-describedby="form-msg" />
          </label>
          <button type="submit" className="btn">
            Send <ArrowRight size={16} aria-hidden />
          </button>
          <p id="form-msg" className={state === "sent" ? "ok" : "bad"} aria-live="polite">
            {state === "sent" ? "Thank you. This is a demo site, so the note was not sent anywhere." : state === "invalid" ? "Please add your name, a valid email and a line about the company." : ""}
          </p>
        </form>
      </In>
    </section>
  );
}

export default function App() {
  const [path, setPath] = useState(() => {
    const p = known(location.pathname);
    if (p !== location.pathname) history.replaceState(null, "", p);
    return p;
  });
  // One sweep at a time. The URL is the source of truth: a sweep shows whatever page the
  // URL names when the screen is covered, and if the URL moved on meanwhile (more clicks,
  // Back), another sweep follows once this one has finished.
  const running = useRef(false);
  const shown = useRef(path);
  const sync = useRef(() => {});
  sync.current = () => {
    if (running.current || known(location.pathname) === shown.current) return;
    running.current = true;
    sweep(() => {
      const p = known(location.pathname);
      shown.current = p;
      setPath(p);
    })
      .catch(() => {})
      .finally(() => {
        running.current = false;
        sync.current();
      });
  };

  useEffect(() => {
    const onPop = () => sync.current();
    addEventListener("popstate", onPop);
    return () => removeEventListener("popstate", onPop);
  }, []);

  const first = useRef(true);
  const [said, setSaid] = useState("");
  useEffect(() => {
    const title = path === "/" ? "Whitmore Family Holdings" : `${PAGES.find((p) => p.path === path)!.name} · Whitmore Family Holdings`;
    document.title = title;
    if (first.current) {
      first.current = false;
      return;
    }
    // After a page change, move focus to the new heading and say where we are.
    const h = document.querySelector<HTMLElement>("main h1");
    h?.setAttribute("tabindex", "-1");
    h?.focus({ preventScroll: true });
    setSaid(title);
  }, [path]);

  const go = (p: string) => {
    if (p !== location.pathname) history.pushState(null, "", p);
    sync.current();
  };
  const link = (p: string) => (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    go(p);
  };

  const page =
    path === "/approach" ? <ApproachPage /> : path === "/portfolio" ? <PortfolioPage /> : path === "/fit" ? <FitPage /> : path === "/family" ? <FamilyPage /> : path === "/contact" ? <ContactPage /> : <HomePage go={go} />;

  return (
    <>
      <DotField />
      <Ornaments />
      <a className="skip" href="#main">
        Skip to content
      </a>
      <p className="sr" aria-live="polite">
        {said}
      </p>
      <header className="top">
        <a className="logo" href="/" onClick={link("/")}>
          <Logo />
          Whitmore <span>Family Holdings</span>
        </a>
        <a className="btn ghost small" href="/contact" onClick={link("/contact")}>
          Talk to us
        </a>
      </header>
      <nav className="rail" aria-label="Pages">
        {PAGES.map(({ path: p, name, icon: Icon }) => (
          <a key={p} href={p} onClick={link(p)} aria-current={p === path ? "page" : undefined} aria-label={name}>
            <Icon size={19} aria-hidden />
            <span className="tip">{name}</span>
          </a>
        ))}
      </nav>
      <main key={path} id="main" tabIndex={-1}>
        {page}
      </main>
      <footer className="foot">
        An anonymised client project by tahamukhtar20. Whitmore, its companies and its people are fictional. <a href={REPO}>Source code</a>
      </footer>
      <SweepPanels />
    </>
  );
}
