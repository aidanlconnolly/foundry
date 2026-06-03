"use server";

import { nanoid } from "nanoid";
import { and, eq, lte, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth";
import { applyRating, freshCardState, type Rating1to4 } from "@/lib/srs";
import { FOUNDER_VOCAB } from "@/lib/content/vocab";
import type { Flashcard } from "@/lib/db/schema";

/** Load the curated Founder Vocabulary deck into the caller's review deck. */
export async function seedFounderVocab(): Promise<{ added: number }> {
  return addFlashcards(FOUNDER_VOCAB, { deck: "Founder Vocabulary" });
}

/** Upsert shared flashcard content and seed a per-user review row (due now). */
export async function addFlashcards(
  cards: Array<{ term: string; definition: string }>,
  opts: { deck?: string; sourceLessonSlug?: string } = {},
): Promise<{ added: number }> {
  const userId = await requireAuth();
  const deck = opts.deck ?? "Founder Vocabulary";
  let added = 0;

  for (const c of cards) {
    const term = c.term.trim();
    if (!term) continue;

    // Upsert shared flashcard (unique on deck+term).
    const rows = await db
      .select({ id: schema.flashcards.id })
      .from(schema.flashcards)
      .where(
        and(eq(schema.flashcards.deck, deck), eq(schema.flashcards.term, term)),
      )
      .limit(1);

    let flashcardId: string;
    if (rows.length === 0) {
      flashcardId = nanoid();
      await db.insert(schema.flashcards).values({
        id: flashcardId,
        term,
        definition: c.definition,
        deck,
        sourceLessonSlug: opts.sourceLessonSlug ?? null,
        createdAt: Date.now(),
      });
    } else {
      flashcardId = rows[0].id;
    }

    // Seed a review row for this user if absent.
    const existing = await db
      .select({ id: schema.reviews.id })
      .from(schema.reviews)
      .where(
        and(
          eq(schema.reviews.userId, userId),
          eq(schema.reviews.flashcardId, flashcardId),
        ),
      )
      .limit(1);
    if (existing.length === 0) {
      const state = freshCardState();
      await db.insert(schema.reviews).values({
        id: nanoid(),
        userId,
        flashcardId,
        fsrsDue: new Date(state.due).getTime(),
        fsrsState: state,
        reps: 0,
        createdAt: Date.now(),
      });
      added += 1;
    }
  }
  return { added };
}

export type DueCard = {
  reviewId: string;
  flashcardId: string;
  term: string;
  definition: string;
  deck: string;
};

/** Cards currently due for review (due <= now), oldest first. */
export async function getDueCards(limit = 40): Promise<DueCard[]> {
  const userId = await requireAuth();
  const rows = await db
    .select({
      reviewId: schema.reviews.id,
      flashcardId: schema.flashcards.id,
      term: schema.flashcards.term,
      definition: schema.flashcards.definition,
      deck: schema.flashcards.deck,
    })
    .from(schema.reviews)
    .innerJoin(
      schema.flashcards,
      eq(schema.reviews.flashcardId, schema.flashcards.id),
    )
    .where(
      and(
        eq(schema.reviews.userId, userId),
        lte(schema.reviews.fsrsDue, Date.now()),
      ),
    )
    .orderBy(schema.reviews.fsrsDue)
    .limit(limit);
  return rows;
}

/** Apply an FSRS rating to a review row and reschedule. */
export async function rateCard(
  reviewId: string,
  rating: Rating1to4,
): Promise<void> {
  const userId = await requireAuth();
  const rows = await db
    .select()
    .from(schema.reviews)
    .where(
      and(eq(schema.reviews.id, reviewId), eq(schema.reviews.userId, userId)),
    )
    .limit(1);
  if (rows.length === 0) return;

  const { state, dueMs } = applyRating(rows[0].fsrsState, rating);
  await db
    .update(schema.reviews)
    .set({
      fsrsState: state,
      fsrsDue: dueMs,
      reps: rows[0].reps + 1,
      lastReviewedAt: Date.now(),
    })
    .where(eq(schema.reviews.id, reviewId));
}

export type DeckStats = {
  total: number;
  due: number;
};

export async function getDeckStats(): Promise<DeckStats> {
  const userId = await requireAuth();
  const [{ total }] = await db
    .select({ total: sql<number>`count(*)` })
    .from(schema.reviews)
    .where(eq(schema.reviews.userId, userId));
  const [{ due }] = await db
    .select({ due: sql<number>`count(*)` })
    .from(schema.reviews)
    .where(
      and(
        eq(schema.reviews.userId, userId),
        lte(schema.reviews.fsrsDue, Date.now()),
      ),
    );
  return { total: Number(total), due: Number(due) };
}

/** All of a user's cards with scheduling info, for the deck list. */
export async function getAllUserCards(): Promise<
  Array<Pick<Flashcard, "term" | "definition" | "deck"> & { due: number }>
> {
  const userId = await requireAuth();
  return db
    .select({
      term: schema.flashcards.term,
      definition: schema.flashcards.definition,
      deck: schema.flashcards.deck,
      due: schema.reviews.fsrsDue,
    })
    .from(schema.reviews)
    .innerJoin(
      schema.flashcards,
      eq(schema.reviews.flashcardId, schema.flashcards.id),
    )
    .where(eq(schema.reviews.userId, userId))
    .orderBy(schema.flashcards.deck, schema.flashcards.term);
}
