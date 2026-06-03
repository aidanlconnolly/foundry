"use server";

import { nanoid } from "nanoid";
import { and, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth";
import { markLessonDone } from "@/lib/actions/progress";
import type { QuizAttemptDetail } from "@/lib/db/schema";

export type LessonState = {
  done: boolean;
  bookmarked: boolean;
  note: string;
};

export async function getLessonState(lessonSlug: string): Promise<LessonState> {
  const userId = await requireAuth();
  const [prog, bm, note] = await Promise.all([
    db
      .select({ status: schema.progress.status })
      .from(schema.progress)
      .where(
        and(
          eq(schema.progress.userId, userId),
          eq(schema.progress.lessonSlug, lessonSlug),
        ),
      )
      .limit(1),
    db
      .select({ id: schema.bookmarks.id })
      .from(schema.bookmarks)
      .where(
        and(
          eq(schema.bookmarks.userId, userId),
          eq(schema.bookmarks.type, "lesson"),
          eq(schema.bookmarks.refSlug, lessonSlug),
        ),
      )
      .limit(1),
    db
      .select({ body: schema.notes.body })
      .from(schema.notes)
      .where(
        and(
          eq(schema.notes.userId, userId),
          eq(schema.notes.refSlug, lessonSlug),
        ),
      )
      .limit(1),
  ]);

  return {
    done: prog[0]?.status === "done",
    bookmarked: bm.length > 0,
    note: note[0]?.body ?? "",
  };
}

/** Record a knowledge-check attempt and mark the lesson complete. */
export async function completeLesson(args: {
  lessonSlug: string;
  stageSlug: string;
  score: number;
  detail: QuizAttemptDetail;
}): Promise<void> {
  const userId = await requireAuth();
  await db.insert(schema.quizAttempts).values({
    id: nanoid(),
    userId,
    lessonSlug: args.lessonSlug,
    score: args.score,
    detail: args.detail,
    createdAt: Date.now(),
  });
  await markLessonDone(args.lessonSlug, args.stageSlug);
}

export async function toggleBookmark(
  type: "lesson" | "case" | "tool",
  refSlug: string,
): Promise<{ bookmarked: boolean }> {
  const userId = await requireAuth();
  const existing = await db
    .select({ id: schema.bookmarks.id })
    .from(schema.bookmarks)
    .where(
      and(
        eq(schema.bookmarks.userId, userId),
        eq(schema.bookmarks.type, type),
        eq(schema.bookmarks.refSlug, refSlug),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .delete(schema.bookmarks)
      .where(eq(schema.bookmarks.id, existing[0].id));
    return { bookmarked: false };
  }
  await db.insert(schema.bookmarks).values({
    id: nanoid(),
    userId,
    type,
    refSlug,
    createdAt: Date.now(),
  });
  return { bookmarked: true };
}

export async function saveNote(
  refSlug: string,
  body: string,
): Promise<void> {
  const userId = await requireAuth();
  const existing = await db
    .select({ id: schema.notes.id })
    .from(schema.notes)
    .where(
      and(eq(schema.notes.userId, userId), eq(schema.notes.refSlug, refSlug)),
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(schema.notes)
      .set({ body, updatedAt: Date.now() })
      .where(eq(schema.notes.id, existing[0].id));
  } else {
    await db.insert(schema.notes).values({
      id: nanoid(),
      userId,
      refSlug,
      body,
      updatedAt: Date.now(),
    });
  }
}
