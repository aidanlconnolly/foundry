"use client";

import { useState, useTransition } from "react";
import { Bookmark } from "lucide-react";
import { toggleBookmark } from "@/lib/actions/lesson";

export default function BookmarkButton({
  type,
  slug,
  initial,
}: {
  type: "lesson" | "case" | "tool";
  slug: string;
  initial: boolean;
}) {
  const [on, setOn] = useState(initial);
  const [pending, start] = useTransition();

  function toggle() {
    start(async () => {
      const res = await toggleBookmark(type, slug);
      setOn(res.bookmarked);
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={on}
      title={on ? "Remove bookmark" : "Bookmark"}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm transition ${
        on
          ? "border-accent/40 bg-accent-soft/40 text-accent-strong"
          : "border-border text-muted hover:border-border-strong hover:text-fg"
      }`}
    >
      <Bookmark className={`h-4 w-4 ${on ? "fill-current" : ""}`} />
    </button>
  );
}
