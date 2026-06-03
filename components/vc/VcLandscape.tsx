import { ShieldCheck, TrendingUp, Snowflake, Building2, Info } from "lucide-react";
import type { VcSnapshot } from "@/lib/content/vc";
import { AiShareChart, ConcentrationChart } from "./VcCharts";

export default function VcLandscape({
  snapshot,
  refreshSlot,
  aiGenerated,
}: {
  snapshot: VcSnapshot;
  refreshSlot?: React.ReactNode;
  aiGenerated?: boolean;
}) {
  const s = snapshot;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-fg">
            VC Landscape
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-faint">
            <ShieldCheck className="h-3.5 w-3.5" />
            {aiGenerated ? "AI-refreshed" : "Last verified"} {s.verified}
            <span className="ml-1 rounded bg-surface-2 px-1.5 py-0.5">
              Not investment advice
            </span>
          </p>
        </div>
        {refreshSlot}
      </div>

      <p className="max-w-prose text-[1.05rem] leading-relaxed text-muted">
        {s.headline}
      </p>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {s.stats.map((st) => (
          <div key={st.label} className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-xs uppercase tracking-wide text-faint">
              {st.label}
            </p>
            <p className="mt-1 text-2xl font-semibold text-accent">{st.value}</p>
            <p className="mt-1 text-xs text-muted">{st.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <AiShareChart data={s.aiShareTrend} />
        <ConcentrationChart data={s.concentration} />
      </div>

      {/* Themes */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-fg">
          <TrendingUp className="h-5 w-5 text-accent" /> What&apos;s happening
        </h2>
        <div className="space-y-3">
          {s.themes.map((t) => (
            <div key={t.title} className="rounded-2xl border border-border bg-surface p-4">
              <h3 className="font-medium text-fg">{t.title}</h3>
              <p className="mt-1 text-sm text-muted">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Hot / Cold */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-4">
          <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-accent-strong">
            <TrendingUp className="h-4 w-4" /> Getting funded
          </h3>
          <ul className="space-y-1.5 text-sm text-muted">
            {s.hot.map((h) => (
              <li key={h} className="flex gap-2">
                <span className="text-accent">+</span> {h}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-faint">
            <Snowflake className="h-4 w-4" /> Out of favor
          </h3>
          <ul className="space-y-1.5 text-sm text-muted">
            {s.cold.map((c) => (
              <li key={c} className="flex gap-2">
                <span className="text-faint">–</span> {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Firm directory */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-fg">
          <Building2 className="h-5 w-5 text-accent" /> Active funds
        </h2>
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-left text-xs uppercase tracking-wide text-faint">
              <tr>
                <th className="px-4 py-2 font-medium">Fund</th>
                <th className="px-4 py-2 font-medium">Stage</th>
                <th className="hidden px-4 py-2 font-medium sm:table-cell">Focus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {s.firms.map((f) => (
                <tr key={f.name}>
                  <td className="px-4 py-2.5 font-medium text-fg">{f.name}</td>
                  <td className="px-4 py-2.5 text-muted">{f.stage}</td>
                  <td className="hidden px-4 py-2.5 text-muted sm:table-cell">
                    {f.focus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-faint">
          <Info className="h-3.5 w-3.5" /> Informational directory, not an
          endorsement or investment advice.
        </p>
      </section>

      {/* Sources */}
      <section className="rounded-2xl border border-border bg-surface/50 p-4 text-sm">
        <p className="mb-1 font-medium text-fg">Sources</p>
        <ul className="space-y-1">
          {s.sources.map((src) => (
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
