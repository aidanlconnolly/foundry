"use client";

import { useState, useTransition } from "react";
import { Pencil, Check } from "lucide-react";
import { saveNote } from "@/lib/actions/lesson";

export default function NotePanel({
  slug,
  initial,
}: {
  slug: string;
  initial: string;
}) {
  const [body, setBody] = useState(initial);
  const [saved, setSaved] = useState(true);
  const [pending, start] = useTransition();

  function save() {
    start(async () => {
      await saveNote(slug, body);
      setSaved(true);
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-fg">
        <Pencil className="h-4 w-4 text-accent" /> Your notes
      </div>
      <textarea
        value={body}
        onChange={(e) => {
          setBody(e.target.value);
          setSaved(false);
        }}
        rows={3}
        placeholder="Jot a takeaway, a question, or how this applies to your idea…"
        className="w-full resize-y rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-fg outline-none placeholder:text-faint focus:border-accent"
      />
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={pending || saved}
          className="rounded-lg bg-surface-2 px-3 py-1.5 text-sm font-medium text-fg transition hover:bg-surface-3 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save note"}
        </button>
        {saved && !pending && body.length > 0 && (
          <span className="inline-flex items-center gap-1 text-xs text-good">
            <Check className="h-3.5 w-3.5" /> Saved
          </span>
        )}
      </div>
    </div>
  );
}
