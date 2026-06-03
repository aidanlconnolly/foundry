"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import type { VcSnapshot } from "@/lib/content/vc";

const tooltipStyle = {
  background: "var(--surface-2)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--fg)",
};

export function AiShareChart({ data }: { data: VcSnapshot["aiShareTrend"] }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm font-medium text-fg">
        AI&apos;s share of global VC
      </p>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 16, right: 8, left: -16, bottom: 0 }}>
            <XAxis
              dataKey="period"
              stroke="var(--faint)"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
            />
            <YAxis
              stroke="var(--faint)"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              cursor={{ fill: "var(--surface-2)" }}
              contentStyle={tooltipStyle}
              formatter={(v) => [`${v}%`, "AI share"]}
            />
            <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={i === data.length - 1 ? "var(--accent-strong)" : "var(--accent)"}
                />
              ))}
              <LabelList
                dataKey="pct"
                position="top"
                formatter={(v) => `${v}%`}
                style={{ fill: "var(--muted)", fontSize: 11 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ConcentrationChart({
  data,
}: {
  data: VcSnapshot["concentration"];
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="mb-1 text-sm font-medium text-fg">
        Q1 2026 capital, by recipient
      </p>
      <p className="mb-3 text-xs text-faint">$B raised — concentration at the top</p>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 28, left: 12, bottom: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              stroke="var(--faint)"
              tick={{ fontSize: 11, fill: "var(--muted)" }}
              tickLine={false}
              axisLine={false}
              width={86}
            />
            <Tooltip
              cursor={{ fill: "var(--surface-2)" }}
              contentStyle={tooltipStyle}
              formatter={(v) => [`$${v}B`, "Raised"]}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((d, i) => (
                <Cell
                  key={i}
                  fill={
                    d.name === "Everyone else"
                      ? "var(--border-strong)"
                      : "var(--accent)"
                  }
                />
              ))}
              <LabelList
                dataKey="value"
                position="right"
                formatter={(v) => `$${v}B`}
                style={{ fill: "var(--muted)", fontSize: 11 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
