import { STAGES } from "./manifest";
import type { Lesson, Stage } from "./types";

export { STAGES };
export type { Lesson, Stage };

export function getStages(): Stage[] {
  return STAGES;
}

export function findStage(slug: string): Stage | undefined {
  return STAGES.find((s) => s.slug === slug);
}

/** All lessons across all stages, in path order. */
export function getAllLessons(): Array<Lesson & { stageSlug: string }> {
  return STAGES.flatMap((s) =>
    s.lessons.map((l) => ({ ...l, stageSlug: s.slug })),
  );
}

export function findLesson(
  slug: string,
): (Lesson & { stage: Stage; indexInStage: number }) | undefined {
  for (const stage of STAGES) {
    const idx = stage.lessons.findIndex((l) => l.slug === slug);
    if (idx >= 0) {
      return { ...stage.lessons[idx], stage, indexInStage: idx };
    }
  }
  return undefined;
}

/** The lesson immediately after the given one, in path order (or undefined). */
export function nextLesson(
  slug: string,
): (Lesson & { stageSlug: string }) | undefined {
  const all = getAllLessons();
  const i = all.findIndex((l) => l.slug === slug);
  if (i < 0 || i + 1 >= all.length) return undefined;
  return all[i + 1];
}

export function totalLessonCount(): number {
  return getAllLessons().length;
}
