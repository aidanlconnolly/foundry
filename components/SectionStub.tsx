import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/** Crisp placeholder for sections that land in a later build phase. */
export default function SectionStub({
  title,
  blurb,
}: {
  title: string;
  blurb: string;
}) {
  return (
    <div className="py-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-faint transition hover:text-fg"
      >
        <ArrowLeft className="h-4 w-4" /> The Path
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-fg">{title}</h1>
      <p className="mt-2 max-w-prose text-muted">{blurb}</p>
      <div className="mt-6 rounded-2xl border border-dashed border-border bg-surface/50 p-8 text-center text-sm text-faint">
        This section is being built out in this release.
      </div>
    </div>
  );
}
