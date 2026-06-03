"use client";

import { useState } from "react";
import { Play, Layers } from "lucide-react";
import ReviewSession from "./ReviewSession";
import type { DueCard } from "@/lib/actions/flashcards";

type DeckCard = { term: string; definition: string; deck: string; due: number };

export default function FlashcardsView({
  dueCards,
  allCards,
  stats,
}: {
  dueCards: DueCard[];
  allCards: DeckCard[];
  stats: { total: number; due: number };
}) {
  const [reviewing, setReviewing] = useState(false);

  const byDeck = allCards.reduce<Record<string, DeckCard[]>>((acc, c) => {
    (acc[c.deck] ??= []).push(c);
    return acc;
  }, {});
  const now = Date.now();

  if (reviewing) {
    return (
      <div className="mx-auto max-w-lg">
        <ReviewSession cards={dueCards} />
        <button
          type="button"
          onClick={() => setReviewing(false)}
          className="mt-6 block w-full text-center text-sm text-faint hover:text-fg"
        >
          End session
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-2xl font-semibold text-fg">{stats.total}</p>
          <p className="text-xs text-muted">cards in deck</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-2xl font-semibold text-accent">{stats.due}</p>
          <p className="text-xs text-muted">due now</p>
        </div>
      </div>

      {stats.due > 0 ? (
        <button
          type="button"
          onClick={() => setReviewing(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent py-4 text-sm font-semibold text-accent-fg transition hover:bg-accent-strong"
        >
          <Play className="h-4 w-4" /> Review {stats.due} card
          {stats.due === 1 ? "" : "s"}
        </button>
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-6 text-center text-sm text-muted">
          Nothing due right now. New cards appear here as you add them from
          lessons and as scheduled reviews come up.
        </div>
      )}

      {/* Deck contents */}
      {Object.entries(byDeck).map(([deck, cards]) => (
        <section key={deck}>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-fg">
            <Layers className="h-4 w-4 text-accent" /> {deck}
            <span className="text-xs font-normal text-faint">
              ({cards.length})
            </span>
          </div>
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
            {cards.map((c, idx) => {
              const due = c.due <= now;
              return (
                <li key={idx} className="flex items-start gap-3 p-3">
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      due ? "bg-accent" : "bg-border-strong"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-fg">{c.term}</p>
                    <p className="line-clamp-2 text-xs text-muted">
                      {c.definition}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
