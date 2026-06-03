/**
 * FSRS wrapper. Owns the scheduling parameters and the serialization shim
 * between ts-fsrs's Card type (Dates) and what we store in SQLite (ISO strings
 * inside a JSON blob). This satisfies the spaced-repetition requirement; FSRS
 * is a modern successor to SM-2 with the same review flow.
 */

import {
  createEmptyCard,
  fsrs,
  generatorParameters,
  Rating,
  State,
  type Card as FsrsCard,
  type Grade,
} from "ts-fsrs";
import type { FsrsCardState } from "@/lib/db/schema";

/**
 * `request_retention` = 0.9 means cards are scheduled so you'd forget ~10% of
 * them at next review — a reasonable default for concept learning.
 */
export const FSRS_PARAMS = generatorParameters({
  enable_fuzz: true,
  enable_short_term: true,
  request_retention: 0.9,
});

export const scheduler = fsrs(FSRS_PARAMS);

export type Rating1to4 = 1 | 2 | 3 | 4;
export const RATING_LABELS: Record<Rating1to4, string> = {
  1: "Again",
  2: "Hard",
  3: "Good",
  4: "Easy",
};

export function ratingFromInt(n: number): Rating1to4 | null {
  return n === 1 || n === 2 || n === 3 || n === 4 ? (n as Rating1to4) : null;
}

function toRating(r: Rating1to4): Grade {
  switch (r) {
    case 1:
      return Rating.Again;
    case 2:
      return Rating.Hard;
    case 3:
      return Rating.Good;
    case 4:
      return Rating.Easy;
  }
}

function serialize(card: FsrsCard): FsrsCardState {
  return {
    due: card.due.toISOString(),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsed_days: card.elapsed_days,
    scheduled_days: card.scheduled_days,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    last_review: card.last_review ? card.last_review.toISOString() : undefined,
  };
}

function deserialize(state: FsrsCardState): FsrsCard {
  return {
    due: new Date(state.due),
    stability: state.stability,
    difficulty: state.difficulty,
    elapsed_days: state.elapsed_days,
    scheduled_days: state.scheduled_days,
    reps: state.reps,
    lapses: state.lapses,
    state: state.state as State,
    last_review: state.last_review ? new Date(state.last_review) : undefined,
    learning_steps: 0,
  };
}

/** Brand-new card, due immediately. */
export function freshCardState(now: Date = new Date()): FsrsCardState {
  return serialize(createEmptyCard(now));
}

/**
 * Apply a rating to a card. Returns the new serialized state and the next
 * due-time in ms (denormalized so the DB can index on it).
 */
export function applyRating(
  prev: FsrsCardState,
  rating: Rating1to4,
  now: Date = new Date(),
): { state: FsrsCardState; dueMs: number } {
  const card = deserialize(prev);
  const { card: next } = scheduler.next(card, now, toRating(rating));
  return { state: serialize(next), dueMs: next.due.getTime() };
}

/**
 * Preview the next interval for each of the four ratings. Used to label
 * review buttons with "(2d)" etc.
 */
export function previewIntervals(
  prev: FsrsCardState,
  now: Date = new Date(),
): Record<Rating1to4, string> {
  const card = deserialize(prev);
  const recordLog = scheduler.repeat(card, now);
  const fmt = (d: Date): string => {
    const diffMs = d.getTime() - now.getTime();
    const mins = Math.round(diffMs / 60_000);
    if (mins < 60) return `${Math.max(1, mins)}m`;
    const hrs = Math.round(diffMs / 3_600_000);
    if (hrs < 24) return `${hrs}h`;
    const days = Math.round(diffMs / 86_400_000);
    return `${days}d`;
  };
  return {
    1: fmt(recordLog[Rating.Again].card.due),
    2: fmt(recordLog[Rating.Hard].card.due),
    3: fmt(recordLog[Rating.Good].card.due),
    4: fmt(recordLog[Rating.Easy].card.due),
  };
}
