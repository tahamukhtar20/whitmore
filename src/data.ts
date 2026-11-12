// The site's content. Whitmore, its companies and its people are fictional.
export type SectorKey = "software" | "health" | "logistics" | "consumer" | "industrial";
export const SECTOR_COLOR: Record<SectorKey, string> = {
  software: "#d8b46a",
  health: "#5fb3a1",
  logistics: "#8aa4d6",
  consumer: "#d98c6f",
  industrial: "#a9a3c9",
};

export type Holding = { name: string; sector: SectorKey; since: number; revenue: string; people: number; size: number; text: string };
export const HOLDINGS: Holding[] = [
  { name: "Brackwater Freight", sector: "logistics", since: 1987, revenue: "$60–80m", people: 410, size: 30, text: "Regional road freight across the north of England, with its own depots and a booking system its customers use daily." },
  { name: "Northgate Storage", sector: "logistics", since: 2008, revenue: "$30–40m", people: 220, size: 24, text: "Climate-controlled warehousing for food and pharmaceutical suppliers." },
  { name: "Ashby Foods", sector: "consumer", since: 2004, revenue: "$40–50m", people: 260, size: 26, text: "Bakery goods for independent cafés, made in two kitchens and delivered before 7 a.m." },
  { name: "Sorrel Health", sector: "health", since: 2016, revenue: "$20–30m", people: 180, size: 24, text: "Physiotherapy and rehabilitation clinics, with shared scheduling across 22 locations." },
  { name: "Fernway Clinics", sector: "health", since: 2019, revenue: "$10–20m", people: 120, size: 20, text: "Community dental practices in towns with too few dentists." },
  { name: "Coastal Labs", sector: "health", since: 2021, revenue: "$5–10m", people: 60, size: 17, text: "Diagnostic testing for veterinary practices, results within a day." },
  { name: "Quarry", sector: "software", since: 2015, revenue: "$10–20m", people: 90, size: 22, text: "Fleet maintenance software that schedules repairs before vehicles break down." },
  { name: "Inkwell", sector: "software", since: 2018, revenue: "$5–10m", people: 45, size: 18, text: "Contract management for small law firms, priced per seat and loved by paralegals." },
  { name: "Brightline", sector: "software", since: 2020, revenue: "$5–10m", people: 40, size: 16, text: "Rota and payroll for restaurants, built by a former chef." },
  { name: "Ardent Tools", sector: "industrial", since: 1996, revenue: "$20–30m", people: 150, size: 22, text: "Precision hand tools for aircraft maintenance crews." },
  { name: "Tessera", sector: "industrial", since: 2023, revenue: "$5–10m", people: 35, size: 15, text: "Tile and stone cutting machines, the newest company in the family." },
];

export const PRINCIPLES = [
  { title: "We buy to keep", text: "We have never sold a company. Owners who sell to us know where the business will be in twenty years." },
  { title: "Founders stay on", text: "Most founders keep running their companies, with a share of the profits and fewer reports to write." },
  { title: "Patient capital", text: "The money is the family's own, so there is no fund deadline and no pressure to sell in five years." },
  { title: "Light at the centre", text: "Eight people at Whitmore. Finance, hiring help and a phone number for hard days; the rest stays with each company." },
];

export const PROCESS = [
  { when: "Week 1", title: "First conversation", text: "An hour on the phone. If it is not a fit, we say so the same day and suggest who might be." },
  { when: "Weeks 2–4", title: "Indicative offer", text: "A one-page letter with a price range and how we would pay it, based on three years of accounts." },
  { when: "Weeks 5–12", title: "Due diligence", text: "Our accountants and lawyers, in a shared folder, with a weekly call so nothing surprises anyone." },
  { when: "Week 13", title: "Completion", text: "Contracts signed, payment made, and a lunch with the team on the first Monday." },
];

export const FAMILY = [
  { name: "Eleanor Whitmore", role: "Chair, second generation", initials: "EW" },
  { name: "James Whitmore", role: "Chief executive", initials: "JW" },
  { name: "Priya Whitmore-Shah", role: "Head of acquisitions", initials: "PW" },
  { name: "Daniel Okoye", role: "Finance director", initials: "DO" },
  { name: "Ruth Hargreaves", role: "Operating partner, logistics", initials: "RH" },
  { name: "Marcus Lee", role: "Operating partner, software", initials: "ML" },
];

export const QUOTES = [
  { text: "Two private equity firms offered more. Whitmore was the only one that asked what the business would look like when my daughter took it over.", name: "Graham Ashby", role: "Founder, Ashby Foods" },
  { text: "Our first board meeting after the sale was about hiring more physiotherapists, not cutting them.", name: "Dr. Leila Haddad", role: "Founder, Sorrel Health" },
  { text: "I still run Quarry. The difference is that when a big customer pays late, I do not lie awake about payroll.", name: "Tom Briggs", role: "Founder, Quarry" },
];
