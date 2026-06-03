import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Target, Wrench, ShieldCheck } from "lucide-react";
import { findLesson, nextLesson } from "@/lib/content";
import { getLessonContent } from "@/lib/content/mdx";
import { getLessonState } from "@/lib/actions/lesson";
import KnowledgeCheck from "@/components/lesson/KnowledgeCheck";
import AddToDeckButton from "@/components/lesson/AddToDeckButton";
import BookmarkButton from "@/components/lesson/BookmarkButton";
import NotePanel from "@/components/lesson/NotePanel";

export const dynamic = "force-dynamic";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = findLesson(slug);
  if (!lesson) notFound();

  const [compiled, state] = await Promise.all([
    getLessonContent(slug),
    getLessonState(slug),
  ]);
  const next = nextLesson(slug);
  const nextHref = next ? `/lesson/${next.slug}` : undefined;
  const fm = compiled?.frontmatter;

  return (
    <article className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/stage/${lesson.stage.slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-faint transition hover:text-fg"
        >
          <ArrowLeft className="h-4 w-4" /> {lesson.stage.title}
        </Link>
        <BookmarkButton type="lesson" slug={slug} initial={state.bookmarked} />
      </div>

      {/* Objective + title */}
      <header>
        <div className="flex items-center gap-1.5 text-sm font-medium text-accent-strong">
          <Target className="h-4 w-4" /> Objective
        </div>
        <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-fg">
          {lesson.title}
        </h1>
        <p className="mt-2 text-muted">{lesson.objective}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-faint">
          <span>Stage {lesson.stage.index} · {lesson.stage.title}</span>
          <span>·</span>
          <span>{lesson.minutes} min</span>
          {fm?.verified && (
            <>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Verified {fm.verified}
              </span>
            </>
          )}
        </div>
      </header>

      {!compiled ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-8 text-center text-sm text-faint">
          Lesson content is being written in this release.
        </div>
      ) : (
        <>
          {/* Body */}
          <div className="prose-editorial">{compiled.content}</div>

          {/* Sources */}
          {fm?.sources && fm.sources.length > 0 && (
            <div className="rounded-xl border border-border bg-surface/50 p-4 text-sm">
              <p className="mb-1 font-medium text-fg">Sources</p>
              <ul className="space-y-1">
                {fm.sources.map((s, i) => (
                  <li key={i}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-strong hover:underline"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Do this */}
          {fm?.doThis && (
            <div className="rounded-2xl border border-accent/30 bg-gradient-to-br from-accent-soft/50 to-surface p-5">
              <div className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-accent-strong">
                <Wrench className="h-4 w-4" /> Do this
              </div>
              <p className="text-sm text-fg">{fm.doThis}</p>
              {lesson.tool && (
                <Link
                  href={lesson.tool.href}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-surface-2 px-3 py-1.5 text-sm font-medium text-fg transition hover:bg-surface-3"
                >
                  <Wrench className="h-3.5 w-3.5 text-accent" /> {lesson.tool.label}
                </Link>
              )}
            </div>
          )}

          {/* Flashcards */}
          {fm?.flashcards && fm.flashcards.length > 0 && (
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-sm font-semibold text-fg">
                Add these to your flashcards
              </p>
              <ul className="mt-3 space-y-2">
                {fm.flashcards.map((c, i) => (
                  <li key={i} className="text-sm">
                    <span className="font-medium text-fg">{c.term}</span>
                    <span className="text-muted"> — {c.definition}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <AddToDeckButton cards={fm.flashcards} sourceLessonSlug={slug} />
              </div>
            </div>
          )}

          {/* Knowledge check + complete */}
          <KnowledgeCheck
            quiz={fm?.quiz ?? []}
            lessonSlug={slug}
            stageSlug={lesson.stage.slug}
            initialDone={state.done}
            nextHref={nextHref}
          />

          {/* Notes */}
          <NotePanel slug={slug} initial={state.note} />
        </>
      )}
    </article>
  );
}
