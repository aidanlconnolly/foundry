import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import CasesIndex from "@/components/cases/CasesIndex";
import GenerateCase from "@/components/cases/GenerateCase";
import { listAiCases } from "@/lib/actions/ai";

export const dynamic = "force-dynamic";

export default async function CasesPage() {
  const aiCases = await listAiCases();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-fg">
          Case Studies
        </h1>
        <p className="mt-1 max-w-prose text-muted">
          Gritty teardowns of how real companies were actually built — the
          insight, the stack, the design calls, the timeline, and round-by-round
          money. Each follows the same template so they&apos;re comparable.
        </p>
      </div>

      <CasesIndex />

      <GenerateCase />

      {aiCases.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-fg">
            <Sparkles className="h-4 w-4 text-accent" /> Your AI-generated
            deep-dives
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {aiCases.map((c) => (
              <Link
                key={c.slug}
                href={`/cases/${c.slug}`}
                className="group flex items-center justify-between rounded-2xl border border-border bg-surface p-4 transition hover:border-border-strong"
              >
                <div>
                  <p className="font-semibold text-fg">{c.company}</p>
                  <p className="text-xs text-faint">
                    AI-generated · {c.verified}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-faint transition group-hover:translate-x-0.5 group-hover:text-fg" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
