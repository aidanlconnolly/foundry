import { Layers } from "lucide-react";
import {
  getDeckStats,
  getDueCards,
  getAllUserCards,
} from "@/lib/actions/flashcards";
import FlashcardsView from "@/components/flashcards/FlashcardsView";
import SeedDeckButton from "@/components/flashcards/SeedDeckButton";

export const dynamic = "force-dynamic";

export default async function FlashcardsPage() {
  const stats = await getDeckStats();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-fg">
          Flashcards
        </h1>
        <p className="mt-1 text-sm text-muted">
          Spaced repetition (FSRS) so the frameworks and vocabulary actually
          stick.
        </p>
      </div>

      {stats.total === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-8 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-accent-soft">
            <Layers className="h-6 w-6 text-accent" />
          </div>
          <h2 className="text-lg font-semibold text-fg">
            Start your founder deck
          </h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
            Load the curated Founder Vocabulary — 28 essential terms from TAM to
            liquidation preference — then add more from any lesson as you go.
          </p>
          <div className="mt-5">
            <SeedDeckButton />
          </div>
        </div>
      ) : (
        <FlashcardsView
          dueCards={await getDueCards()}
          allCards={await getAllUserCards()}
          stats={stats}
        />
      )}
    </div>
  );
}
