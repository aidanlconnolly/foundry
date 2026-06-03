/**
 * Founder Tool Directory. Stable, well-known tools founders use to build and
 * scale. `stage` is the earliest point it's usually worth adopting.
 * `goodDefault` flags the safe, common pick in its category.
 */
export type ToolCategory =
  | "Build / Dev"
  | "Design"
  | "GTM / Growth"
  | "Ops / Collab"
  | "Finance / Legal"
  | "AI infra";

export type ToolStage = "idea" | "mvp" | "revenue" | "scaling";

export type Tool = {
  name: string;
  category: ToolCategory;
  whatFor: string;
  stage: ToolStage;
  goodDefault?: boolean;
  url: string;
};

export const STAGE_LABEL: Record<ToolStage, string> = {
  idea: "Idea",
  mvp: "MVP",
  revenue: "First revenue",
  scaling: "Scaling",
};

export const TOOLS: Tool[] = [
  // ── Build / Dev ──
  { name: "Cursor", category: "Build / Dev", whatFor: "AI-native code editor — the default way founders ship code fast.", stage: "mvp", goodDefault: true, url: "https://cursor.com" },
  { name: "Claude Code", category: "Build / Dev", whatFor: "Agentic coding in the terminal/IDE — build and refactor whole features.", stage: "mvp", goodDefault: true, url: "https://claude.com/claude-code" },
  { name: "v0", category: "Build / Dev", whatFor: "Generate React/Tailwind UI from prompts — fast front-end scaffolding.", stage: "mvp", url: "https://v0.app" },
  { name: "Vercel", category: "Build / Dev", whatFor: "Deploy front-ends and serverless functions with zero-config CI/CD.", stage: "mvp", goodDefault: true, url: "https://vercel.com" },
  { name: "Supabase", category: "Build / Dev", whatFor: "Postgres + auth + storage as a managed backend. Generous free tier.", stage: "mvp", goodDefault: true, url: "https://supabase.com" },
  { name: "Neon / Turso", category: "Build / Dev", whatFor: "Serverless Postgres (Neon) / libSQL (Turso) — cheap, scalable databases.", stage: "mvp", url: "https://neon.tech" },
  { name: "GitHub", category: "Build / Dev", whatFor: "Source control, CI, and code review. Non-negotiable from day one.", stage: "idea", goodDefault: true, url: "https://github.com" },
  { name: "Linear", category: "Build / Dev", whatFor: "Fast issue tracking and project management built for product teams.", stage: "mvp", goodDefault: true, url: "https://linear.app" },

  // ── Design ──
  { name: "Figma", category: "Design", whatFor: "Collaborative product + UI design and prototyping. The industry standard.", stage: "idea", goodDefault: true, url: "https://figma.com" },
  { name: "Framer", category: "Design", whatFor: "Design and publish marketing sites and prototypes without code.", stage: "idea", url: "https://framer.com" },
  { name: "Spline", category: "Design", whatFor: "3D design for the web — hero visuals and interactive scenes.", stage: "revenue", url: "https://spline.design" },

  // ── GTM / Growth ──
  { name: "PostHog", category: "GTM / Growth", whatFor: "Product analytics, session replay, and feature flags in one tool.", stage: "mvp", goodDefault: true, url: "https://posthog.com" },
  { name: "Segment", category: "GTM / Growth", whatFor: "Customer-data pipeline — collect once, route events everywhere.", stage: "revenue", url: "https://segment.com" },
  { name: "Attio", category: "GTM / Growth", whatFor: "Modern, flexible CRM for early sales and relationship tracking.", stage: "revenue", goodDefault: true, url: "https://attio.com" },
  { name: "HubSpot", category: "GTM / Growth", whatFor: "All-in-one CRM, marketing, and email — scales with the GTM team.", stage: "scaling", url: "https://hubspot.com" },
  { name: "Customer.io", category: "GTM / Growth", whatFor: "Lifecycle messaging and automated email/push based on behavior.", stage: "revenue", url: "https://customer.io" },
  { name: "Webflow", category: "GTM / Growth", whatFor: "Visual website builder for marketing pages and CMS-driven content.", stage: "idea", url: "https://webflow.com" },

  // ── Ops / Collab ──
  { name: "Notion", category: "Ops / Collab", whatFor: "Docs, wiki, and lightweight databases — the company's brain.", stage: "idea", goodDefault: true, url: "https://notion.so" },
  { name: "Slack", category: "Ops / Collab", whatFor: "Team chat and integrations hub. Default once you're more than two.", stage: "mvp", goodDefault: true, url: "https://slack.com" },
  { name: "Loom", category: "Ops / Collab", whatFor: "Async video — record walkthroughs instead of scheduling meetings.", stage: "mvp", url: "https://loom.com" },
  { name: "Granola", category: "Ops / Collab", whatFor: "AI meeting notes that capture and structure calls automatically.", stage: "revenue", url: "https://granola.ai" },

  // ── Finance / Legal ──
  { name: "Stripe", category: "Finance / Legal", whatFor: "Payments and billing. The default way to charge customers online.", stage: "mvp", goodDefault: true, url: "https://stripe.com" },
  { name: "Mercury", category: "Finance / Legal", whatFor: "Startup banking with a clean dashboard, cards, and treasury.", stage: "mvp", goodDefault: true, url: "https://mercury.com" },
  { name: "Ramp", category: "Finance / Legal", whatFor: "Corporate cards plus spend management and automated bookkeeping.", stage: "revenue", url: "https://ramp.com" },
  { name: "Brex", category: "Finance / Legal", whatFor: "Corporate cards and spend controls aimed at venture-backed startups.", stage: "revenue", url: "https://brex.com" },
  { name: "Carta / Pulley", category: "Finance / Legal", whatFor: "Cap-table management, equity grants, and 409A valuations.", stage: "revenue", goodDefault: true, url: "https://carta.com" },
  { name: "Stripe Atlas / Clerky", category: "Finance / Legal", whatFor: "Incorporate a Delaware C-corp and handle founder paperwork properly.", stage: "idea", goodDefault: true, url: "https://stripe.com/atlas" },

  // ── AI infra ──
  { name: "Anthropic API", category: "AI infra", whatFor: "Claude models for reasoning, agents, and product features.", stage: "mvp", goodDefault: true, url: "https://docs.claude.com" },
  { name: "OpenAI API", category: "AI infra", whatFor: "GPT models and tooling for AI product features.", stage: "mvp", url: "https://platform.openai.com" },
  { name: "Hugging Face", category: "AI infra", whatFor: "Open models, datasets, and inference endpoints.", stage: "revenue", url: "https://huggingface.co" },
  { name: "LangChain / LlamaIndex", category: "AI infra", whatFor: "Frameworks for RAG, agents, and orchestrating LLM apps.", stage: "mvp", url: "https://www.llamaindex.ai" },
  { name: "Pinecone", category: "AI infra", whatFor: "Managed vector database for semantic search and retrieval.", stage: "revenue", url: "https://pinecone.io" },
];

/** Curated starter stacks by stage (names reference TOOLS entries). */
export const STARTER_STACKS: Record<ToolStage, string[]> = {
  idea: ["Figma", "Notion", "GitHub", "Stripe Atlas / Clerky"],
  mvp: ["Cursor", "Claude Code", "Vercel", "Supabase", "Linear", "Stripe", "Mercury"],
  revenue: ["PostHog", "Attio", "Customer.io", "Ramp", "Carta / Pulley"],
  scaling: ["Segment", "HubSpot", "Brex", "Slack"],
};

export const TOOL_CATEGORIES: ToolCategory[] = [
  "Build / Dev",
  "Design",
  "GTM / Growth",
  "Ops / Collab",
  "Finance / Legal",
  "AI infra",
];
