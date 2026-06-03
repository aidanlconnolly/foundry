import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { findLesson } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = findLesson(slug);
  if (!lesson) notFound();

  return (
    <article className="mx-auto max-w-2xl space-y-4">
      <Link
        href={`/stage/${lesson.stage.slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-faint transition hover:text-fg"
      >
        <ArrowLeft className="h-4 w-4" /> {lesson.stage.title}
      </Link>
      <p className="text-sm font-medium text-accent-strong">Objective</p>
      <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
        {lesson.title}
      </h1>
      <p className="text-muted">{lesson.objective}</p>
      <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-8 text-center text-sm text-faint">
        Lesson content is being written in this release.
      </div>
    </article>
  );
}
