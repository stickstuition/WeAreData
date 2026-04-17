"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import {
  BarChart3,
  ClipboardPenLine,
  Clock3,
  Lightbulb,
  LineChart,
  Soup,
  type LucideIcon
} from "lucide-react";

import { cn } from "@/lib/utils";

const items: { href: Route; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Dashboard", icon: BarChart3 },
  { href: "/input", label: "Daily Input", icon: ClipboardPenLine },
  { href: "/history", label: "History", icon: Clock3 },
  { href: "/insights", label: "Insights", icon: LineChart },
  { href: "/recommendations", label: "Advice", icon: Lightbulb }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-hero text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-28 pt-5 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate">
                <Soup className="h-4 w-4" />
                NOVA SBE Canteen Waste Dashboard
              </div>
              <h1 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
                Turn daily kitchen numbers into clear menu decisions.
              </h1>
            </div>
            <div className="hidden rounded-2xl bg-mist px-4 py-3 text-right text-sm text-slate md:block">
              <div className="font-medium text-ink">Suzanna mode</div>
              <div>Fast end-of-day entry</div>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/60 bg-white/95 px-2 py-2 backdrop-blur">
        <div className="mx-auto grid max-w-3xl grid-cols-5 gap-1">
          {items.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-16 flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-medium transition",
                  active
                    ? "bg-ink text-white shadow-soft"
                    : "text-slate hover:bg-mist hover:text-ink"
                )}
              >
                <Icon className="mb-1 h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
