"use client";

import { useRef, useState } from "react";
import { Sparkles, Send, Plus, MessageSquare, Loader2 } from "lucide-react";
import MarkdownLite from "@/components/MarkdownLite";
import { getThreadMessages } from "@/lib/actions/mentor";
import type { MentorMode, MentorThread } from "@/lib/db/schema";

type Msg = { role: "user" | "assistant"; content: string };

const MODES: { key: MentorMode; label: string; hint: string }[] = [
  { key: "explain", label: "Explain", hint: "Ask anything about building a startup." },
  { key: "pitch", label: "Pitch practice", hint: "I'll be a skeptical seed VC and grade your pitch." },
  { key: "case", label: "Case deep-dive", hint: "Name a company; I'll research a gritty teardown." },
];

const PLACEHOLDER: Record<MentorMode, string> = {
  explain: "e.g. How do I run a Mom-Test interview without leading the witness?",
  pitch: "Paste your 3-sentence pitch and I'll push on it…",
  case: "e.g. Deep-dive Ramp — how did they actually build and scale?",
};

export default function MentorChat({
  threads,
  initialThreadId,
  initialMessages,
}: {
  threads: MentorThread[];
  initialThreadId?: string;
  initialMessages: Msg[];
}) {
  const [mode, setMode] = useState<MentorMode>("explain");
  const [threadId, setThreadId] = useState<string | undefined>(initialThreadId);
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    });
  }

  async function send() {
    const content = input.trim();
    if (!content || streaming) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content }, { role: "assistant", content: "" }]);
    setStreaming(true);
    scrollToBottom();

    try {
      const res = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId, mode, content }),
      });
      const newThreadId = res.headers.get("X-Thread-Id");
      if (newThreadId) setThreadId(newThreadId);

      if (!res.body) throw new Error("no body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = {
            role: "assistant",
            content: copy[copy.length - 1].content + chunk,
          };
          return copy;
        });
        scrollToBottom();
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content:
            "The mentor is unavailable right now. Check ANTHROPIC_API_KEY, then try again.",
        };
        return copy;
      });
    } finally {
      setStreaming(false);
      scrollToBottom();
    }
  }

  function newChat() {
    setThreadId(undefined);
    setMessages([]);
  }

  async function loadThread(id: string) {
    const msgs = await getThreadMessages(id);
    setThreadId(id);
    setMessages(msgs.map((m) => ({ role: m.role, content: m.content })));
    scrollToBottom();
  }

  return (
    <div className="grid gap-4 md:grid-cols-[200px_1fr]">
      {/* Thread list */}
      <aside className="hidden md:block">
        <button
          type="button"
          onClick={newChat}
          className="mb-3 inline-flex w-full items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-fg transition hover:border-border-strong"
        >
          <Plus className="h-4 w-4" /> New chat
        </button>
        <div className="space-y-1">
          {threads.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => loadThread(t.id)}
              className={`flex w-full items-center gap-2 truncate rounded-lg px-2.5 py-1.5 text-left text-xs transition ${
                t.id === threadId
                  ? "bg-surface-2 text-fg"
                  : "text-muted hover:bg-surface-2"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{t.title}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat */}
      <div className="flex h-[70vh] flex-col rounded-2xl border border-border bg-surface">
        {/* Mode tabs */}
        <div className="flex items-center gap-1 border-b border-border p-2">
          {MODES.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setMode(m.key)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                mode === m.key
                  ? "bg-accent text-accent-fg"
                  : "text-muted hover:text-fg"
              }`}
            >
              {m.label}
            </button>
          ))}
          <button
            type="button"
            onClick={newChat}
            className="ml-auto rounded-md px-2 py-1.5 text-xs text-faint hover:text-fg md:hidden"
          >
            New
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-accent-soft">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <p className="text-sm font-medium text-fg">
                {MODES.find((m) => m.key === mode)?.hint}
              </p>
              <p className="mt-1 max-w-sm text-xs text-faint">
                The mentor knows where you are on the path and tailors its
                answers to your stage.
              </p>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "flex justify-end" : ""}
              >
                {m.role === "user" ? (
                  <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-accent-soft/50 px-3.5 py-2 text-sm text-fg">
                    {m.content}
                  </div>
                ) : (
                  <div className="max-w-full">
                    {m.content ? (
                      <MarkdownLite text={m.content} />
                    ) : (
                      <Loader2 className="h-4 w-4 animate-spin text-faint" />
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border p-3">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              placeholder={PLACEHOLDER[mode]}
              className="max-h-32 flex-1 resize-none rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-fg outline-none placeholder:text-faint focus:border-accent"
            />
            <button
              type="button"
              onClick={send}
              disabled={streaming || !input.trim()}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent text-accent-fg transition hover:bg-accent-strong disabled:opacity-50"
            >
              {streaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
