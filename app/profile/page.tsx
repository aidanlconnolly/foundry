import { Flame, BookOpen, LogOut } from "lucide-react";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import { getProfile, getProgressMap } from "@/lib/actions/progress";
import { getAllLessons } from "@/lib/content";
import ChangePasswordForm from "@/components/ChangePasswordForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getSession();
  const [profile, progress] = await Promise.all([
    getProfile(),
    getProgressMap(),
  ]);
  const done = getAllLessons().filter((l) => progress[l.slug] === "done").length;
  const total = getAllLessons().length;

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-fg">Profile</h1>
        <p className="mt-1 text-sm text-muted">{session?.email}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat
          icon={<Flame className="h-4 w-4 text-accent" />}
          value={`${profile.streakCount}`}
          label={`day streak`}
        />
        <Stat
          icon={<BookOpen className="h-4 w-4 text-accent" />}
          value={`${done}/${total}`}
          label="lessons done"
        />
      </div>

      <section className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold text-fg">Change password</h2>
        <p className="mb-4 mt-1 text-xs text-muted">
          Use at least 8 characters.
        </p>
        <ChangePasswordForm />
      </section>

      <form action={logoutAction}>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted transition hover:border-border-strong hover:text-fg"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </form>
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-2xl font-semibold text-fg">{value}</span>
      </div>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}
