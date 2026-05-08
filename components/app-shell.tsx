"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import { BarChart3, CalendarDays, Camera, ClipboardList, LogOut, ShoppingCart, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { useCanteenStore } from "@/lib/storage";
import { cn } from "@/lib/utils";

const navItems: { href: Route; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Dashboard", icon: CalendarDays },
  { href: "/daily-item-lab", label: "Menu Plan", icon: ClipboardList },
  { href: "/insight", label: "Insights", icon: BarChart3 },
  { href: "/ordering" as Route, label: "Ordering", icon: ShoppingCart }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hydrate = useCanteenStore((state) => state.hydrate);
  const hydrated = useCanteenStore((state) => state.hydrated);
  const authenticated = useCanteenStore((state) => state.authenticated);
  const login = useCanteenStore((state) => state.login);
  const logout = useCanteenStore((state) => state.logout);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!authenticated || typeof window === "undefined" || !("Notification" in window)) return;
    const schedule = () => {
      const now = new Date();
      const next = new Date();
      next.setHours(16, 0, 0, 0);
      if (next <= now) next.setDate(next.getDate() + 1);
      return window.setTimeout(() => {
        if (Notification.permission === "granted") {
          new Notification("TEMPERO daily review", {
            body: "Enter actual sold and wasted values before closing."
          });
        }
      }, next.getTime() - now.getTime());
    };
    const timer = schedule();
    return () => window.clearTimeout(timer);
  }, [authenticated]);

  if (!hydrated) return <div className="min-h-screen bg-white" />;

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-5 text-ink">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setError(login(username, password) ? "" : "Use user / password1 for the pilot.");
          }}
          className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-6 shadow-soft"
        >
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <span className="h-10 w-3 rounded bg-sage" />
              <span className="h-8 w-3 rounded bg-coral" />
              <h1 className="text-3xl font-semibold tracking-normal">TEMPERO</h1>
            </div>
          </div>
          <label className="mb-4 block text-sm font-medium">
            User
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              className="mt-2 w-full rounded-md border border-zinc-300 px-3 py-3 outline-none focus:border-sage"
            />
          </label>
          <label className="mb-5 block text-sm font-medium">
            Password
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              autoComplete="current-password"
              className="mt-2 w-full rounded-md border border-zinc-300 px-3 py-3 outline-none focus:border-sage"
            />
          </label>
          {error ? <p className="mb-4 text-sm font-medium text-coral">{error}</p> : null}
          <button className="w-full rounded-md bg-ink px-4 py-3 font-semibold text-white transition hover:bg-sage">
            Sign in
          </button>
        </form>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-white text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-28 pt-4 sm:px-6">
        <header className="mb-4 flex items-center justify-between border-b border-zinc-200 pb-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="h-9 w-3 rounded bg-sage" />
            <span className="h-7 w-3 rounded bg-coral" />
            <span className="text-2xl font-semibold tracking-normal">TEMPERO</span>
          </Link>
          <div className="flex items-center gap-2">
            {"Notification" in globalThis ? (
              <button
                type="button"
                onClick={() => Notification.requestPermission()}
                className="hidden rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium sm:block"
              >
                4pm review
              </button>
            ) : null}
            <button
              type="button"
              onClick={logout}
              aria-label="Sign out"
              className="rounded-md border border-zinc-300 p-2 text-slate transition hover:border-coral hover:text-coral"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200 bg-white/95 px-2 pb-3 pt-2 backdrop-blur">
        <div className="mx-auto grid max-w-md grid-cols-5 items-end gap-1">
          {navItems.slice(0, 2).map((item) => <NavItem key={item.href} item={item} pathname={pathname} />)}
          <Link
            href={"/scan" as Route}
            aria-label="Scan document"
            className={cn(
              "mx-auto -mt-8 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-sage text-white shadow-soft transition hover:bg-ink",
              pathname === "/scan" && "bg-coral"
            )}
          >
            <Camera className="h-7 w-7" />
          </Link>
          {navItems.slice(2).map((item) => <NavItem key={item.href} item={item} pathname={pathname} />)}
        </div>
      </nav>
    </div>
  );
}

function NavItem({ item, pathname }: { item: { href: Route; label: string; icon: LucideIcon }; pathname: string }) {
  const active = pathname === item.href;
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex h-16 flex-col items-center justify-center gap-1 rounded-md px-1 text-[11px] font-semibold transition",
        active ? "text-sage" : "text-slate hover:bg-mist hover:text-ink"
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}
