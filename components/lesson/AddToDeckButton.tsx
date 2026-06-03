"use client";

import { useState, useTransition } from "react";
import { Layers, Check } from "lucide-react";
import { addFlashcards } from "@/lib/actions/flashcards";

export default function AddToDeckButton({
  cards,
  sourceLessonSlug,
}: {
  cards: Array<{ term: string; definition: string }>;
  sourceLessonSlug: string;
}) {
  const [pending, start] = useTransition();
  const [addedCount, setAddedCount] = useState<number | null>(null);

  function add() {
    start(async () => {
      const res = await addFlashcards(cards, { sourceLessonSlug });
      setAddedCount(res.added);
    });
  }

  if (addedCount !== null) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-good">
        <Check className="h-4 w-4" />
        {addedCount > 0
          ? `Added ${addedCount} card${addedCount === 1 ? "" : "s"} to your deck`
          : "Already in your deck"}
      </span>
    );
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={add}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm font-medium text-fg transition hover:border-border-strong disabled:opacity-60"
    >
      <Layers className="h-4 w-4 text-accent" />
      {pending
        ? "Adding…"
        : `Add ${cards.length} card${cards.length === 1 ? "" : "s"} to deck`}
    </button>
  );
}
