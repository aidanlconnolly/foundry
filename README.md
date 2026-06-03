# Foundry

A staged, Duolingo-style learning app that teaches you to build a startup from **zero to scale**, with modern (2026) knowledge: a progress **path** of 8 stages (35 lessons), spaced-repetition flashcards, knowledge checks, an interactive toolkit, gritty case studies, a live VC-landscape tracker, a founder tool directory, a Wharton playbook, and an AI mentor.

Built as a personal/portfolio app for an aspiring founder (a Wharton MBA with a consulting background).

## Stack

- **Next.js 16** (App Router) + **TypeScript** (strict)
- **Tailwind v4** (theme in `app/globals.css` via `@theme` — no config file)
- **Turso (libSQL) + Drizzle ORM**
- **Anthropic SDK** — `claude-sonnet-4-6` (mentor / quiz / VC tracker + web search) and `claude-haiku-4-5` (cheap structured tasks)
- **MDX** lesson & case bodies (`next-mdx-remote`) + a typed content manifest
- **ts-fsrs** spaced repetition · **recharts** charts · **framer-motion** · **lucide-react**
- Auth: `jose` HS256 JWT + `bcryptjs`, route guard in `proxy.ts`

## Architecture

- **Curriculum spine** lives in `lib/content/manifest.ts` (8 stages → 35 lessons). Lesson and case **bodies** are MDX in `content/lessons/*.mdx` and `content/cases/*.mdx`, with structured frontmatter (`doThis`, `quiz`, `flashcards`, `verified`, `sources`).
- **Server Actions** in `lib/actions/*` own all per-user DB work (`requireAuth()` first). AI streaming runs through the `app/api/mentor` route handler.
- **Lazy DB client** (`lib/db/client.ts`) defers Turso validation until first use so `next build` doesn't fail on Vercel.
- **AI features** (`lib/actions/ai.ts`): Start Today engine, VC-landscape refresh (web search → cached in `vc_snapshots`), and "Generate deep-dive" case studies (→ `ai_cases`). All cache and **fall back to static content** if the API fails.

## Content accuracy

Factual content (VC figures, Wharton programs, company case studies) was verified via web search and **date-stamped** (`Last verified: …`) with cited sources. Figures from public reporting may be approximate; the VC landscape and cap-table tools include a **"not investment advice"** disclaimer. Re-verify before relying on any specific number.

## Local development

`node` is at `/opt/homebrew/bin/node` — prefix npm/npx commands with `PATH=/opt/homebrew/bin:$PATH`.

```bash
# 1. Install
PATH=/opt/homebrew/bin:$PATH npm install

# 2. Configure env (copy and fill)
cp .env.local.example .env.local
#   ANTHROPIC_API_KEY=sk-ant-...
#   TURSO_DATABASE_URL=...     # for local dev you can use file:local.db
#   TURSO_AUTH_TOKEN=...        # any non-empty value for a local file DB
#   AUTH_SECRET=...             # python3 -c "import secrets; print(secrets.token_hex(32))"

# 3. Apply the schema
set -a && source .env.local && set +a
PATH=/opt/homebrew/bin:$PATH npx drizzle-kit push

# 4. Run (port 5900)
PATH=/opt/homebrew/bin:$PATH npm run dev
PATH=/opt/homebrew/bin:$PATH npm run build   # tsc strict
PATH=/opt/homebrew/bin:$PATH npm run lint
```

A **local file DB** works for development: set `TURSO_DATABASE_URL=file:local.db` (with any non-empty `TURSO_AUTH_TOKEN`). Production uses a real Turso database.

## Deployment

Vercel via GitHub auto-deploy (push to `main`). Set `ANTHROPIC_API_KEY`, `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, and `AUTH_SECRET` in Vercel Project Settings → Environment Variables, and run `drizzle-kit push` against the production Turso database once.

## Routes

`/` Path · `/stage/[slug]` · `/lesson/[slug]` · `/flashcards` · `/cases` + `/cases/[slug]` · `/vc-landscape` · `/tools` · `/wharton` · `/mentor` · `/toolkit` · `/profile` · `/login` · `/register`
