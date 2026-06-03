import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { and, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { getSession } from "@/lib/auth";
import { anthropic, MODEL_SMART, WEB_SEARCH_TOOL } from "@/lib/anthropic";
import { getAllLessons, findStage } from "@/lib/content";
import type { MentorMode } from "@/lib/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BASE = `You are Foundry's startup mentor — sharp, modern (it's 2026), candid, and concrete. The learner is a Wharton MBA with a consulting background working toward founding a startup. Avoid generic platitudes and filler. Give specific, actionable guidance, use real examples and named tools where useful, and keep answers tight and well-structured. Use markdown.`;

function systemFor(mode: MentorMode, ctx: string): string {
  if (mode === "pitch") {
    return `${BASE}\n\nMODE: Pitch practice. Role-play a skeptical but fair seed-stage VC. Interrogate the pitch on market size, "why now", traction, moat/defensibility, and team. Push back where it's weak. After your questions and pushback, give a quick grade (X/10) and the two biggest gaps to fix next. Stay in character but be genuinely useful.\n\nLearner context: ${ctx}`;
  }
  if (mode === "case") {
    return `${BASE}\n\nMODE: Case deep-dive. Use web search to research the company the user names, then produce a gritty teardown: the origin, the core insight, what they built (v1 scope), the stack and software they used, design decisions, go-to-market, round-by-round funding, 2-3 pivotal decisions, and transferable lessons. Cite sources and flag anything uncertain rather than inventing it.\n\nLearner context: ${ctx}`;
  }
  return `${BASE}\n\nMODE: Explain. Answer the question clearly, lean on real frameworks, and end with one concrete next step the learner can take this week.\n\nLearner context: ${ctx}`;
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const userId = session.userId;

  let body: { threadId?: string; mode?: MentorMode; content?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }
  const content = (body.content ?? "").trim();
  const mode: MentorMode = body.mode ?? "explain";
  if (!content) return new Response("Empty message", { status: 400 });

  // Resolve / verify thread.
  let threadId = body.threadId;
  if (threadId) {
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
    if (owned.length === 0) threadId = undefined;
  }
  if (!threadId) {
    threadId = nanoid();
    await db.insert(schema.mentorThreads).values({
      id: threadId,
      userId,
      mode,
      title: content.slice(0, 60),
      createdAt: Date.now(),
    });
  }

  // Load prior messages for context.
  const prior = await db
    .select({
      role: schema.mentorMessages.role,
      content: schema.mentorMessages.content,
    })
    .from(schema.mentorMessages)
    .where(eq(schema.mentorMessages.threadId, threadId))
    .orderBy(schema.mentorMessages.createdAt);

  // Persist the user's message.
  await db.insert(schema.mentorMessages).values({
    id: nanoid(),
    threadId,
    role: "user",
    content,
    createdAt: Date.now(),
  });

  // Build learner context.
  const profileRows = await db
    .select({ currentStage: schema.profile.currentStage })
    .from(schema.profile)
    .where(eq(schema.profile.userId, userId))
    .limit(1);
  const progressRows = await db
    .select({ lessonSlug: schema.progress.lessonSlug })
    .from(schema.progress)
    .where(
      and(
        eq(schema.progress.userId, userId),
        eq(schema.progress.status, "done"),
      ),
    );
  const stageSlug = profileRows[0]?.currentStage ?? "foundations";
  const stage = findStage(stageSlug);
  const ctx = `current stage "${stage?.title ?? stageSlug}", ${progressRows.length}/${getAllLessons().length} lessons completed.`;

  const messages = [
    ...prior.map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content },
  ];

  const finalThreadId = threadId;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let full = "";
      try {
        const s = anthropic().messages.stream({
          model: MODEL_SMART,
          max_tokens: 1600,
          system: systemFor(mode, ctx),
          tools: mode === "case" ? [WEB_SEARCH_TOOL] : undefined,
          messages,
        });
        for await (const event of s) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            full += event.delta.text;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        const msg =
          "\n\n_The mentor is unavailable right now — check that ANTHROPIC_API_KEY is set. In the meantime, the lessons, cases, and toolkit all work offline._";
        if (full.length === 0) {
          full = msg.trim();
          controller.enqueue(encoder.encode(msg.trim()));
        }
        console.error("mentor stream error", err);
      } finally {
        // Persist the assistant message + return the thread id in a trailer header isn't possible mid-stream;
        // the client already knows the thread via the response header below.
        if (full.length > 0) {
          await db.insert(schema.mentorMessages).values({
            id: nanoid(),
            threadId: finalThreadId,
            role: "assistant",
            content: full,
            createdAt: Date.now(),
          });
        }
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Thread-Id": finalThreadId,
    },
  });
}
