"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CASE_INDEX, CASE_SECTORS } from "@/lib/content/cases";

const ERAS = ["2000s", "2010s"];

export default function CasesIndex() {
  const [sector, setSector] = useState<string>("All");
  const [era, setEra] = useState<string>("All");

  const filtered = useMemo(
    () =>
      CASE_INDEX.filter(
        (c) =>
          (sector === "All" || c.sector === sector) &&
          (era === "All" || c.era === era),
      ),
    [sector, era],
  );

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Chips
          options={["All", ...CASE_SECTORS]}
          value={sector}
          onChange={setSector}
        />
        <Chips options={["All", ...ERAS]} value={era} onChange={setEra} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((c) => (
          <Link
            key={c.slug}
            href={`/cases/${c.slug}`}
            className="group flex flex-col rounded-2xl border border-border bg-surface p-5 transition hover:border-border-strong"
          >
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-md bg-surface-2 px-2 py-0.5 text-faint">
                {c.sector}
              </span>
              <span className="rounded-md bg-surface-2 px-2 py-0.5 text-faint">
                {c.era}
              </span>
            </div>
            <h2 className="mt-3 text-xl font-semibold text-fg transition group-hover:text-accent-strong">
              {c.company}
            </h2>
            <p className="mt-1 flex-1 text-sm text-muted">{c.oneLiner}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent-strong">
              Read the teardown
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-sm text-faint">No cases match that filter.</p>
      )}
    </div>
  );
}

function Chips({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
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
          {o}
        </button>
      ))}
    </div>
  );
}
