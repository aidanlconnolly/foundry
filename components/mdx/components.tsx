import type { MDXComponents } from "mdx/types";
import { Lightbulb, Quote } from "lucide-react";

/** A boxed framework / aside used inside lesson prose. */
function Callout({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="my-6 rounded-xl border border-border bg-surface-2 p-4">
      {title && (
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-accent-strong">
          <Lightbulb className="h-4 w-4" />
          {title}
        </div>
      )}
      <div className="text-[0.95rem] leading-relaxed text-muted [&_p:last-child]:mb-0 [&_p]:mb-2">
        {children}
      </div>
    </aside>
  );
}

/** A highlighted framework block with a numbered or named structure. */
function Framework({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div className="my-6 rounded-xl border border-accent/25 bg-gradient-to-br from-accent-soft/40 to-surface p-5">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-strong">
        Framework · {name}
      </div>
      <div className="text-[0.95rem] leading-relaxed text-fg [&_p:last-child]:mb-0 [&_p]:mb-2">
        {children}
      </div>
    </div>
  );
}

function Pull({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 flex gap-3 border-l-2 border-accent pl-4 text-lg italic text-fg">
      <Quote className="mt-1 h-4 w-4 shrink-0 text-accent" />
      <span>{children}</span>
    </div>
  );
}

export const mdxComponents: MDXComponents = {
  Callout,
  Framework,
  Pull,
};
