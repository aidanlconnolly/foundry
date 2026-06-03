import type { Stage } from "./types";

/**
 * The "Zero to Scale" spine — 8 stages. Lesson bodies are authored as MDX in
 * content/lessons/<slug>.mdx. Keep slugs stable: progress + flashcards key off
 * them.
 */
export const STAGES: Stage[] = [
  {
    slug: "foundations",
    index: 0,
    title: "Founder Foundations",
    tagline: "What a startup is, the modern landscape, and whether to start.",
    lessons: [
      {
        slug: "what-is-a-startup",
        title: "What a startup actually is",
        objective:
          "Separate a startup from a small business, lifestyle business, and SMB — and why the distinction governs everything.",
        minutes: 7,
      },
      {
        slug: "startup-taxonomy",
        title: "A taxonomy of startup types",
        objective:
          "Map the major startup archetypes — SaaS, marketplace, consumer, deep tech, fintech, vertical AI, dev tools, hardware, biotech, ETA.",
        minutes: 18,
      },
      {
        slug: "why-now-ai-era",
        title: "The 'why now' lens & the AI-era landscape",
        objective:
          "Use the 'why now' test and understand how AI reshaped what's buildable in 2026.",
        minutes: 8,
      },
      {
        slug: "founder-readiness",
        title: "Founder readiness & the cost of starting",
        objective:
          "Assess motivation, risk tolerance, and the real opportunity cost before you commit.",
        minutes: 7,
      },
    ],
  },
  {
    slug: "ideas",
    index: 1,
    title: "Ideas & Opportunity",
    tagline: "Where good ideas come from and how to judge them.",
    lessons: [
      {
        slug: "where-ideas-come-from",
        title: "Where good ideas come from",
        objective:
          "Problem-first vs solution-first, and how to 'live in the future' so the gaps become obvious.",
        minutes: 8,
      },
      {
        slug: "idea-quality-frameworks",
        title: "Idea quality frameworks",
        objective:
          "Score an idea on problem severity, frequency, TAM/SAM/SOM, 'why now,' and founder–market fit.",
        minutes: 10,
        tool: { href: "/toolkit#idea-scorecard", label: "Idea Scorecard" },
      },
      {
        slug: "idea-traps",
        title: "Idea traps to avoid",
        objective:
          "Vitamins vs painkillers, tarpit ideas, and fake markets — the patterns that look good and aren't.",
        minutes: 7,
      },
    ],
  },
  {
    slug: "validation",
    index: 2,
    title: "Customer Discovery & Validation",
    tagline: "Talk to users, validate the problem, build the smallest test.",
    lessons: [
      {
        slug: "talking-to-users",
        title: "Talking to users without lying to yourself",
        objective:
          "Run Mom-Test interviews that surface truth instead of polite encouragement.",
        minutes: 9,
      },
      {
        slug: "validate-before-building",
        title: "Validating the problem before you build",
        objective:
          "Confirm the problem is real, frequent, and painful before writing code.",
        minutes: 7,
      },
      {
        slug: "mvp-archetypes",
        title: "MVP archetypes",
        objective:
          "Landing page, concierge, Wizard-of-Oz, and single-feature MVPs — when to use each.",
        minutes: 8,
      },
      {
        slug: "design-and-prototype-fast",
        title: "Design & prototype fast",
        objective:
          "Go from idea to a credible prototype in days with Figma, v0, and Framer.",
        minutes: 8,
      },
      {
        slug: "reading-the-signal",
        title: "Reading the signal",
        objective:
          "Distinguish real validation from vanity signals and false positives.",
        minutes: 6,
      },
    ],
  },
  {
    slug: "building",
    index: 3,
    title: "Building the Product",
    tagline: "The modern, AI-native build: stack, speed, and who builds it.",
    lessons: [
      {
        slug: "modern-stack-choices",
        title: "Modern stack choices",
        objective:
          "When to go no-code vs custom, and the AI-native default stack for 2026.",
        minutes: 9,
        tool: { href: "/tools", label: "Tool Directory" },
      },
      {
        slug: "ai-assisted-building",
        title: "AI-assisted building",
        objective:
          "How Cursor, Claude Code, v0, and Lovable compress build timelines from months to days.",
        minutes: 9,
      },
      {
        slug: "founding-engineer-vs-cofounder",
        title: "Founding engineer vs technical co-founder vs agency",
        objective:
          "Choose how the product actually gets built — and what each choice costs you.",
        minutes: 8,
      },
      {
        slug: "realistic-build-timelines",
        title: "Realistic build timelines",
        objective:
          "What idea → MVP → first users actually takes, with concrete examples.",
        minutes: 7,
      },
    ],
  },
  {
    slug: "team",
    index: 4,
    title: "Team & Operating Models",
    tagline: "Roles, the most common compositions, equity, and hiring order.",
    lessons: [
      {
        slug: "startup-roles-defined",
        title: "The roles, defined",
        objective:
          "Founder/CEO, co-founder/CTO, founding engineer, founding designer, first GTM hire, the 'first 10'.",
        minutes: 8,
      },
      {
        slug: "operating-models",
        title: "Operating models that work",
        objective:
          "Solo + contractors, 2 technical co-founders, biz+technical pair, hub-and-spoke — and the most common composition.",
        minutes: 9,
      },
      {
        slug: "equity-and-comp",
        title: "Equity & comp for early teams",
        objective:
          "Founder splits, option pools, and vesting — get the basics right before they calcify.",
        minutes: 8,
      },
      {
        slug: "hiring-progression",
        title: "The hiring progression",
        objective:
          "What to hire and when: first eng → first GTM → first ops → first manager.",
        minutes: 8,
      },
      {
        slug: "where-mbas-add-leverage",
        title: "Where consultants & MBAs add leverage",
        objective:
          "Where a business founder is decisive — and where they get in the way.",
        minutes: 6,
      },
    ],
  },
  {
    slug: "gtm",
    index: 5,
    title: "Go-to-Market & Traction",
    tagline: "Pick a motion, build growth loops, measure what matters.",
    lessons: [
      {
        slug: "gtm-motions",
        title: "GTM motions",
        objective:
          "Product-led, sales-led, community-led — how to choose the right motion for your product.",
        minutes: 9,
      },
      {
        slug: "early-traction-growth-loops",
        title: "Early traction & growth loops",
        objective:
          "The 'do things that don't scale' phase and how to engineer compounding loops.",
        minutes: 8,
      },
      {
        slug: "metrics-by-stage",
        title: "Metrics by stage",
        objective:
          "North-star, activation, retention, CAC/LTV, burn, runway, and default-alive.",
        minutes: 9,
      },
      {
        slug: "gtm-software-stack",
        title: "The GTM software stack",
        objective:
          "Analytics, CRM, lifecycle, and attribution tools that let a tiny team scale.",
        minutes: 7,
        tool: { href: "/tools", label: "Tool Directory" },
      },
    ],
  },
  {
    slug: "fundraising",
    index: 6,
    title: "Fundraising & VCs",
    tagline: "How venture really works, the rounds, the math, the process.",
    lessons: [
      {
        slug: "how-vc-works",
        title: "How VC actually works",
        objective:
          "Fund structure, LPs, the power law, and why VCs need outsized outcomes.",
        minutes: 10,
      },
      {
        slug: "the-rounds-ladder",
        title: "The rounds & the ladder",
        objective:
          "Pre-seed → seed → A → B → growth: what each round expects of you.",
        minutes: 9,
      },
      {
        slug: "the-2026-landscape",
        title: "The current landscape (2026)",
        objective:
          "AI concentration, the bifurcated 'barbell' market, and what's getting funded vs starved.",
        minutes: 8,
        tool: { href: "/vc-landscape", label: "VC Landscape" },
      },
      {
        slug: "instruments-and-math",
        title: "Instruments & the math",
        objective:
          "SAFEs, priced rounds, valuation, dilution, cap tables, option pools, liquidation preferences, pro rata.",
        minutes: 11,
        tool: { href: "/toolkit#cap-table", label: "Cap-table calculator" },
      },
      {
        slug: "the-raise-process",
        title: "Running the raise",
        objective:
          "Build a pipeline, the deck, the data room, run a tight process, and close.",
        minutes: 9,
      },
      {
        slug: "fundraising-alternatives",
        title: "Alternatives to VC",
        objective:
          "Bootstrapping, revenue-based financing, angels, accelerators, grants, and ETA.",
        minutes: 7,
      },
    ],
  },
  {
    slug: "scaling",
    index: 7,
    title: "Scaling & Beyond",
    tagline: "Scale the org without killing the magic — and how it ends.",
    lessons: [
      {
        slug: "scaling-org-and-process",
        title: "Scaling org, ops & process",
        objective:
          "Add structure and process without smothering the speed that got you here.",
        minutes: 8,
      },
      {
        slug: "series-b-plus-dynamics",
        title: "Series B+ dynamics",
        objective:
          "How growth-stage capital and expectations change the company.",
        minutes: 7,
      },
      {
        slug: "exits-and-secondaries",
        title: "Exits & secondaries",
        objective:
          "M&A, IPO, and the rise of secondaries for early liquidity.",
        minutes: 8,
      },
      {
        slug: "failure-and-second-acts",
        title: "Failure, resilience & second acts",
        objective:
          "What happens when it doesn't work — and why founders come back.",
        minutes: 6,
      },
    ],
  },
];
