/**
 * Typed content manifest. The curriculum spine (stages → lessons) is declared
 * here in TypeScript; the long-form lesson bodies live as MDX files under
 * `content/lessons/<slug>.mdx`. A lesson without an MDX file renders a
 * "coming soon" state but still appears on the Path.
 */

export type Lesson = {
  slug: string;
  title: string;
  /** One-line objective shown at the top of the lesson. */
  objective: string;
  /** Rough read time in minutes. */
  minutes: number;
  /** Optional pointer to an interactive tool this lesson unlocks. */
  tool?: { href: string; label: string };
};

export type Stage = {
  slug: string;
  /** Display order, 0-based (matches the spec's "Stage 0…7"). */
  index: number;
  title: string;
  /** Short editorial tagline for the stage node + overview. */
  tagline: string;
  lessons: Lesson[];
};
