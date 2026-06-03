import {
  sqliteTable,
  text,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

/* ─────────── Users (auth) ─────────── */

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at").notNull(),
});

/* ─────────── Profile (1:1 with user — learning state) ─────────── */

export const profile = sqliteTable(
  "profile",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    name: text("name"),
    // Slug of the furthest stage the learner has unlocked (e.g. "fundraising").
    currentStage: text("current_stage").notNull().default("foundations"),
    streakCount: integer("streak_count").notNull().default(0),
    // YYYY-MM-DD of last activity, for streak math.
    lastActiveDay: text("last_active_day"),
    lastActiveAt: integer("last_active_at"),
    createdAt: integer("created_at").notNull(),
  },
  (t) => [uniqueIndex("profile_user_idx").on(t.userId)],
);

/* ─────────── Lesson progress ─────────── */

export type ProgressStatus = "in_progress" | "done";

export const progress = sqliteTable(
  "progress",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    lessonSlug: text("lesson_slug").notNull(),
    stageSlug: text("stage_slug").notNull(),
    status: text("status").$type<ProgressStatus>().notNull().default("done"),
    completedAt: integer("completed_at"),
  },
  (t) => [
    uniqueIndex("progress_user_lesson_idx").on(t.userId, t.lessonSlug),
    index("progress_user_stage_idx").on(t.userId, t.stageSlug),
  ],
);

/* ─────────── Flashcards (shared deck content) ─────────── */

export const flashcards = sqliteTable(
  "flashcards",
  {
    id: text("id").primaryKey(),
    term: text("term").notNull(),
    definition: text("definition").notNull(),
    deck: text("deck").notNull().default("Founder Vocabulary"),
    sourceLessonSlug: text("source_lesson_slug"),
    createdAt: integer("created_at").notNull(),
  },
  (t) => [uniqueIndex("flashcards_deck_term_idx").on(t.deck, t.term)],
);

/* ─────────── Reviews (per-user FSRS state — one row per (user, card)) ─────────── */

export const reviews = sqliteTable(
  "reviews",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    flashcardId: text("flashcard_id")
      .notNull()
      .references(() => flashcards.id, { onDelete: "cascade" }),
    fsrsDue: integer("fsrs_due").notNull(),
    fsrsState: text("fsrs_state", { mode: "json" })
      .$type<FsrsCardState>()
      .notNull(),
    reps: integer("reps").notNull().default(0),
    createdAt: integer("created_at").notNull(),
    lastReviewedAt: integer("last_reviewed_at"),
  },
  (t) => [
    uniqueIndex("reviews_user_card_idx").on(t.userId, t.flashcardId),
    index("reviews_user_due_idx").on(t.userId, t.fsrsDue),
  ],
);

/* ─────────── Quiz attempts ─────────── */

export const quizAttempts = sqliteTable(
  "quiz_attempts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    lessonSlug: text("lesson_slug").notNull(),
    score: integer("score").notNull(),
    detail: text("detail", { mode: "json" })
      .$type<QuizAttemptDetail>()
      .notNull(),
    createdAt: integer("created_at").notNull(),
  },
  (t) => [index("quiz_attempts_user_lesson_idx").on(t.userId, t.lessonSlug)],
);

/* ─────────── Bookmarks ─────────── */

export type BookmarkType = "lesson" | "case" | "tool";

export const bookmarks = sqliteTable(
  "bookmarks",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    type: text("type").$type<BookmarkType>().notNull(),
    refSlug: text("ref_slug").notNull(),
    createdAt: integer("created_at").notNull(),
  },
  (t) => [uniqueIndex("bookmarks_user_ref_idx").on(t.userId, t.type, t.refSlug)],
);

/* ─────────── Notes ─────────── */

export const notes = sqliteTable(
  "notes",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    refSlug: text("ref_slug").notNull(),
    body: text("body").notNull().default(""),
    updatedAt: integer("updated_at").notNull(),
  },
  (t) => [uniqueIndex("notes_user_ref_idx").on(t.userId, t.refSlug)],
);

/* ─────────── AI mentor threads + messages ─────────── */

export type MentorMode = "explain" | "pitch" | "case";

export const mentorThreads = sqliteTable(
  "mentor_threads",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    mode: text("mode").$type<MentorMode>().notNull().default("explain"),
    title: text("title").notNull().default("New conversation"),
    createdAt: integer("created_at").notNull(),
  },
  (t) => [index("mentor_threads_user_idx").on(t.userId, t.createdAt)],
);

export const mentorMessages = sqliteTable(
  "mentor_messages",
  {
    id: text("id").primaryKey(),
    threadId: text("thread_id")
      .notNull()
      .references(() => mentorThreads.id, { onDelete: "cascade" }),
    role: text("role").$type<"user" | "assistant">().notNull(),
    content: text("content").notNull(),
    createdAt: integer("created_at").notNull(),
  },
  (t) => [index("mentor_messages_thread_idx").on(t.threadId, t.createdAt)],
);

/* ─────────── VC landscape snapshots (AI-refreshable cache) ─────────── */

export const vcSnapshots = sqliteTable(
  "vc_snapshots",
  {
    id: text("id").primaryKey(),
    payload: text("payload", { mode: "json" }).$type<unknown>().notNull(),
    refreshedAt: integer("refreshed_at").notNull(),
  },
  (t) => [index("vc_snapshots_refreshed_idx").on(t.refreshedAt)],
);

/* ─────────── AI-generated case deep-dives ─────────── */

export const aiCases = sqliteTable(
  "ai_cases",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    company: text("company").notNull(),
    payload: text("payload", { mode: "json" }).$type<unknown>().notNull(),
    createdAt: integer("created_at").notNull(),
  },
  (t) => [uniqueIndex("ai_cases_slug_idx").on(t.slug)],
);

/* ─────────── Relations ─────────── */

export const flashcardsRelations = relations(flashcards, ({ many }) => ({
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  flashcard: one(flashcards, {
    fields: [reviews.flashcardId],
    references: [flashcards.id],
  }),
}));

export const mentorThreadsRelations = relations(mentorThreads, ({ many }) => ({
  messages: many(mentorMessages),
}));

export const mentorMessagesRelations = relations(mentorMessages, ({ one }) => ({
  thread: one(mentorThreads, {
    fields: [mentorMessages.threadId],
    references: [mentorThreads.id],
  }),
}));

/* ─────────── Types ─────────── */

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Profile = typeof profile.$inferSelect;
export type Progress = typeof progress.$inferSelect;
export type Flashcard = typeof flashcards.$inferSelect;
export type NewFlashcard = typeof flashcards.$inferInsert;
export type ReviewRow = typeof reviews.$inferSelect;
export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type Bookmark = typeof bookmarks.$inferSelect;
export type Note = typeof notes.$inferSelect;
export type MentorThread = typeof mentorThreads.$inferSelect;
export type MentorMessage = typeof mentorMessages.$inferSelect;
export type VcSnapshot = typeof vcSnapshots.$inferSelect;
export type AiCase = typeof aiCases.$inferSelect;

export type QuizAttemptDetail = {
  questions: Array<{
    prompt: string;
    correct: boolean;
    userAnswer: string;
  }>;
};

export type FsrsCardState = {
  due: string;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  state: number;
  last_review?: string;
};
