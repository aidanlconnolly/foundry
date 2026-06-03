"use client";

import { useMemo, useState } from "react";

const DIMENSIONS = [
  {
    key: "severity",
    label: "Problem severity",
    hint: "Painkiller (5) vs nice-to-have vitamin (1)?",
  },
  {
    key: "frequency",
    label: "Frequency",
    hint: "How often does the pain bite? Daily (5) vs rarely (1).",
  },
  {
    key: "market",
    label: "Market size",
    hint: "Credible bottoms-up TAM. Huge & growing (5) vs thin (1).",
  },
  {
    key: "whyNow",
    label: "Why now",
    hint: "A sharp recent shift opening the window (5) vs none (1).",
  },
  {
    key: "founderFit",
    label: "Founder–market fit",
    hint: "Your unfair advantage for this market. Strong (5) vs generic (1).",
  },
] as const;

type Key = (typeof DIMENSIONS)[number]["key"];

export default function IdeaScorecard() {
  const [scores, setScores] = useState<Record<Key, number>>({
    severity: 3,
    frequency: 3,
    market: 3,
    whyNow: 3,
    founderFit: 3,
  });

  const { total, avg, weakest } = useMemo(() => {
    const vals = DIMENSIONS.map((d) => scores[d.key]);
    const total = vals.reduce((a, b) => a + b, 0);
    const avg = total / DIMENSIONS.length;
    const minVal = Math.min(...vals);
    const weakest = DIMENSIONS.filter((d) => scores[d.key] === minVal);
    return { total, avg, weakest };
  }, [scores]);

  const verdict =
    avg >= 4.2
      ? { label: "Strong — pressure-test it with users", color: "text-good" }
      : avg >= 3
        ? { label: "Promising — de-risk the weak spots first", color: "text-accent-strong" }
        : { label: "Risky — the weak dimensions could kill it", color: "text-bad" };

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="space-y-4">
        {DIMENSIONS.map((d) => (
          <div key={d.key}>
            <div className="flex items-baseline justify-between">
              <label className="text-sm font-medium text-fg">{d.label}</label>
              <span className="text-sm font-semibold text-accent">
                {scores[d.key]}
              </span>
            </div>
            <p className="mb-1.5 text-xs text-faint">{d.hint}</p>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={scores[d.key]}
              onChange={(e) =>
                setScores((s) => ({ ...s, [d.key]: Number(e.target.value) }))
              }
              className="w-full accent-[var(--accent)]"
            />
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-semibold text-fg">
              {total}
              <span className="text-base text-faint">/25</span>
            </p>
            <p className={`text-sm font-medium ${verdict.color}`}>
              {verdict.label}
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted">
          Your biggest risk:{" "}
          <span className="font-medium text-fg">
            {weakest.map((w) => w.label).join(", ")}
          </span>
          . Test that assumption first in customer discovery.
        </p>
      </div>
    </div>
  );
}
