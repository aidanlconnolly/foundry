"use client";

import { useState } from "react";

type Option = { label: string; score: number };
type Q = { key: string; q: string; options: Option[] };

const QUESTIONS: Q[] = [
  {
    key: "product",
    q: "Where is the product?",
    options: [
      { label: "Just an idea / deck", score: 0 },
      { label: "Prototype or MVP", score: 1 },
      { label: "Live with active users", score: 2 },
      { label: "Live and charging customers", score: 3 },
    ],
  },
  {
    key: "revenue",
    q: "Revenue?",
    options: [
      { label: "None yet", score: 0 },
      { label: "Under ~$10K MRR", score: 1 },
      { label: "~$10K–$80K MRR", score: 2 },
      { label: "Over ~$80K MRR (~$1M ARR+)", score: 3 },
    ],
  },
  {
    key: "traction",
    q: "Strongest evidence you have?",
    options: [
      { label: "Customer interviews / a waitlist", score: 0 },
      { label: "Early signups and usage", score: 1 },
      { label: "Real retention — people keep coming back", score: 2 },
      { label: "Repeatable, efficient growth", score: 3 },
    ],
  },
  {
    key: "team",
    q: "Team?",
    options: [
      { label: "Solo founder", score: 0 },
      { label: "Co-founders in place", score: 1 },
      { label: "Founders + a few early hires", score: 2 },
    ],
  },
];

const RESULTS = [
  {
    name: "Pre-seed",
    blurb:
      "You're funding the search for product–market fit. Raise a small amount (often on SAFEs) from angels and pre-seed funds to get to a working product and first signal. Sell the team, the insight, and a sharp 'why now.'",
  },
  {
    name: "Seed",
    blurb:
      "You have early evidence — usage, retention, maybe first revenue. Seed capital funds turning that signal into a repeatable engine. Investors want to see you've found something people want and a credible path to a Series A.",
  },
  {
    name: "Series A",
    blurb:
      "In 2026 the A bar is high: real, repeatable revenue (often ~$1M+ ARR) and efficient growth, not just a story. A VC will lead, price the round, and take a board seat. Run a tight process against funds whose math your scale can satisfy.",
  },
];

export default function WhichRound() {
  const [answers, setAnswers] = useState<Record<string, number | null>>(
    Object.fromEntries(QUESTIONS.map((q) => [q.key, null])),
  );

  const answered = Object.values(answers).filter((v) => v !== null).length;
  const allAnswered = answered === QUESTIONS.length;
  const total = Object.values(answers).reduce<number>(
    (a, v) => a + (v ?? 0),
    0,
  );
  // Max ~12. Bucket into pre-seed / seed / A.
  const idx = total >= 8 ? 2 : total >= 4 ? 1 : 0;
  const result = RESULTS[idx];

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="space-y-5">
        {QUESTIONS.map((q) => (
          <div key={q.key}>
            <p className="mb-2 text-sm font-medium text-fg">{q.q}</p>
            <div className="flex flex-wrap gap-2">
              {q.options.map((o, oi) => {
                const isChosen = answers[q.key] === o.score;
                return (
                  <button
                    key={oi}
                    type="button"
                    onClick={() =>
                      setAnswers((a) => ({ ...a, [q.key]: o.score }))
                    }
                    className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                      isChosen
                        ? "border-accent bg-accent-soft/40 text-fg"
                        : "border-border bg-surface-2 text-muted hover:border-border-strong"
                    }`}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-border pt-4">
        {allAnswered ? (
          <div className="rounded-xl border border-accent/25 bg-gradient-to-br from-accent-soft/40 to-surface p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-strong">
              You look like a
            </p>
            <p className="mt-1 text-xl font-semibold text-fg">{result.name}</p>
            <p className="mt-2 text-sm text-muted">{result.blurb}</p>
          </div>
        ) : (
          <p className="text-sm text-faint">
            Answer all {QUESTIONS.length} to see your likely round ({answered}/
            {QUESTIONS.length}).
          </p>
        )}
        <p className="mt-3 text-xs text-faint">
          Directional only — not investment advice. Stage labels blur in
          practice; what matters is the evidence, not the name.
        </p>
      </div>
    </div>
  );
}
