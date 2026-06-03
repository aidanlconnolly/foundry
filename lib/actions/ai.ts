"use server";

import { nanoid } from "nanoid";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth";
import {
  anthropic,
  MODEL_SMART,
  MODEL_CHEAP,
  WEB_SEARCH_TOOL,
  extractJson,
} from "@/lib/anthropic";
import { getAllLessons, findStage } from "@/lib/content";
import type { VcSnapshot } from "@/lib/content/vc";

/* ─────────── Start Today ─────────── */

export type StartTodayAction = { title: string; detail: string; href?: string };

const STATIC_START_TODAY: StartTodayAction[] = [
  {
    title: "Talk to 3 potential users this week",
    detail:
      "Run Mom-Test interviews about the problem (not your solution). Book them today.",
    href: "/lesson/talking-to-users",
  },
  {
    title: "Score your idea honestly",
    detail:
      "Use the Idea Scorecard to find your weakest dimension, then design a test for it.",
    href: "/toolkit#idea-scorecard",
  },
  {
    title: "Ship the smallest possible test",
    detail:
      "Pick one MVP archetype (landing page, concierge, Wizard-of-Oz) and put it live.",
    href: "/lesson/mvp-archetypes",
  },
];

export async function generateStartToday(
  whereImAt: string,
): Promise<{ actions: StartTodayAction[]; ai: boolean }> {
  const userId = await requireAuth();
  try {
    const profileRows = await db
      .select({ currentStage: schema.profile.currentStage })
      .from(schema.profile)
      .where(eq(schema.profile.userId, userId))
      .limit(1);
    const doneRows = await db
      .select({ lessonSlug: schema.progress.lessonSlug })
      .from(schema.progress)
      .where(eq(schema.progress.userId, userId));
    const stageSlug = profileRows[0]?.currentStage ?? "foundations";
    const stage = findStage(stageSlug);

    const msg = await anthropic().messages.create({
      model: MODEL_CHEAP,
      max_tokens: 700,
      system: `You are Foundry's startup coach. Given a founder's current stage and a one-line note on where they are, output exactly 3 concrete actions they can take THIS WEEK. Be specific and modern (2026). Respond ONLY with JSON: {"actions":[{"title":"...","detail":"...","href":"/optional-internal-path"}]}. Valid internal paths include /lesson/<slug>, /toolkit, /tools, /cases, /vc-landscape, /wharton. Keep titles under 8 words and details to one sentence.`,
      messages: [
        {
          role: "user",
          content: `Current stage: ${stage?.title ?? stageSlug}. Lessons completed: ${doneRows.length}/${getAllLessons().length}. Where I'm at: "${whereImAt || "just getting started"}".`,
        },
      ],
    });
    const text = msg.content
      .filter((b) => b.type === "text")
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("");
    const parsed = JSON.parse(extractJson(text)) as {
      actions: StartTodayAction[];
    };
    if (Array.isArray(parsed.actions) && parsed.actions.length > 0) {
      return { actions: parsed.actions.slice(0, 3), ai: true };
    }
    return { actions: STATIC_START_TODAY, ai: false };
  } catch (err) {
    console.error("start-today error", err);
    return { actions: STATIC_START_TODAY, ai: false };
  }
}

/* ─────────── VC landscape refresh ─────────── */

export async function getLatestVcSnapshot(): Promise<VcSnapshot | null> {
  const rows = await db
    .select()
    .from(schema.vcSnapshots)
    .orderBy(desc(schema.vcSnapshots.refreshedAt))
    .limit(1);
  if (rows.length === 0) return null;
  return rows[0].payload as VcSnapshot;
}

function isValidSnapshot(x: unknown): x is VcSnapshot {
  const s = x as VcSnapshot;
  return (
    !!s &&
    typeof s.headline === "string" &&
    Array.isArray(s.stats) &&
    Array.isArray(s.aiShareTrend) &&
    Array.isArray(s.concentration) &&
    Array.isArray(s.themes) &&
    Array.isArray(s.firms)
  );
}

export async function refreshVcLandscape(): Promise<{
  ok: boolean;
  error?: string;
}> {
  await requireAuth();
  try {
    const today = new Date().toISOString().slice(0, 10);
    const msg = await anthropic().messages.create({
      model: MODEL_SMART,
      max_tokens: 3000,
      tools: [WEB_SEARCH_TOOL],
      system: `You are a venture-capital analyst. Use web search to find the LATEST 2026 venture funding data, then output a JSON object describing the current landscape. Use only figures you can support from search results; do not invent numbers. Respond ONLY with JSON in exactly this shape:
{"verified":"${today}","headline":"...","stats":[{"label":"...","value":"...","sub":"..."}],"aiShareTrend":[{"period":"2024","pct":48}],"concentration":[{"name":"OpenAI","value":122}],"themes":[{"title":"...","body":"..."}],"hot":["..."],"cold":["..."],"firms":[{"name":"...","stage":"...","focus":"..."}],"sources":[{"label":"...","url":"..."}]}
4 stats, 4-6 themes, 4-5 concentration entries ($B), 4-6 firms, 3-4 sources.`,
      messages: [
        {
          role: "user",
          content:
            "Refresh the venture-capital landscape snapshot with the most recent 2026 data: total VC, AI's share, capital concentration among top labs, what's hot vs cold, and the most active funds. Return only the JSON.",
        },
      ],
    });
    const text = msg.content
      .filter((b) => b.type === "text")
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("");
    const parsed = JSON.parse(extractJson(text));
    if (!isValidSnapshot(parsed)) {
      return { ok: false, error: "Could not parse a valid snapshot." };
    }
    await db.insert(schema.vcSnapshots).values({
      id: nanoid(),
      payload: parsed,
      refreshedAt: Date.now(),
    });
    return { ok: true };
  } catch (err) {
    console.error("vc refresh error", err);
    return { ok: false, error: "Refresh failed — showing the last snapshot." };
  }
}

/* ─────────── Case deep-dive generation ─────────── */

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

export type AiCasePayload = {
  company: string;
  markdown: string;
  verified: string;
};

export async function generateCaseDeepDive(
  company: string,
): Promise<{ ok: boolean; slug?: string; error?: string }> {
  await requireAuth();
  const name = company.trim();
  if (!name) return { ok: false, error: "Enter a company name." };
  const slug = `ai-${slugify(name)}`;

  try {
    const today = new Date().toISOString().slice(0, 10);
    const msg = await anthropic().messages.create({
      model: MODEL_SMART,
      max_tokens: 2600,
      tools: [WEB_SEARCH_TOOL],
      system: `You are a startup analyst writing a gritty, accurate case study. Use web search to research the company, then write a teardown in markdown with these exact section headings: "## Snapshot", "## The Origin", "## The Insight", "## What They Built", "## The Build", "## Design", "## Go-To-Market", "## The Money", "## Key Decisions", "## What To Steal", "## Sources". Be specific about the stack/software used, what was designed, timelines, and round-by-round funding. Cite real sources as markdown links under Sources. Flag anything uncertain rather than inventing it. Output ONLY the markdown, no preamble.`,
      messages: [
        { role: "user", content: `Write the case study for: ${name}` },
      ],
    });
    const markdown = msg.content
      .filter((b) => b.type === "text")
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("")
      .trim();
    if (markdown.length < 200) {
      return { ok: false, error: "Couldn't generate a useful case." };
    }

    const payload: AiCasePayload = { company: name, markdown, verified: today };
    const existing = await db
      .select({ id: schema.aiCases.id })
      .from(schema.aiCases)
      .where(eq(schema.aiCases.slug, slug))
      .limit(1);
    if (existing.length > 0) {
      await db
        .update(schema.aiCases)
        .set({ company: name, payload, createdAt: Date.now() })
        .where(eq(schema.aiCases.id, existing[0].id));
    } else {
      await db.insert(schema.aiCases).values({
        id: nanoid(),
        slug,
        company: name,
        payload,
        createdAt: Date.now(),
      });
    }
    return { ok: true, slug };
  } catch (err) {
    console.error("case gen error", err);
    return { ok: false, error: "Generation failed — try again." };
  }
}

export async function listAiCases(): Promise<
  Array<{ slug: string; company: string; verified: string }>
> {
  const rows = await db
    .select()
    .from(schema.aiCases)
    .orderBy(desc(schema.aiCases.createdAt))
    .limit(30);
  return rows.map((r) => {
    const p = r.payload as AiCasePayload;
    return { slug: r.slug, company: r.company, verified: p.verified };
  });
}

export async function getAiCase(slug: string): Promise<AiCasePayload | null> {
  const rows = await db
    .select()
    .from(schema.aiCases)
    .where(eq(schema.aiCases.slug, slug))
    .limit(1);
  if (rows.length === 0) return null;
  return rows[0].payload as AiCasePayload;
}
