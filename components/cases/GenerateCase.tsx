"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight } from "lucide-react";
import { generateCaseDeepDive } from "@/lib/actions/ai";

export default function GenerateCase() {
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function generate() {
    if (!company.trim()) return;
    setError(null);
    start(async () => {
      const res = await generateCaseDeepDive(company);
      if (res.ok && res.slug) router.push(`/cases/${res.slug}`);
      else setError(res.error ?? "Generation failed.");
    });
  }

  return (
    <div className="rounded-2xl border border-accent/30 bg-gradient-to-br from-accent-soft/50 to-surface p-5">
      <div className="flex items-center gap-2 text-accent-strong">
        <Sparkles className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-wide">
          Generate a deep-dive
        </span>
      </div>
      <p className="mt-2 text-sm text-muted">
        Name any company and the mentor will research and draft a gritty
        teardown in the same template. AI-generated and dated.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generate()}
          placeholder="e.g. Cursor, Wiz, Ramp, Deel…"
          className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-fg outline-none placeholder:text-faint focus:border-accent"
        />
        <button
          type="button"
          onClick={generate}
          disabled={pending || !company.trim()}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-fg transition hover:bg-accent-strong disabled:opacity-60"
        >
          {pending ? "Researching…" : "Generate"}
          {!pending && <ArrowRight className="h-3.5 w-3.5" />}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-bad">{error}</p>}
      {pending && (
        <p className="mt-2 text-xs text-faint">
          Researching with web search — this can take 20–40 seconds.
        </p>
      )}
    </div>
  );
}
