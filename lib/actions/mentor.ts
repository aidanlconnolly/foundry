"use server";

import { nanoid } from "nanoid";
import { and, desc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth";
import type { MentorMode, MentorMessage, MentorThread } from "@/lib/db/schema";

export async function createThread(mode: MentorMode): Promise<string> {
  const userId = await requireAuth();
  const id = nanoid();
  await db.insert(schema.mentorThreads).values({
    id,
    userId,
    mode,
    title: "New conversation",
    createdAt: Date.now(),
  });
  return id;
}

export async function getThreads(): Promise<MentorThread[]> {
  const userId = await requireAuth();
  return db
    .select()
    .from(schema.mentorThreads)
    .where(eq(schema.mentorThreads.userId, userId))
    .orderBy(desc(schema.mentorThreads.createdAt))
    .limit(20);
}

export async function getThreadMessages(
  threadId: string,
): Promise<MentorMessage[]> {
  const userId = await requireAuth();
  // Ownership check.
  const owned = await db
    .select({ id: schema.mentorThreads.id })
    .from(schema.mentorThreads)
    .where(
      and(
        eq(schema.mentorThreads.id, threadId),
        eq(schema.mentorThreads.userId, userId),
      ),
    )
    .limit(1);
  if (owned.length === 0) return [];

  return db
    .select()
    .from(schema.mentorMessages)
    .where(eq(schema.mentorMessages.threadId, threadId))
    .orderBy(schema.mentorMessages.createdAt);
}

export async function deleteThread(threadId: string): Promise<void> {
  const userId = await requireAuth();
  await db
    .delete(schema.mentorThreads)
    .where(
      and(
        eq(schema.mentorThreads.id, threadId),
        eq(schema.mentorThreads.userId, userId),
      ),
    );
}
