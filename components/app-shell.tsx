"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import { CalendarDays, FlaskConical, History, Languages, LineChart, Soup, type LucideIcon } from "lucide-react";

import { useCanteenStore } from "@/lib/storage";
import { cn } from "@/lib/utils";

const zones: {
  name: { English: string; Portuguese: string };
  items: { href: Route; label: { English: string; Portuguese: string }; icon: LucideIcon }[];
}[] = [
  {
    name: { English: "Operation Zone", Portuguese: "Zona Operacional" },
    items: [
      { href: "/", label: { English: "Dashboard", Portuguese: "Painel" }, icon: CalendarDays },
      { href: "/daily-item-lab", label: { English: "DailyItemLab", Portuguese: "Laboratorio Diario" }, icon: FlaskConical }
    ]
  },
  {
    name: { English: "Data Analytics Zone", Portuguese: "Zona de Analise de Dados" },
    items: [
      { href: "/history", label: { English: "History", Portuguese: "Historico" }, icon: History },
      { href: "/insight", label: { English: "Insight", Portuguese: "Analise" }, icon: LineChart }
    ]
  }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const language = useCanteenStore((state) => state.language);
  const setLanguage = useCanteenStore((state) => state.setLanguage);
  const pt = language === "Portuguese";

  return (
    <div className="min-h-screen bg-hero text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-28 pt-5 sm:px-6 lg:px-8">
        <header className="mb-5 rounded-lg border border-white/70 bg-white/90 p-5 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate">
                <Soup className="h-4 w-4" />
                NOVA Canteen Digital Assistant
              </div>
              <h1 className="max-w-3xl text-2xl font-semibold tracking-tight sm:text-3xl">
                {pt
                  ? "Planeamento semanal, producao diaria, historico e analise financeira num unico fluxo."
                  : "Weekly planning, daily production, history, and financial insight in one workflow."}
              </h1>
            </div>
            <label className="flex min-w-56 items-center gap-2 rounded-lg bg-mist px-3 py-2 text-sm">
              <Languages className="h-4 w-4 text-slate" />
              <span className="font-medium">{pt ? "Definicoes" : "Settings"}</span>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value as "English" | "Portuguese")}
                className="ml-auto rounded-md border border-slate-200 bg-white px-2 py-1"
              >
                <option>English</option>
                <option>Portuguese</option>
              </select>
            </label>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/60 bg-white/95 px-2 py-2 backdrop-blur">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-2 md:grid-cols-4">
          {zones.flatMap((zone) =>
            zone.items.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex min-h-16 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                    active ? "bg-ink text-white shadow-soft" : "text-slate hover:bg-mist hover:text-ink"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="min-w-0">
                    <span className="block truncate">{item.label[language]}</span>
                    <span className="block truncate text-[11px] opacity-70">{zone.name[language]}</span>
                  </span>
                </Link>
              );
            })
          )}
        </div>
      </nav>
    </div>
  );
}
