"use client";

import { useMemo, useState } from "react";

function fmtUSD(n: number): string {
  if (!isFinite(n)) return "—";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${Math.round(n)}`;
}

export default function TamEstimator() {
  const [customers, setCustomers] = useState(500000);
  const [annualSpend, setAnnualSpend] = useState(1200);
  const [samPct, setSamPct] = useState(30);
  const [somPct, setSomPct] = useState(5);

  const { tam, sam, som } = useMemo(() => {
    const tam = customers * annualSpend;
    const sam = tam * (samPct / 100);
    const som = sam * (somPct / 100);
    return { tam, sam, som };
  }, [customers, annualSpend, samPct, somPct]);

  const bars = [
    { label: "TAM", value: tam, sub: "Total addressable", w: 100 },
    { label: "SAM", value: sam, sub: `${samPct}% serviceable`, w: samPct },
    {
      label: "SOM",
      value: som,
      sub: `${somPct}% of SAM obtainable`,
      w: (samPct / 100) * somPct,
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <NumField
          label="Potential customers"
          value={customers}
          onChange={setCustomers}
          step={10000}
        />
        <NumField
          label="Annual spend / customer ($)"
          value={annualSpend}
          onChange={setAnnualSpend}
          step={100}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <RangeField
          label="SAM — % you can serve"
          value={samPct}
          onChange={setSamPct}
        />
        <RangeField
          label="SOM — % of SAM you can win"
          value={somPct}
          onChange={setSomPct}
        />
      </div>

      <div className="mt-5 space-y-3 border-t border-border pt-4">
        {bars.map((b) => (
          <div key={b.label}>
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium text-fg">
                {b.label}{" "}
                <span className="text-xs font-normal text-faint">{b.sub}</span>
              </span>
              <span className="font-semibold text-accent">{fmtUSD(b.value)}</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${Math.max(1, b.w)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">
        Build TAM bottoms-up (customers × realistic annual spend), not top-down
        from an analyst headline. A credible {fmtUSD(tam)} beats a hand-wavy
        $80B.
      </p>
    </div>
  );
}

function NumField({
  label,
  value,
  onChange,
  step,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  step: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-faint">{label}</span>
      <input
        type="number"
        min={0}
        step={step}
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
        className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-fg outline-none focus:border-accent"
      />
    </label>
  );
}

function RangeField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium text-faint">{label}</span>
        <span className="text-sm font-semibold text-accent">{value}%</span>
      </div>
      <input
        type="range"
        min={1}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-[var(--accent)]"
      />
    </div>
  );
}
