/**
 * Seeded VC-landscape snapshot. Renders instantly with a "Last verified" date;
 * Phase 5 adds an AI "Refresh landscape" action that produces the same shape
 * and caches it in vc_snapshots. Figures verified via web search — see sources.
 *
 * NOT investment advice. Informational only.
 */
export type VcSnapshot = {
  verified: string;
  headline: string;
  stats: Array<{ label: string; value: string; sub: string }>;
  /** AI's share of global VC over time (%) — for the trend chart. */
  aiShareTrend: Array<{ period: string; pct: number }>;
  /** Q1 2026 capital concentration, in $B raised. */
  concentration: Array<{ name: string; value: number }>;
  themes: Array<{ title: string; body: string }>;
  hot: string[];
  cold: string[];
  firms: Array<{ name: string; stage: string; focus: string }>;
  sources: Array<{ label: string; url: string }>;
};

export const SEED_SNAPSHOT: VcSnapshot = {
  verified: "2026-06-02",
  headline:
    "Venture is booming on paper and brutally concentrated underneath. AI is no longer a sector — it's the market — and a handful of frontier labs are absorbing the majority of all dollars.",
  stats: [
    {
      label: "2025 global VC",
      value: "~$425B",
      sub: "+30% YoY (from ~$328B in 2024) — Crunchbase; OECD ~$427B",
    },
    {
      label: "AI share of 2025 VC",
      value: "61%",
      sub: "$258.7B of $427B (OECD) — up from ~30% in 2022",
    },
    {
      label: "Q1 2026 global VC",
      value: "~$300B",
      sub: "record quarter; AI ≈ 80% of all dollars",
    },
    {
      label: "Top-3 labs, Q1 2026",
      value: "67%",
      sub: "OpenAI + Anthropic + xAI = ~67% of all VC dollars",
    },
  ],
  aiShareTrend: [
    { period: "2022", pct: 30 },
    { period: "2023", pct: 38 },
    { period: "2024", pct: 48 },
    { period: "2025", pct: 61 },
    { period: "Q1 2026", pct: 80 },
  ],
  concentration: [
    { name: "OpenAI", value: 122 },
    { name: "Anthropic", value: 30 },
    { name: "xAI", value: 20 },
    { name: "Waymo", value: 16 },
    { name: "Everyone else", value: 84 },
  ],
  themes: [
    {
      title: "AI is the whole market",
      body: "By OECD's count AI took 61% of global venture dollars in 2025 ($258.7B), and roughly 80% in Q1 2026. AI is no longer a category you compare against SaaS or fintech — it's the dominant context for everything being funded.",
    },
    {
      title: "The barbell: mega-rounds at the top, active seed at the bottom",
      body: "Capital is piling into a few foundational labs and into early-stage bets, while the middle — the classic Series A — is squeezed. To raise an A in 2026 you increasingly need to look like a former growth company: real, repeatable revenue and efficient growth, not just a promising story.",
    },
    {
      title: "Extreme concentration",
      body: "In Q1 2026, OpenAI ($122B), Anthropic ($30B) and xAI ($20B) alone took ~67% of all venture dollars; add Waymo ($16B) and four companies absorbed ~65% of global investment ($188B). The remaining ~$84B was spread thin across 1,500+ deals.",
    },
    {
      title: "New capital sources",
      body: "Much of the mega-round money now comes from sovereign wealth funds and corporates seeking pre-IPO equity in companies they believe will be foundational — a structural shift from traditional LP-funded venture.",
    },
    {
      title: "Liquidity is thawing",
      body: "The IPO window is reopening and secondaries are increasingly used to give founders and early employees liquidity without waiting for an exit.",
    },
  ],
  hot: [
    "Foundational AI / frontier labs",
    "Vertical & applied AI (agents, coding, healthcare, legal)",
    "AI infrastructure & inference",
    "Defense & 'hard tech'",
    "Robotics & autonomy",
  ],
  cold: [
    "Undifferentiated SaaS without an AI story",
    "Consumer social",
    "Cash-burning, pre-revenue Series A",
    "Crypto/web3 (outside niche pockets)",
  ],
  firms: [
    { name: "Y Combinator", stage: "Pre-seed / Accelerator", focus: "Batch program; the default early on-ramp" },
    { name: "First Round Capital", stage: "Seed", focus: "Seed specialist (Josh Kopelman — Wharton MBA)" },
    { name: "Andreessen Horowitz (a16z)", stage: "Seed → Growth", focus: "Multi-stage; deep AI, fintech, bio, crypto" },
    { name: "Sequoia Capital", stage: "Seed → Growth", focus: "Multi-stage; generational franchise builder" },
    { name: "Founders Fund", stage: "Seed → Growth", focus: "Contrarian, hard-tech and defense friendly" },
    { name: "Thrive Capital", stage: "Early → Growth", focus: "Concentrated bets; large in frontier AI" },
    { name: "Greenoaks", stage: "Growth", focus: "High-conviction growth; major AI positions" },
    { name: "General Catalyst", stage: "Seed → Growth", focus: "Multi-stage; healthcare and 'global resilience'" },
    { name: "Lightspeed", stage: "Seed → Growth", focus: "Multi-stage enterprise + consumer" },
    { name: "Index Ventures", stage: "Seed → Growth", focus: "Transatlantic, broad sector coverage" },
    { name: "Lux Capital", stage: "Seed → Growth", focus: "Deep tech, science, defense" },
    { name: "Khosla Ventures", stage: "Seed → Growth", focus: "Early-stage hard tech and AI" },
  ],
  sources: [
    { label: "Crunchbase — Global venture funding 2025", url: "https://news.crunchbase.com/venture/funding-data-third-largest-year-2025/" },
    { label: "OECD — AI firms capture 61% of global VC in 2025", url: "https://www.oecd.org/en/about/news/announcements/2026/02/ai-firms-capture-61-percent-of-global-venture-capital-in-2025.html" },
    { label: "PitchBook — Q1 2026 AI funding & 67% concentration", url: "https://pitchbook.com/news/articles/q1-2026-ai-funding-blows-past-2025-total-with-three-deals-accounting-for-67-of-capital" },
    { label: "Crunchbase — Q1 2026 record funding", url: "https://news.crunchbase.com/venture/record-breaking-funding-ai-global-q1-2026/" },
  ],
};
