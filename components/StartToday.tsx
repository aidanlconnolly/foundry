"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, RotateCcw } from "lucide-react";
import { generateStartToday, type StartTodayAction } from "@/lib/actions/ai";

export default function StartToday() {
  const [input, setInput] = useState("");
  const [actions, setActions] = useState<StartTodayAction[] | null>(null);
  const [pending, start] = useTransition();

  function plan() {
    start(async () => {
      const res = await generateStartToday(input);
      setActions(res.actions);
    });
  }

  return (
    <div className="rounded-2xl border border-accent/30 bg-gradient-to-br from-accent-soft/60 to-surface p-5">
      <div className="flex items-center gap-2 text-accent-strong">
        <Sparkles className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-wide">
          Start today
        </span>
      </div>

      {actions ? (
        <div className="mt-3 space-y-2">
          {actions.map((a, i) => {
            const inner = (
              <>
                <p className="text-sm font-medium text-fg">{a.title}</p>
                <p className="mt-0.5 text-xs text-muted">{a.detail}</p>
              </>
            );
            return a.href ? (
              <Link
                key={i}
                href={a.href}
                className="block rounded-lg bg-surface-2/60 p-2.5 transition hover:bg-surface-2"
              >
                {inner}
              </Link>
            ) : (
              <div key={i} className="rounded-lg bg-surface-2/60 p-2.5">
                {inner}
              </div>
            );
          })}
          <button
            type="button"
            onClick={() => setActions(null)}
            className="inline-flex items-center gap-1.5 pt-1 text-xs text-faint hover:text-fg"
          >
            <RotateCcw className="h-3 w-3" /> Plan again
          </button>
        </div>
      ) : (
        <>
          <p className="mt-2 text-sm text-muted">
            Tell me where you are and I&apos;ll give you 3 concrete moves for
            this week, tied to your stage.
          </p>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && plan()}
            placeholder="e.g. I have an idea but no users yet"
            className="mt-3 w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-fg outline-none placeholder:text-faint focus:border-accent"
          />
          <button
            type="button"
            onClick={plan}
            disabled={pending}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-accent-fg transition hover:bg-accent-strong disabled:opacity-60"
          >
            {pending ? "Thinking…" : "Plan my week"}
            {!pending && <ArrowRight className="h-3.5 w-3.5" />}
          </button>
        </>
      )}
    </div>
  );
}
