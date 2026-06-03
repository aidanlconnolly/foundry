"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Check } from "lucide-react";
import { rateCard, type DueCard } from "@/lib/actions/flashcards";
import { RATING_LABELS, type Rating1to4 } from "@/lib/srs";

const RATING_STYLE: Record<Rating1to4, string> = {
  1: "border-bad/40 text-bad hover:bg-bad/10",
  2: "border-border-strong text-muted hover:bg-surface-3",
  3: "border-accent/40 text-accent-strong hover:bg-accent-soft/40",
  4: "border-good/40 text-good hover:bg-good/10",
};

export default function ReviewSession({ cards }: { cards: DueCard[] }) {
  const router = useRouter();
  const [queue, setQueue] = useState<DueCard[]>(cards);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [pending, start] = useTransition();

  const total = cards.length;
  const current = queue[i];

  function rate(rating: Rating1to4) {
    if (!current) return;
    start(async () => {
      await rateCard(current.reviewId, rating);
      setReviewed((n) => n + 1);
      setFlipped(false);
      if (i + 1 >= queue.length) {
        router.refresh();
        setQueue([]);
      } else {
        setI((n) => n + 1);
      }
    });
  }

  if (!current) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-10 text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-good/15">
          <Check className="h-6 w-6 text-good" />
        </div>
        <p className="text-lg font-semibold text-fg">All caught up</p>
        <p className="mt-1 text-sm text-muted">
          You reviewed {reviewed} card{reviewed === 1 ? "" : "s"}. Come back when
          more are due.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* progress */}
      <div className="mb-3 flex items-center justify-between text-xs text-faint">
        <span>
          Card {reviewed + 1} of {total}
        </span>
        <span>{total - reviewed} left</span>
      </div>
      <div className="mb-4 h-1 overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${(reviewed / total) * 100}%` }}
        />
      </div>

      {/* card */}
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="flex min-h-[14rem] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface p-8 text-center transition hover:border-border-strong"
      >
        <span className="text-xs uppercase tracking-wide text-faint">
          {current.deck}
        </span>
        <span className="text-xl font-semibold text-fg">{current.term}</span>
        {flipped ? (
          <span className="max-w-prose text-sm leading-relaxed text-muted">
            {current.definition}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs text-faint">
            <RotateCcw className="h-3.5 w-3.5" /> Tap to reveal
          </span>
        )}
      </button>

      {/* ratings */}
      {flipped ? (
        <div className="mt-4 grid grid-cols-4 gap-2">
          {([1, 2, 3, 4] as Rating1to4[]).map((r) => (
            <button
              key={r}
              type="button"
              disabled={pending}
              onClick={() => rate(r)}
              className={`rounded-lg border bg-surface-2 py-2.5 text-sm font-medium transition disabled:opacity-50 ${RATING_STYLE[r]}`}
            >
              {RATING_LABELS[r]}
            </button>
          ))}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setFlipped(true)}
          className="mt-4 w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-accent-fg transition hover:bg-accent-strong"
        >
          Reveal answer
        </button>
      )}
    </div>
  );
}
