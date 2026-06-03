import CasesIndex from "@/components/cases/CasesIndex";

export default function CasesPage() {
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
    </div>
  );
}
