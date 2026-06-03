import Link from "next/link";
import { Flame, Check, ArrowRight, Lock, Circle } from "lucide-react";
import { getStages, getAllLessons } from "@/lib/content";
import { getProgressMap, getProfile } from "@/lib/actions/progress";
import ProgressRing from "@/components/ProgressRing";
import Reveal from "@/components/Reveal";
import StartToday from "@/components/StartToday";

export const dynamic = "force-dynamic";

export default async function PathHome() {
  const stages = getStages();
  const [progress, profile] = await Promise.all([
    getProgressMap(),
    getProfile(),
  ]);

  const all = getAllLessons();
  const doneCount = all.filter((l) => progress[l.slug] === "done").length;
  const pct = all.length ? doneCount / all.length : 0;

  const next = all.find((l) => progress[l.slug] !== "done") ?? null;
  const frontierIndex = next ? all.findIndex((l) => l.slug === next.slug) : all.length;

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <Reveal>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-faint">Zero to scale</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
              The Path
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm">
              <Flame
                className={`h-4 w-4 ${profile.streakCount > 0 ? "text-accent" : "text-faint"}`}
              />
              <span className="font-semibold text-fg">{profile.streakCount}</span>
              <span className="text-faint">day{profile.streakCount === 1 ? "" : "s"}</span>
            </div>
            <ProgressRing value={pct} label={`${doneCount}/${all.length}`} />
          </div>
        </div>
      </Reveal>

      {/* ── Start Today / Continue ── */}
      <Reveal delay={0.05}>
        <div className="grid gap-4 sm:grid-cols-2">
          <StartToday />

          <div className="rounded-2xl border border-border bg-surface p-5">
            <span className="text-xs font-semibold uppercase tracking-wide text-faint">
              {next ? "Continue" : "Review"}
            </span>
            {next ? (
              <>
                <p className="mt-2 line-clamp-2 text-sm font-medium text-fg">
                  {next.title}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-muted">
                  {next.objective}
                </p>
                <Link
                  href={`/lesson/${next.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-accent-fg transition hover:bg-accent-strong"
                >
                  Continue <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </>
            ) : (
              <>
                <p className="mt-2 text-sm text-muted">
                  Every lesson complete. Keep your concepts sharp with flashcards.
                </p>
                <Link
                  href="/flashcards"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-accent-fg transition hover:bg-accent-strong"
                >
                  Review flashcards <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </Reveal>

      {/* ── The stages ── */}
      <div className="space-y-4">
        {stages.map((stage, i) => {
          const stageLessons = stage.lessons;
          const stageDone = stageLessons.filter(
            (l) => progress[l.slug] === "done",
          ).length;
          const stagePct = stageDone / stageLessons.length;
          const stageComplete = stageDone === stageLessons.length;

          return (
            <Reveal key={stage.slug} delay={0.04 * i}>
              <section className="rounded-2xl border border-border bg-surface p-5">
                <Link
                  href={`/stage/${stage.slug}`}
                  className="group flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-bold ${
                        stageComplete
                          ? "bg-accent text-accent-fg"
                          : "border border-border-strong bg-surface-2 text-muted"
                      }`}
                    >
                      {stageComplete ? <Check className="h-4 w-4" /> : stage.index}
                    </span>
                    <div>
                      <h2 className="font-semibold text-fg transition group-hover:text-accent-strong">
                        {stage.title}
                      </h2>
                      <p className="mt-0.5 text-sm text-muted">{stage.tagline}</p>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-faint">
                    {stageDone}/{stageLessons.length}
                  </span>
                </Link>

                {/* stage progress bar */}
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{ width: `${stagePct * 100}%` }}
                  />
                </div>

                {/* lessons */}
                <ul className="mt-4 space-y-1">
                  {stageLessons.map((lesson) => {
                    const status = progress[lesson.slug];
                    const done = status === "done";
                    const globalIdx = all.findIndex((l) => l.slug === lesson.slug);
                    const isNext = globalIdx === frontierIndex;
                    const ahead = globalIdx > frontierIndex;

                    return (
                      <li key={lesson.slug}>
                        <Link
                          href={`/lesson/${lesson.slug}`}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition hover:bg-surface-2 ${
                            isNext ? "bg-accent-soft/40 ring-1 ring-accent/30" : ""
                          }`}
                        >
                          <span className="shrink-0">
                            {done ? (
                              <Check className="h-4 w-4 text-accent" />
                            ) : isNext ? (
                              <Circle className="h-4 w-4 fill-accent/20 text-accent" />
                            ) : ahead ? (
                              <Lock className="h-3.5 w-3.5 text-faint" />
                            ) : (
                              <Circle className="h-4 w-4 text-faint" />
                            )}
                          </span>
                          <span
                            className={`flex-1 ${done ? "text-muted" : "text-fg"} ${
                              isNext ? "font-medium" : ""
                            }`}
                          >
                            {lesson.title}
                          </span>
                          <span className="shrink-0 text-xs text-faint">
                            {lesson.minutes} min
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
