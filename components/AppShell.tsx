"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  BookOpen,
  TrendingUp,
  Wrench,
  GraduationCap,
  Sparkles,
  Layers,
  Calculator,
  User,
  LogOut,
  Flame,
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const PRIMARY: NavItem[] = [
  { href: "/", label: "Path", icon: Compass },
  { href: "/cases", label: "Cases", icon: BookOpen },
  { href: "/vc-landscape", label: "VC", icon: TrendingUp },
  { href: "/tools", label: "Tools", icon: Wrench },
  { href: "/wharton", label: "Wharton", icon: GraduationCap },
  { href: "/mentor", label: "Mentor", icon: Sparkles },
];

const SECONDARY: NavItem[] = [
  { href: "/flashcards", label: "Flashcards", icon: Layers },
  { href: "/toolkit", label: "Toolkit", icon: Calculator },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function Wordmark() {
  return (
    <Link href="/" className="flex items-center gap-2 px-1 group">
      <span className="grid h-7 w-7 place-items-center rounded-md bg-accent text-accent-fg">
        <Flame className="h-4 w-4" />
      </span>
      <span className="font-mono text-sm font-semibold tracking-[0.2em] text-fg">
        FOUNDRY
      </span>
    </Link>
  );
}

export default function AppShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen md:pl-60">
      {/* ── Desktop left rail ── */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-surface/60 backdrop-blur md:flex">
        <div className="px-4 py-5">
          <Wordmark />
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {PRIMARY.map((item) => (
            <RailLink key={item.href} item={item} active={isActive(pathname, item.href)} />
          ))}
          <div className="my-3 border-t border-border" />
          {SECONDARY.map((item) => (
            <RailLink key={item.href} item={item} active={isActive(pathname, item.href)} />
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <Link
            href="/profile"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-surface-2 hover:text-fg"
          >
            <User className="h-4 w-4" />
            <span className="truncate">{email}</span>
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-faint transition hover:bg-surface-2 hover:text-fg"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-bg/80 px-4 py-3 backdrop-blur md:hidden">
        <Wordmark />
        <Link href="/profile" className="text-muted hover:text-fg">
          <User className="h-5 w-5" />
        </Link>
      </header>

      {/* ── Content ── */}
      <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-6 sm:px-6 md:pb-12 md:pt-10">
        {children}
      </main>

      {/* ── Mobile bottom tab bar ── */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-6 border-t border-border bg-surface/90 backdrop-blur md:hidden">
        {PRIMARY.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2 text-[10px] ${
                active ? "text-accent" : "text-faint"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function RailLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
        active
          ? "bg-accent-soft text-accent-strong"
          : "text-muted hover:bg-surface-2 hover:text-fg"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {item.label}
    </Link>
  );
}
