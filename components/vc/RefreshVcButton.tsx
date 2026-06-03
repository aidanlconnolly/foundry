"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { refreshVcLandscape } from "@/lib/actions/ai";

export default function RefreshVcButton() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function refresh() {
    setError(null);
    start(async () => {
      const res = await refreshVcLandscape();
      if (!res.ok) setError(res.error ?? "Refresh failed.");
      else router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={refresh}
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-fg transition hover:border-border-strong disabled:opacity-60"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${pending ? "animate-spin" : ""}`} />
        {pending ? "Refreshing…" : "Refresh landscape"}
      </button>
      {error && <span className="text-xs text-bad">{error}</span>}
    </div>
  );
}
