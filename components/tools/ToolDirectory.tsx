"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Star, ArrowUpRight } from "lucide-react";
import {
  TOOLS,
  TOOL_CATEGORIES,
  STAGE_LABEL,
  STARTER_STACKS,
  type ToolCategory,
  type ToolStage,
} from "@/lib/content/tools";

const STAGES: ToolStage[] = ["idea", "mvp", "revenue", "scaling"];

export default function ToolDirectory() {
  const [view, setView] = useState<"all" | "stack">("all");
  const [cat, setCat] = useState<ToolCategory | "All">("All");
  const [stage, setStage] = useState<ToolStage | "All">("All");

  const filtered = useMemo(
    () =>
      TOOLS.filter(
        (t) =>
          (cat === "All" || t.category === cat) &&
          (stage === "All" || t.stage === stage),
      ),
    [cat, stage],
  );

  return (
    <div className="space-y-5">
      {/* view toggle */}
      <div className="inline-flex rounded-lg border border-border bg-surface p-0.5 text-sm">
        {(["all", "stack"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={`rounded-md px-3 py-1.5 font-medium transition ${
              view === v
                ? "bg-accent text-accent-fg"
                : "text-muted hover:text-fg"
            }`}
          >
            {v === "all" ? "All tools" : "Starter stack by stage"}
          </button>
        ))}
      </div>

      {view === "all" ? (
        <>
          {/* filters */}
          <div className="space-y-2">
            <Chips
              options={["All", ...TOOL_CATEGORIES]}
              value={cat}
              onChange={(v) => setCat(v as ToolCategory | "All")}
            />
            <Chips
              options={["All", ...STAGES]}
              value={stage}
              onChange={(v) => setStage(v as ToolStage | "All")}
              labelFor={(o) =>
                o === "All" ? "All stages" : STAGE_LABEL[o as ToolStage]
              }
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map((t) => (
              <a
                key={t.name}
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-2xl border border-border bg-surface p-4 transition hover:border-border-strong"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-fg">{t.name}</h3>
                    {t.goodDefault && (
                      <span title="Good default">
                        <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                      </span>
                    )}
                  </div>
                  <ExternalLink className="h-4 w-4 shrink-0 text-faint transition group-hover:text-fg" />
                </div>
                <p className="mt-1.5 flex-1 text-sm text-muted">{t.whatFor}</p>
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="rounded-md bg-surface-2 px-2 py-0.5 text-faint">
                    {t.category}
                  </span>
                  <span className="rounded-md bg-accent-soft/50 px-2 py-0.5 text-accent-strong">
                    Adopt at {STAGE_LABEL[t.stage]}
                  </span>
                </div>
              </a>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-sm text-faint">No tools match that filter.</p>
          )}
        </>
      ) : (
        <div className="space-y-5">
          {STAGES.map((s) => (
            <section key={s}>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-fg">
                <span className="rounded-md bg-accent-soft/50 px-2 py-0.5 text-xs text-accent-strong">
                  {STAGE_LABEL[s]}
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {STARTER_STACKS[s].map((name) => {
                  const t = TOOLS.find((x) => x.name === name);
                  if (!t) return null;
                  return (
                    <a
                      key={name}
                      href={t.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-fg transition hover:border-border-strong"
                    >
                      {name}
                      <ArrowUpRight className="h-3.5 w-3.5 text-faint" />
                    </a>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function Chips({
  options,
  value,
  onChange,
  labelFor,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  labelFor?: (o: string) => string;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
            value === o
              ? "border-accent bg-accent-soft/50 text-accent-strong"
              : "border-border text-muted hover:border-border-strong hover:text-fg"
          }`}
        >
          {labelFor ? labelFor(o) : o}
        </button>
      ))}
    </div>
  );
}
