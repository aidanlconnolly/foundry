# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A staged, Duolingo-style startup learning app ("Foundry") — 8 stages, 35 lessons, spaced-repetition flashcards, an AI mentor, a VC-landscape tracker, gritty case studies, a Wharton playbook, and an interactive toolkit (cap table, TAM, idea scorecard). Multi-user with email/password auth. Port **5900**.

Live at **https://foundry-beta-henna.vercel.app** (auto-deploys from `main`).

## Stack

**Next.js 16** (App Router), React 19, TypeScript strict, **Tailwind v4** (theme in `app/globals.css` via `@theme` — no `tailwind.config.ts`), **Turso (libSQL) + Drizzle ORM**, `ts-fsrs` (FSRS spaced repetition), Anthropic SDK (`claude-sonnet-4-6` for mentor/VC/case; `claude-haiku-4-5` for Start Today), `next-mdx-remote` (MDX lesson/case bodies), `recharts`, `framer-motion`, `lucide-react`, `jose` HS256 JWT + `bcryptjs`. No NextAuth.

## Common commands

```bash
# node is at /opt/homebrew/bin/node — prefix all npm/npx commands
PATH=/opt/homebrew/bin:$PATH npm run dev     # dev server on port 5900
PATH=/opt/homebrew/bin:$PATH npm run build   # TypeScript strict check + Next build
PATH=/opt/homebrew/bin:$PATH npm run lint

# DB — source env first
set -a && source .env.local && set +a
PATH=/opt/homebrew/bin:$PATH npx drizzle-kit push    # apply schema to DB
PATH=/opt/homebrew/bin:$PATH npx drizzle-kit studio  # GUI browser
```

Local dev uses `TURSO_DATABASE_URL=file:local.db` with any non-empty `TURSO_AUTH_TOKEN`. Production uses a real Turso database. Generate `AUTH_SECRET` with:
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

## Architecture

### Auth

`proxy.ts` (Next 16 middleware — **export must be named `proxy`**) redirects unauthenticated requests to `/login`. `lib/auth.ts` — `createSession` / `getSession` / `deleteSession` / `requireAuth()`. JWT in `__session` httpOnly cookie, 30-day expiry. Every per-user Server Action calls `await requireAuth()` first.

### Content — two layers

1. **Static manifest** (`lib/content/manifest.ts`) — 8 stages × lessons typed as `Stage[]`. Helper fns in `lib/content/index.ts`: `getStages`, `findLesson`, `nextLesson`, `getAllLessons`. The manifest is the source of truth for ordering and metadata; MDX bodies are optional per-lesson.

2. **MDX bodies** (`content/lessons/<slug>.mdx`, `content/cases/<slug>.mdx`) — compiled at request time via `next-mdx-remote` in `lib/content/mdx.ts`. Frontmatter carries `doThis`, `quiz` (MCQs), `flashcards`, `verified`, and `sources`. Static seeded data for tools/VC/Wharton/cases lives in `lib/content/{tools,vc,wharton,cases}.ts`.

### Database schema (`lib/db/schema.ts`)

Twelve tables: `users`, `profile`, `progress`, `flashcards`, `reviews` (FSRS state, one row per user×card), `quizAttempts`, `bookmarks`, `notes`, `mentorThreads`, `mentorMessages`, `vcSnapshots`, `aiCases`. Lazy Turso+Drizzle init via Proxy in `lib/db/client.ts` (prevents Vercel build-time failures).

### Server Actions

All per-user logic in `lib/actions/*.ts` (`"use server"`). No `app/api/` routes except the AI mentor streaming handler (`app/api/mentor/route.ts`). Split:

| File | Responsibility |
|---|---|
| `auth.ts` | register / login / logout / change-password + `ensureProfile` |
| `progress.ts` | lesson done, streak bump, profile/progress reads |
| `lesson.ts` | `getLessonState`, `completeLesson`, `toggleBookmark`, `saveNote`, `getBookmarked` |
| `flashcards.ts` | add cards, FSRS due cards, `rateCard`, deck stats, `seedFounderVocab` |
| `mentor.ts` | create/list/get/delete threads (messages persisted by the route handler) |
| `ai.ts` | `generateStartToday`, `refreshVcLandscape` (web search → `vcSnapshots`), `generateCaseDeepDive` (web search → `aiCases`), `getLatestVcSnapshot`, `getAiCase`, `listAiCases` |

### AI features (`lib/anthropic.ts` + `lib/actions/ai.ts`)

All server-side; key never reaches the client. Streaming mentor chat in `app/api/mentor/route.ts` (reads `X-Thread-Id` response header on the client). **All AI calls fall back to static content** on error — the app works fully without a key. `WEB_SEARCH_TOOL` (`web_search_20250305`) is passed to `refreshVcLandscape` and `generateCaseDeepDive` for live research. `extractJson` strips ` ```json ` fences before parsing.

### FSRS (spaced repetition)

`lib/srs.ts` wraps `ts-fsrs`. `reviews.fsrs_due` is an integer (Unix ms) for cheap `WHERE fsrs_due <= now` queries. `reviews.fsrs_state` is a JSON blob with `FsrsCardState`. Shared `flashcards` table; per-user scheduling in `reviews`.

### Tailwind v4

No config file. All tokens defined as CSS custom properties in `app/globals.css` under `@theme inline { }`. Key color vars: `--accent` (amber `#f5a524`), `--bg`, `--surface`, `--surface-2`, `--surface-3`, `--border`, `--border-strong`, `--fg`, `--muted`, `--faint`. Editorial serif class: `prose-editorial` (Newsreader font).

### Nav shell (`components/AppShell.tsx`)

Client component. Left rail on desktop (≥md), bottom tab bar on mobile. Six primary tabs: Path / Cases / VC / Tools / Wharton / Mentor. Two secondary in the rail only: Flashcards / Toolkit. Active state: `isActive(pathname, href)`.

## Adding content

**New lesson MDX:** create `content/lessons/<slug>.mdx` matching a slug already in `lib/content/manifest.ts`. Frontmatter keys: `verified` (required, ISO date), `doThis`, `quiz[]` (`q, options[], answer, explain`), `flashcards[]` (`term, definition`), `sources[]` (`label, url`).

**New case study:** add a `CaseMeta` entry to `CASE_INDEX` in `lib/content/cases.ts`, then create `content/cases/<slug>.mdx` with the standard template sections (Snapshot → Origin → Insight → What They Built → The Build → Design → GTM → The Money → Key Decisions → What To Steal → Sources).

**New stage/lesson:** add to `STAGES` in `lib/content/manifest.ts`. Slug must be stable — progress and flashcards key off it.

## Environment variables

Required in `.env.local` and Vercel:

```
ANTHROPIC_API_KEY      # get from console.anthropic.com
TURSO_DATABASE_URL     # libsql://foundry-<org>.turso.io  (or file:local.db for dev)
TURSO_AUTH_TOKEN       # turso db tokens create foundry  (any value for local file DB)
AUTH_SECRET            # 32-byte hex
```

## Content accuracy directive

Every lesson and case with factual claims about VCs, Wharton programs, or companies must have a `verified` date-stamp and cited sources. Mark anything uncertain `// TODO: verify` rather than inventing it. The VC landscape and cap-table toolkit carry "not investment advice" disclaimers.

## Deployment notes

`proxy.ts` middleware must export `proxy` (not `default` or `middleware`) — this is a Next.js 16 breaking change. All auth-gated pages need `export const dynamic = "force-dynamic"` to prevent build-time prerender failures on Vercel. The `outputFileTracingIncludes` in `next.config.ts` ensures the `content/` MDX directory is bundled into the serverless build.
