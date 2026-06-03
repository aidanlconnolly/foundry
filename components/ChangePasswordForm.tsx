"use client";

import { useActionState } from "react";
import {
  changePasswordAction,
  type ChangePasswordState,
} from "@/lib/actions/auth";

export default function ChangePasswordForm() {
  const [state, action, pending] = useActionState<ChangePasswordState, FormData>(
    changePasswordAction,
    null,
  );

  return (
    <form action={action} className="space-y-3">
      <input
        name="current"
        type="password"
        placeholder="Current password"
        autoComplete="current-password"
        required
        className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-fg outline-none focus:border-accent"
      />
      <input
        name="new"
        type="password"
        placeholder="New password (8+ characters)"
        autoComplete="new-password"
        required
        className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-fg outline-none focus:border-accent"
      />
      <input
        name="confirm"
        type="password"
        placeholder="Confirm new password"
        autoComplete="new-password"
        required
        className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-fg outline-none focus:border-accent"
      />
      {state && "error" in state && (
        <p className="text-sm text-bad">{state.error}</p>
      )}
      {state && "ok" in state && (
        <p className="text-sm text-good">{state.message}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-surface-2 px-4 py-2 text-sm font-medium text-fg transition hover:bg-surface-3 disabled:opacity-60"
      >
        {pending ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
