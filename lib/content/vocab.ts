/**
 * The seed "Founder Vocabulary" deck. Concise, accurate definitions of the
 * terms a founder hits constantly. Loaded into a user's review deck on request.
 */
export const FOUNDER_VOCAB: Array<{ term: string; definition: string }> = [
  {
    term: "TAM / SAM / SOM",
    definition:
      "Total Addressable Market (all spend on the problem) / Serviceable Available Market (what you could serve) / Serviceable Obtainable Market (what you can realistically win near-term).",
  },
  {
    term: "SAFE",
    definition:
      "Simple Agreement for Future Equity. A YC instrument: an investor gives cash now for the right to equity at the next priced round, usually via a valuation cap and/or discount. No interest or maturity date.",
  },
  {
    term: "Priced round",
    definition:
      "A financing where investors buy shares at an agreed per-share price, setting an explicit valuation — unlike a SAFE or note, which defer pricing.",
  },
  {
    term: "Pre-money / Post-money",
    definition:
      "Pre-money is the company's value before new investment; post-money = pre-money + the amount raised. Your dilution is (amount raised ÷ post-money).",
  },
  {
    term: "Valuation cap",
    definition:
      "On a SAFE/note, the maximum valuation at which the investor's money converts to equity — protecting early investors if the priced round is much higher.",
  },
  {
    term: "ARR / MRR",
    definition:
      "Annual / Monthly Recurring Revenue. The normalized subscription revenue run-rate. ARR ≈ MRR × 12. The headline metric for most SaaS.",
  },
  {
    term: "Dilution",
    definition:
      "The reduction in your ownership percentage when new shares are issued (in a raise or option-pool top-up). You own a smaller slice of a (hopefully) bigger pie.",
  },
  {
    term: "Option pool",
    definition:
      "Shares set aside to grant employees. Often created/expanded pre-round, which dilutes founders (the 'option pool shuffle') before new money comes in.",
  },
  {
    term: "Vesting / Cliff",
    definition:
      "Equity earned over time (typically 4 years) with a 1-year 'cliff' — nothing vests until month 12, then monthly. Protects the cap table if someone leaves early.",
  },
  {
    term: "Liquidation preference",
    definition:
      "What investors get paid before common shareholders in an exit. '1× non-participating' (the standard) returns their money first; participating or >1× preferences take more.",
  },
  {
    term: "Pro rata",
    definition:
      "An investor's right to invest in later rounds to maintain their ownership percentage. Coveted by early investors backing winners.",
  },
  {
    term: "Cap table",
    definition:
      "The capitalization table: who owns what — founders, employees (option pool), and investors — by share count and percentage.",
  },
  {
    term: "Carried interest (carry)",
    definition:
      "A VC's share of fund profits (typically 20%), paid only after LPs get their committed capital back. The main way VCs get rich.",
  },
  {
    term: "Power law",
    definition:
      "Venture returns are wildly skewed: ~75% of startups never return capital while the top ~10% drive 60–80% of returns. A few huge winners carry the fund.",
  },
  {
    term: "Term sheet",
    definition:
      "The non-binding summary of a financing's key terms (valuation, board, preferences, pro rata). Signing it kicks off due diligence and definitive docs.",
  },
  {
    term: "Burn rate / Runway",
    definition:
      "Burn = net cash spent per month. Runway = cash ÷ burn = months until you're out of money. The two numbers a founder should always know.",
  },
  {
    term: "Default alive",
    definition:
      "Paul Graham's test: would you reach profitability on current cash and growth before running out? If yes you're 'default alive'; if no, 'default dead.'",
  },
  {
    term: "CAC / LTV",
    definition:
      "Customer Acquisition Cost vs. Lifetime Value. A healthy rule of thumb is LTV:CAC ≥ 3 and CAC payback under ~12 months.",
  },
  {
    term: "Churn",
    definition:
      "The rate customers (logo churn) or revenue (revenue churn) leave per period. Negative net revenue churn — expansion outpacing losses — is elite.",
  },
  {
    term: "North-star metric",
    definition:
      "The single number that best captures delivered customer value (e.g. nights booked, messages sent). Aligns the team and predicts growth.",
  },
  {
    term: "PLG (Product-Led Growth)",
    definition:
      "A GTM motion where the product itself drives acquisition, conversion, and expansion (free tier, self-serve, viral loops) rather than a sales team.",
  },
  {
    term: "Product–market fit (PMF)",
    definition:
      "When a product satisfies a strong market demand — you feel pull instead of push: usage, retention, and word-of-mouth accelerate on their own.",
  },
  {
    term: "Founder–market fit",
    definition:
      "The unfair advantage you specifically have for this market — domain insight, distribution, or credibility a generic team lacks.",
  },
  {
    term: "MVP",
    definition:
      "Minimum Viable Product: the smallest build that tests your riskiest assumption with real users. Archetypes: landing page, concierge, Wizard-of-Oz, single-feature.",
  },
  {
    term: "Pre-seed / Seed",
    definition:
      "The earliest institutional rounds. Pre-seed funds finding PMF; seed funds the early evidence of it. Increasingly blurred, often raised on SAFEs.",
  },
  {
    term: "Series A",
    definition:
      "The first big priced round, typically led by a VC who takes a board seat. The bar in 2026 is real, repeatable revenue and efficient growth — not just a story.",
  },
  {
    term: "Bridge round",
    definition:
      "A small interim raise (often a SAFE/note) to extend runway between priced rounds — sometimes a sign of strength (insider conviction), sometimes of struggle.",
  },
  {
    term: "Secondaries",
    definition:
      "Sale of existing shares (founder/employee/early investor) to another buyer, providing liquidity without an exit. Increasingly common at growth stage.",
  },
];
