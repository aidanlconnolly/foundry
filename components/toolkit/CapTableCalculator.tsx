"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type Round = { id: number; label: string; amount: number; pre: number };

const PALETTE = [
  "#f5a524", // accent — founders
  "#6f6f7a", // ESOP
  "#7dd3fc",
  "#a78bfa",
  "#4ade80",
  "#fb7185",
];

let nextId = 100;

export default function CapTableCalculator() {
  const [esop, setEsop] = useState(10);
  const [rounds, setRounds] = useState<Round[]>([
    { id: 1, label: "Seed", amount: 2, pre: 8 },
    { id: 2, label: "Series A", amount: 10, pre: 40 },
  ]);

  const { finalHolders, trajectory } = useMemo(() => {
    const holders: { name: string; pct: number }[] = [
      { name: "Founders", pct: 100 - esop },
      { name: "ESOP", pct: esop },
    ];
    const trajectory: { label: string; founder: number }[] = [
      { label: "Start", founder: 100 - esop },
    ];
    for (const r of rounds) {
      const post = r.pre + r.amount;
      if (post <= 0) continue;
      const investorPct = (r.amount / post) * 100;
      const scale = r.pre / post;
      for (const h of holders) h.pct *= scale;
      holders.push({ name: r.label || "Round", pct: investorPct });
      trajectory.push({
        label: r.label || "Round",
        founder: holders[0].pct,
      });
    }
    return { finalHolders: holders, trajectory };
  }, [esop, rounds]);

  const founderFinal = finalHolders[0].pct;

  function update(id: number, patch: Partial<Round>) {
    setRounds((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-fg">
                Initial option pool (ESOP)
              </span>
              <span className="text-sm font-semibold text-accent">{esop}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={25}
              value={esop}
              onChange={(e) => setEsop(Number(e.target.value))}
              className="mt-1 w-full accent-[var(--accent)]"
            />
          </div>

          <div className="space-y-3">
            {rounds.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-border bg-surface-2 p-3"
              >
                <div className="flex items-center gap-2">
                  <input
                    value={r.label}
                    onChange={(e) => update(r.id, { label: e.target.value })}
                    className="min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1 text-sm font-medium text-fg outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setRounds((rs) => rs.filter((x) => x.id !== r.id))
                    }
                    className="text-faint hover:text-bad"
                    aria-label="Remove round"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <MField
                    label="Raise"
                    value={r.amount}
                    onChange={(v) => update(r.id, { amount: v })}
                  />
                  <MField
                    label="Pre-money"
                    value={r.pre}
                    onChange={(v) => update(r.id, { pre: v })}
                  />
                </div>
                <p className="mt-1.5 text-xs text-faint">
                  Post-money {fmtM(r.pre + r.amount)} · sells{" "}
                  {((r.amount / (r.pre + r.amount)) * 100).toFixed(1)}%
                </p>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setRounds((rs) => [
                  ...rs,
                  { id: ++nextId, label: "Series B", amount: 25, pre: 150 },
                ])
              }
              className="inline-flex items-center gap-1.5 text-sm text-accent-strong hover:underline"
            >
              <Plus className="h-4 w-4" /> Add round
            </button>
          </div>
        </div>

        {/* Output */}
        <div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={finalHolders}
                  dataKey="pct"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={80}
                  paddingAngle={1}
                  stroke="none"
                >
                  {finalHolders.map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => `${Number(v).toFixed(1)}%`}
                  contentStyle={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "var(--fg)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 space-y-1.5">
            {finalHolders.map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-sm"
              >
                <span className="flex items-center gap-2 text-muted">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: PALETTE[i % PALETTE.length] }}
                  />
                  {h.name}
                </span>
                <span className="font-medium text-fg">{h.pct.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-3">
        <p className="text-sm text-muted">
          After {rounds.length} round{rounds.length === 1 ? "" : "s"}, founders
          hold{" "}
          <span className="font-semibold text-fg">
            {founderFinal.toFixed(1)}%
          </span>
          .{" "}
          <span className="text-xs text-faint">
            Trajectory:{" "}
            {trajectory.map((t) => `${t.founder.toFixed(0)}%`).join(" → ")}
          </span>
        </p>
      </div>
    </div>
  );
}

function fmtM(n: number): string {
  return `$${n}M`;
}

function MField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-faint">{label} ($M)</span>
      <input
        type="number"
        min={0}
        step={0.5}
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
        className="w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-fg outline-none focus:border-accent"
      />
    </label>
  );
}
