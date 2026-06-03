import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import { getCaseContent } from "@/lib/content/mdx";
import { findCaseMeta } from "@/lib/content/cases";
import { getBookmarked } from "@/lib/actions/lesson";
import { getAiCase } from "@/lib/actions/ai";
import BookmarkButton from "@/components/lesson/BookmarkButton";
import MarkdownLite from "@/components/MarkdownLite";

export const dynamic = "force-dynamic";

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const compiled = await getCaseContent(slug);

  // AI-generated case fallback.
  if (!compiled) {
    const ai = await getAiCase(slug);
    if (!ai) notFound();
    const bookmarked = await getBookmarked("case", slug);
    return (
      <article className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/cases"
            className="inline-flex items-center gap-1.5 text-sm text-faint transition hover:text-fg"
          >
            <ArrowLeft className="h-4 w-4" /> Case Studies
          </Link>
          <BookmarkButton type="case" slug={slug} initial={bookmarked} />
        </div>
        <header>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-accent-soft/50 px-2 py-0.5 text-xs text-accent-strong">
            <Sparkles className="h-3.5 w-3.5" /> AI-generated · {ai.verified}
          </span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg">
            {ai.company}
          </h1>
          <p className="mt-2 text-xs text-faint">
            Drafted by the AI mentor with web search. Verify specifics before
            relying on them.
          </p>
        </header>
        <div className="prose-editorial">
          <MarkdownLite text={ai.markdown} />
        </div>
      </article>
    );
  }

  const fm = compiled.frontmatter;
  const meta = findCaseMeta(slug);
  const bookmarked = await getBookmarked("case", slug);

  return (
    <article className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/cases"
          className="inline-flex items-center gap-1.5 text-sm text-faint transition hover:text-fg"
        >
          <ArrowLeft className="h-4 w-4" /> Case Studies
        </Link>
        <BookmarkButton type="case" slug={slug} initial={bookmarked} />
      </div>

      <header>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {meta && (
            <>
              <span className="rounded-md bg-surface-2 px-2 py-0.5 text-faint">
                {meta.sector}
              </span>
              <span className="rounded-md bg-surface-2 px-2 py-0.5 text-faint">
                {meta.era}
              </span>
            </>
          )}
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg">
          {fm.company}
        </h1>

        {/* Snapshot facts */}
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 rounded-2xl border border-border bg-surface p-4 text-sm sm:grid-cols-3">
          {fm.founded && <Fact label="Founded" value={fm.founded} />}
          {fm.founders && <Fact label="Founders" value={fm.founders} />}
          {fm.status && <Fact label="Status" value={fm.status} />}
          {fm.raised && <Fact label="Raised" value={fm.raised} wide />}
        </dl>
        {fm.verified && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-faint">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified {fm.verified}
          </p>
        )}
      </header>

      <div className="prose-editorial">{compiled.content}</div>
    </article>
  );
}

function Fact({
  label,
  value,
  wide,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "col-span-2 sm:col-span-3" : ""}>
      <dt className="text-xs uppercase tracking-wide text-faint">{label}</dt>
      <dd className="mt-0.5 text-fg">{value}</dd>
    </div>
  );
}
