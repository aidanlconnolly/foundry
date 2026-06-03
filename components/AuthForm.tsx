"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Flame } from "lucide-react";
import { loginAction, registerAction, type AuthState } from "@/lib/actions/auth";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const action = mode === "login" ? loginAction : registerAction;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    action,
    null,
  );

  const isLogin = mode === "login";

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-fg">
            <Flame className="h-6 w-6" />
          </span>
          <h1 className="font-mono text-lg font-semibold tracking-[0.25em] text-fg">
            FOUNDRY
          </h1>
          <p className="mt-2 text-sm text-muted">
            {isLogin
              ? "Welcome back. Sign in to continue your path."
              : "Create an account to start building."}
          </p>
        </div>

        <form
          action={formAction}
          className="space-y-4 rounded-2xl border border-border bg-surface p-6"
        >
          <Field
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
          />
          <Field
            label="Password"
            name="password"
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            placeholder={isLogin ? "••••••••" : "At least 8 characters"}
          />

          {state?.error && (
            <p className="rounded-lg border border-bad/30 bg-bad/10 px-3 py-2 text-sm text-bad">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg transition hover:bg-accent-strong disabled:opacity-60"
          >
            {pending
              ? isLogin
                ? "Signing in…"
                : "Creating account…"
              : isLogin
                ? "Sign in"
                : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          {isLogin ? "New here? " : "Already have an account? "}
          <Link
            href={isLogin ? "/register" : "/login"}
            className="text-accent-strong hover:underline"
          >
            {isLogin ? "Create an account" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-faint">
        {label}
      </span>
      <input
        {...props}
        required
        className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm text-fg outline-none transition placeholder:text-faint focus:border-accent"
      />
    </label>
  );
}
