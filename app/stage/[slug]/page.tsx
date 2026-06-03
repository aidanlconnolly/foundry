import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Circle, ArrowRight, Wrench } from "lucide-react";
import { findStage } from "@/lib/content";
import { getProgressMap } from "@/lib/actions/progress";
import ProgressRing from "@/components/ProgressRing";

export const dynamic = "force-dynamic";

export default async function StagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stage = findStage(slug);
  if (!stage) notFound();

  const progress = await getProgressMap();
  const doneCount = stage.lessons.filter((l) => progress[l.slug] === "done").length;
  const pct = doneCount / stage.lessons.length;

  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-faint transition hover:text-fg"
      >
        <ArrowLeft className="h-4 w-4" /> The Path
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-faint">Stage {stage.index}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            {stage.title}
          </h1>
          <p className="mt-2 max-w-prose text-muted">{stage.tagline}</p>
        </div>
        <ProgressRing value={pct} label={`${doneCount}/${stage.lessons.length}`} />
      </div>

      <ul className="space-y-2">
        {stage.lessons.map((lesson, i) => {
          const done = progress[lesson.slug] === "done";
          return (
            <li key={lesson.slug}>
              <Link
                href={`/lesson/${lesson.slug}`}
                className="group flex items-start gap-4 rounded-2xl border border-border bg-surface p-4 transition hover:border-border-strong"
              >
                <span className="mt-0.5 shrink-0">
                  {done ? (
                    <Check className="h-5 w-5 text-accent" />
                  ) : (
                    <Circle className="h-5 w-5 text-faint" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-medium text-fg transition group-hover:text-accent-strong">
                      {lesson.title}
                    </h2>
                  </div>
                  <p className="mt-1 text-sm text-muted">{lesson.objective}</p>
                  {lesson.tool && (
                    <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-surface-2 px-2 py-1 text-xs text-accent-strong">
                      <Wrench className="h-3 w-3" /> {lesson.tool.label}
                    </span>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="text-xs text-faint">{lesson.minutes} min</span>
                  <ArrowRight className="h-4 w-4 text-faint transition group-hover:translate-x-0.5 group-hover:text-fg" />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
