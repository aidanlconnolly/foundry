import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx/components";

/** Structured data carried in a lesson's MDX frontmatter. */
export type LessonFrontmatter = {
  /** The concrete "Do this" action for the lesson. */
  doThis?: string;
  /** ISO date the factual content was last verified. */
  verified?: string;
  sources?: Array<{ label: string; url: string }>;
  quiz?: Array<{
    q: string;
    options: string[];
    /** Index of the correct option. */
    answer: number;
    explain?: string;
  }>;
  flashcards?: Array<{ term: string; definition: string }>;
};

export type CompiledLesson = {
  content: React.ReactElement;
  frontmatter: LessonFrontmatter;
};

const LESSONS_DIR = path.join(process.cwd(), "content", "lessons");
const CASES_DIR = path.join(process.cwd(), "content", "cases");

async function readIfExists(file: string): Promise<string | null> {
  try {
    return await fs.readFile(file, "utf8");
  } catch {
    return null;
  }
}

/** Compile a lesson MDX file, or return null if it hasn't been written yet. */
export async function getLessonContent(
  slug: string,
): Promise<CompiledLesson | null> {
  const raw = await readIfExists(path.join(LESSONS_DIR, `${slug}.mdx`));
  if (raw === null) return null;
  const { content, frontmatter } = await compileMDX<LessonFrontmatter>({
    source: raw,
    components: mdxComponents,
    options: { parseFrontmatter: true },
  });
  return { content, frontmatter };
}

export async function lessonExists(slug: string): Promise<boolean> {
  try {
    await fs.access(path.join(LESSONS_DIR, `${slug}.mdx`));
    return true;
  } catch {
    return false;
  }
}

/** Slugs of all lessons that have an MDX body written. */
export async function writtenLessonSlugs(): Promise<Set<string>> {
  try {
    const files = await fs.readdir(LESSONS_DIR);
    return new Set(
      files.filter((f) => f.endsWith(".mdx")).map((f) => f.replace(/\.mdx$/, "")),
    );
  } catch {
    return new Set();
  }
}

/* ── Cases (used in Phase 4) ── */

export type CaseFrontmatter = {
  company: string;
  sector?: string;
  founded?: string;
  founders?: string;
  status?: string;
  raised?: string;
  era?: string;
  verified?: string;
};

export async function getCaseContent(slug: string): Promise<{
  content: React.ReactElement;
  frontmatter: CaseFrontmatter;
} | null> {
  const raw = await readIfExists(path.join(CASES_DIR, `${slug}.mdx`));
  if (raw === null) return null;
  const { content, frontmatter } = await compileMDX<CaseFrontmatter>({
    source: raw,
    components: mdxComponents,
    options: { parseFrontmatter: true },
  });
  return { content, frontmatter };
}

export async function writtenCaseSlugs(): Promise<string[]> {
  try {
    const files = await fs.readdir(CASES_DIR);
    return files.filter((f) => f.endsWith(".mdx")).map((f) => f.replace(/\.mdx$/, ""));
  } catch {
    return [];
  }
}
