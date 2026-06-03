/**
 * Wharton entrepreneurship playbook. Program details verified via Venture Lab
 * (venturelab.upenn.edu) and Penn Today, June 2026. Course numbers are
 * intentionally omitted/representative — check the live course catalog.
 */
export const WHARTON_VERIFIED = "2026-06-02";

export type Program = {
  name: string;
  what: string;
  detail: string;
  url: string;
};

export const PROGRAMS: Program[] = [
  {
    name: "Venture Lab (Tangen Hall)",
    what: "The hub for Penn/Wharton entrepreneurship",
    detail:
      "A Wharton + Penn Engineering partnership housed in Tangen Hall — a 7-story, ~68,000 sq ft building with incubator and maker space and a 'Founder Floor' of co-working desks. Vice Dean of Entrepreneurship: Lori Rosenkopf.",
    url: "https://venturelab.upenn.edu/",
  },
  {
    name: "Venture Initiation Program (VIP)",
    what: "Founder-first incubator",
    detail:
      "Three offerings: the VIP Incubator (build/test/grow on campus), plus VIP-X PHL and VIP-X SF accelerator tracks. The default place to start once you have an idea you want to build.",
    url: "https://venturelab.upenn.edu/venture-initiation-program",
  },
  {
    name: "VIP-X (PHL & SF)",
    what: "Accelerator",
    detail:
      "Cohort accelerator with a San Francisco track (VIP-X SF) and a Philadelphia track (VIP-X PHL) for ventures ready to move faster with mentorship and resources.",
    url: "https://venturelab.upenn.edu/VIP-X",
  },
  {
    name: "Startup Challenge",
    what: "Flagship pitch competition",
    detail:
      "Venture Lab's flagship event — the 2026 edition was the 10th annual, awarding $200K+ in prizes including the $75,000 Perlman Grand Prize. Evolved from the original Wharton Business Plan Competition.",
    url: "https://venturelab.upenn.edu/startup-challenge",
  },
  {
    name: "Perlman ETA Fellowship",
    what: "Up to $50K, non-dilutive",
    detail:
      "For final-year Penn/Wharton master's and PhD students pursuing entrepreneurship through acquisition (buying and running a business after graduation). Award $25K–$50K, non-dilutive. Funded by a $10M gift from Ellen Hanson & Richard Perlman (W'68); a paired ETA Incubator pilot also runs.",
    url: "https://venturelab.upenn.edu/ETA",
  },
  {
    name: "Innovation Fund & venture awards",
    what: "Non-dilutive grants",
    detail:
      "Venture Lab administers non-dilutive grant funding and venture awards to help student founders move from idea to traction. Amounts and named awards vary year to year — check the current Venture Lab funding page.",
    url: "https://venturelab.upenn.edu/",
  },
  {
    name: "Entrepreneur-in-Residence (EIR)",
    what: "1:1 office hours",
    detail:
      "Book time with experienced founders and operators in residence for candid, tactical feedback on your venture — one of the highest-leverage free resources on campus.",
    url: "https://venturelab.upenn.edu/",
  },
];

export const CLASSES: string[] = [
  "Entrepreneurship (MGMT) core electives — opportunity, formation, and early growth",
  "Entrepreneurial management / venture initiation labs (build a real venture for credit)",
  "Venture Capital & the Finance of Innovation",
  "Private Equity / Entrepreneurship through Acquisition coursework",
  "Product management & innovation / design courses",
];

export type Story = {
  name: string;
  founders: string;
  when: string;
  story: string;
};

export const STORIES: Story[] = [
  {
    name: "Warby Parker",
    founders: "Neil Blumenthal, Dave Gilboa, Andrew Hunt, Jeff Raider (WG'10)",
    when: "Founded at Wharton",
    story:
      "The eyewear idea took shape while the four were Wharton MBA students. They nurtured it through the entrepreneurship ecosystem (the Business Plan Competition lineage + VIP incubator) — and famously did NOT win the business-plan competition before going on to build a multi-billion-dollar public company. Proof that the value is the process and network, not the trophy.",
  },
  {
    name: "Harry's",
    founders: "Jeff Raider & Andy Katz-Mayfield",
    when: "Post-MBA (serial founder)",
    story:
      "Jeff Raider co-founded Warby Parker, then went again with Harry's, a direct-to-consumer shaving brand — a classic example of a Wharton founder compounding one success into the next.",
  },
  {
    name: "General Assembly",
    founders: "Jake Schwartz (WG'08) and co-founders",
    when: "Post-MBA (VIP alum)",
    story:
      "Schwartz, a VIP alum, co-founded the education company General Assembly, scaling it globally before its acquisition — a Wharton-incubated venture that became a category leader.",
  },
];

export type UseItNow = { stage: string; action: string };

export const USE_IT_NOW: UseItNow[] = [
  {
    stage: "Exploring (no idea yet)",
    action:
      "Join the Wharton Entrepreneurship Club, attend Venture Lab events and EIR office hours, and take an entrepreneurship core elective to build the muscle and the network.",
  },
  {
    stage: "Have an idea",
    action:
      "Apply to the VIP Incubator for space, mentorship, and community. Book EIR office hours to pressure-test the idea before you build.",
  },
  {
    stage: "Building an MVP",
    action:
      "Use Tangen Hall's maker/space resources, line up an Innovation Fund grant or venture award for non-dilutive cash, and consider VIP-X to accelerate.",
  },
  {
    stage: "Ready to pitch / raise",
    action:
      "Enter the Startup Challenge (watch the fall/winter application window) for prize money, visibility, and warm intros to alumni investors.",
  },
  {
    stage: "Pursuing acquisition (ETA)",
    action:
      "If you're graduating and want to buy-and-run rather than build, apply for the Perlman ETA Fellowship ($25K–$50K, non-dilutive) in your final year.",
  },
];

export const WHARTON_SOURCES = [
  { label: "Penn Wharton Venture Lab", url: "https://venturelab.upenn.edu/" },
  { label: "Venture Lab — Startup Challenge", url: "https://venturelab.upenn.edu/startup-challenge" },
  { label: "Venture Lab — Entrepreneurship Through Acquisition (Perlman ETA)", url: "https://venturelab.upenn.edu/ETA" },
  { label: "Penn Today — $10M Perlman ETA gift", url: "https://penntoday.upenn.edu/news/ellen-l-hanson-and-richard-e-perlman-commit-10m-create-entrepreneurship-through-acquisition" },
];
