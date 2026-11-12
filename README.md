# Whitmore Family Holdings

Website for a fictional family holding company that buys small and mid-sized businesses and keeps them. It is an anonymised rebuild of a client project by tahamukhtar20; the company, its holdings and its people are invented.

Live: https://whitmore.tahamukhtar.com

## What is on it

- Page changes with three panels sweeping across the screen. Navigation is queued, so fast clicks and the Back button never overlap.
- A background of drifting dots that link up with lines and react to the mouse, with soft orbs and turning rings behind.
- The portfolio as a constellation: companies orbit the Whitmore mark on two rings, sized by revenue and coloured by sector. Hover, focus or tap one to see its details.
- "Is your company a fit?": sliders for sector, revenue, margin, growth and recurring revenue give an indicative valuation from three methods (sector EBITDA multiples, revenue multiples and a five-year discounted cash flow) and a verdict against the firm's buying rules.
- Portfolio filter, family page with a quote carousel (pausable), and a demo contact form that sends nothing.
- Respects reduced motion: the dots are drawn once and pages switch without the sweep.

## Stack

Vite, React 18 and TypeScript, with lucide-react icons. The valuation logic is plain TypeScript in `src/lib/valuation.ts`, tested with Node's built-in test runner. Served as static assets from a Cloudflare Worker.

## Run it

```bash
npm install
npm run dev      # http://localhost:4490
npm test
npm run build
npx wrangler deploy
```

## License

MIT
