"use server";

import { nanoid } from "nanoid";
import { and, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth";
import type { Profile, ProgressStatus } from "@/lib/db/schema";

function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

/** Ensure and return the caller's profile row. */
export async function getProfile(): Promise<Profile> {
  const userId = await requireAuth();
  const rows = await db
    .select()
    .from(schema.profile)
    .where(eq(schema.profile.userId, userId))
    .limit(1);
  if (rows.length > 0) return rows[0];

  const row = {
    id: nanoid(),
    userId,
    currentStage: "foundations",
    streakCount: 0,
    createdAt: Date.now(),
  };
  await db.insert(schema.profile).values(row);
  return { ...row, name: null, lastActiveDay: null, lastActiveAt: null };
}

/** lessonSlug → status for the caller. */
export async function getProgressMap(): Promise<Record<string, ProgressStatus>> {
  const userId = await requireAuth();
  const rows = await db
    .select({
      lessonSlug: schema.progress.lessonSlug,
      status: schema.progress.status,
    })
    .from(schema.progress)
    .where(eq(schema.progress.userId, userId));
  const map: Record<string, ProgressStatus> = {};
  for (const r of rows) map[r.lessonSlug] = r.status;
  return map;
}

/**
 * Update the streak based on the day of last activity. Returns the new count.
 * Same-day activity is a no-op; consecutive day increments; a gap resets to 1.
 */
async function bumpStreak(userId: string): Promise<void> {
  const rows = await db
    .select()
    .from(schema.profile)
    .where(eq(schema.profile.userId, userId))
    .limit(1);
  if (rows.length === 0) return;
  const p = rows[0];
  const today = todayKey();
  if (p.lastActiveDay === today) return; // already counted today

  const yesterday = todayKey(new Date(Date.now() - 86_400_000));
  const nextCount = p.lastActiveDay === yesterday ? p.streakCount + 1 : 1;

  await db
    .update(schema.profile)
    .set({
      streakCount: nextCount,
      lastActiveDay: today,
      lastActiveAt: Date.now(),
    })
    .where(eq(schema.profile.userId, userId));
}

/** Mark a lesson complete (idempotent) and advance streak + furthest stage. */
export async function markLessonDone(
  lessonSlug: string,
  stageSlug: string,
): Promise<void> {
  const userId = await requireAuth();
  const existing = await db
    .select({ id: schema.progress.id })
    .from(schema.progress)
    .where(
      and(
        eq(schema.progress.userId, userId),
        eq(schema.progress.lessonSlug, lessonSlug),
      ),
    )
    .limit(1);

  if (existing.length === 0) {
    await db.insert(schema.progress).values({
      id: nanoid(),
      userId,
      lessonSlug,
      stageSlug,
      status: "done",
      completedAt: Date.now(),
    });
  } else {
    await db
      .update(schema.progress)
      .set({ status: "done", completedAt: Date.now() })
      .where(eq(schema.progress.id, existing[0].id));
  }

  await bumpStreak(userId);
}
