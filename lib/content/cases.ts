/**
 * Case-study index. Bodies live as MDX in content/cases/<slug>.mdx following a
 * strict template (Snapshot → Origin → Insight → What They Built → The Build →
 * Design → GTM → The Money → Key Decisions → What To Steal → Sources).
 */
export type CaseSector =
  | "Fintech"
  | "Marketplace"
  | "Design tools"
  | "Productivity";

export type CaseMeta = {
  slug: string;
  company: string;
  sector: CaseSector;
  era: string;
  oneLiner: string;
};

export const CASE_INDEX: CaseMeta[] = [
  {
    slug: "stripe",
    company: "Stripe",
    sector: "Fintech",
    era: "2010s",
    oneLiner: "Seven lines of code that swallowed online payments.",
  },
  {
    slug: "airbnb",
    company: "Airbnb",
    sector: "Marketplace",
    era: "2000s",
    oneLiner: "Air mattresses and cereal boxes to a hospitality giant.",
  },
  {
    slug: "figma",
    company: "Figma",
    sector: "Design tools",
    era: "2010s",
    oneLiner: "Four quiet years building design in the browser.",
  },
  {
    slug: "notion",
    company: "Notion",
    sector: "Productivity",
    era: "2010s",
    oneLiner: "A near-bankrupt rebuild in Kyoto became a $10B tool.",
  },
];

export const CASE_SECTORS: CaseSector[] = [
  "Fintech",
  "Marketplace",
  "Design tools",
  "Productivity",
];

export function findCaseMeta(slug: string): CaseMeta | undefined {
  return CASE_INDEX.find((c) => c.slug === slug);
}
