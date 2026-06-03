"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Check, X, ArrowRight, CircleCheck } from "lucide-react";
import { completeLesson } from "@/lib/actions/lesson";

type Question = {
  q: string;
  options: string[];
  answer: number;
  explain?: string;
};

export default function KnowledgeCheck({
  quiz,
  lessonSlug,
  stageSlug,
  initialDone,
  nextHref,
}: {
  quiz: Question[];
  lessonSlug: string;
  stageSlug: string;
  initialDone: boolean;
  nextHref?: string;
}) {
  const [answers, setAnswers] = useState<(number | null)[]>(
    quiz.map(() => null),
  );
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState(initialDone);
  const [pending, start] = useTransition();

  const allAnswered = answers.every((a) => a !== null);
  const correctCount = quiz.filter((q, i) => answers[i] === q.answer).length;
  const pct = quiz.length ? Math.round((correctCount / quiz.length) * 100) : 100;

  function submit() {
    setSubmitted(true);
    start(async () => {
      const detail = {
        questions: quiz.map((q, i) => ({
          prompt: q.q,
          correct: answers[i] === q.answer,
          userAnswer: answers[i] !== null ? q.options[answers[i]!] : "",
        })),
      };
      await completeLesson({ lessonSlug, stageSlug, score: pct, detail });
      setDone(true);
    });
  }

  function markComplete() {
    start(async () => {
      await completeLesson({
        lessonSlug,
        stageSlug,
        score: 100,
        detail: { questions: [] },
      });
      setDone(true);
    });
  }

  if (quiz.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-5">
        <CompleteRow
          done={done}
          pending={pending}
          onComplete={markComplete}
          nextHref={nextHref}
        />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-faint">
        Knowledge check
      </h2>

      <div className="mt-4 space-y-6">
        {quiz.map((question, qi) => {
          const chosen = answers[qi];
          return (
            <div key={qi}>
              <p className="text-sm font-medium text-fg">
                {qi + 1}. {question.q}
              </p>
              <div className="mt-2 space-y-1.5">
                {question.options.map((opt, oi) => {
                  const isChosen = chosen === oi;
                  const isCorrect = oi === question.answer;
                  let cls =
                    "border-border bg-surface-2 text-muted hover:border-border-strong";
                  if (submitted) {
                    if (isCorrect)
                      cls = "border-good/40 bg-good/10 text-fg";
                    else if (isChosen)
                      cls = "border-bad/40 bg-bad/10 text-fg";
                    else cls = "border-border bg-surface-2 text-faint";
                  } else if (isChosen) {
                    cls = "border-accent bg-accent-soft/40 text-fg";
                  }
                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={submitted}
                      onClick={() =>
                        setAnswers((a) =>
                          a.map((v, i) => (i === qi ? oi : v)),
                        )
                      }
                      className={`flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${cls}`}
                    >
                      <span>{opt}</span>
                      {submitted && isCorrect && (
                        <Check className="h-4 w-4 shrink-0 text-good" />
                      )}
                      {submitted && isChosen && !isCorrect && (
                        <X className="h-4 w-4 shrink-0 text-bad" />
                      )}
                    </button>
                  );
                })}
              </div>
              {submitted && question.explain && (
                <p className="mt-2 text-xs text-muted">{question.explain}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 border-t border-border pt-4">
        {!submitted ? (
          <button
            type="button"
            disabled={!allAnswered}
            onClick={submit}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-fg transition hover:bg-accent-strong disabled:opacity-50"
          >
            Check answers
          </button>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              You scored{" "}
              <span className="font-semibold text-fg">
                {correctCount}/{quiz.length}
              </span>
              .
            </p>
            <CompleteRow
              done={done}
              pending={pending}
              onComplete={() => {}}
              nextHref={nextHref}
              autoComplete
            />
          </div>
        )}
      </div>
    </div>
  );
}

function CompleteRow({
  done,
  pending,
  onComplete,
  nextHref,
  autoComplete,
}: {
  done: boolean;
  pending: boolean;
  onComplete: () => void;
  nextHref?: string;
  autoComplete?: boolean;
}) {
  if (done) {
    return (
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-good">
          <CircleCheck className="h-4 w-4" /> Lesson complete
        </span>
        {nextHref && (
          <Link
            href={nextHref}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-accent-fg transition hover:bg-accent-strong"
          >
            Next lesson <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    );
  }
  if (autoComplete) {
    return (
      <span className="text-sm text-faint">
        {pending ? "Saving…" : "Saving progress…"}
      </span>
    );
  }
  return (
    <button
      type="button"
      disabled={pending}
      onClick={onComplete}
      className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-fg transition hover:bg-accent-strong disabled:opacity-60"
    >
      {pending ? "Saving…" : "Mark complete"}
    </button>
  );
}
