import {
  ShieldCheck,
  GraduationCap,
  Trophy,
  Users,
  BookOpen,
  ExternalLink,
  ListChecks,
} from "lucide-react";
import {
  PROGRAMS,
  CLASSES,
  STORIES,
  USE_IT_NOW,
  WHARTON_SOURCES,
  WHARTON_VERIFIED,
} from "@/lib/content/wharton";

export default function WhartonPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-fg">
          Wharton Playbook
        </h1>
        <p className="mt-1 max-w-prose text-muted">
          The programs, funding, classes, and clubs a Wharton MBA can actually
          use to start a company — and exactly when to pull each lever.
        </p>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-faint">
          <ShieldCheck className="h-3.5 w-3.5" /> Verified {WHARTON_VERIFIED}
        </p>
      </div>

      {/* Programs */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-fg">
          <GraduationCap className="h-5 w-5 text-accent" /> Programs & founding
          help
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {PROGRAMS.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-2xl border border-border bg-surface p-4 transition hover:border-border-strong"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-fg">{p.name}</h3>
                <ExternalLink className="h-4 w-4 shrink-0 text-faint transition group-hover:text-fg" />
              </div>
              <p className="mt-0.5 text-xs font-medium text-accent-strong">
                {p.what}
              </p>
              <p className="mt-2 text-sm text-muted">{p.detail}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Use it now */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-fg">
          <ListChecks className="h-5 w-5 text-accent" /> Use it now
        </h2>
        <div className="overflow-hidden rounded-2xl border border-border">
          {USE_IT_NOW.map((u, i) => (
            <div
              key={u.stage}
              className={`flex flex-col gap-1 p-4 sm:flex-row sm:gap-4 ${
                i > 0 ? "border-t border-border" : ""
              } bg-surface`}
            >
              <div className="shrink-0 sm:w-48">
                <span className="text-sm font-semibold text-accent-strong">
                  {u.stage}
                </span>
              </div>
              <p className="text-sm text-muted">{u.action}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Classes + Clubs */}
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-fg">
            <BookOpen className="h-4 w-4 text-accent" /> Representative classes
          </h2>
          <ul className="space-y-2 text-sm text-muted">
            {CLASSES.map((c) => (
              <li key={c} className="flex gap-2">
                <span className="text-accent">•</span> {c}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-faint">
            Illustrative — confirm exact course numbers in the live catalog.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-fg">
            <Users className="h-4 w-4 text-accent" /> Clubs & community
          </h2>
          <ul className="space-y-2 text-sm text-muted">
            <li className="flex gap-2">
              <span className="text-accent">•</span> Wharton Entrepreneurship
              Club — treks, speaker series, founder community
            </li>
            <li className="flex gap-2">
              <span className="text-accent">•</span> Venture Lab founder
              community + Founder Floor at Tangen Hall
            </li>
            <li className="flex gap-2">
              <span className="text-accent">•</span> Entrepreneur-in-Residence
              office hours (free, tactical)
            </li>
          </ul>
        </section>
      </div>

      {/* Success stories */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-fg">
          <Trophy className="h-5 w-5 text-accent" /> Success stories
        </h2>
        <div className="space-y-3">
          {STORIES.map((s) => (
            <div key={s.name} className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold text-fg">{s.name}</h3>
                <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs text-accent-strong">
                  {s.when}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-faint">{s.founders}</p>
              <p className="mt-2 text-sm text-muted">{s.story}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sources */}
      <section className="rounded-2xl border border-border bg-surface/50 p-4 text-sm">
        <p className="mb-1 font-medium text-fg">Sources</p>
        <ul className="space-y-1">
          {WHARTON_SOURCES.map((src) => (
            <li key={src.url}>
              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-strong hover:underline"
              >
                {src.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
