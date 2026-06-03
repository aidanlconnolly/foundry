"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Layers } from "lucide-react";
import { seedFounderVocab } from "@/lib/actions/flashcards";

export default function SeedDeckButton() {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await seedFounderVocab();
          router.refresh();
        })
      }
      className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg transition hover:bg-accent-strong disabled:opacity-60"
    >
      <Layers className="h-4 w-4" />
      {pending ? "Building deck…" : "Build my starter deck"}
    </button>
  );
}
