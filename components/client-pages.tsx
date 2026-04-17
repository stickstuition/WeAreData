"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import {
  filterEntries,
  getContextSignals,
  getDishPerformance,
  getRecommendations,
  getWeekdayPerformance,
  withDish
} from "@/lib/analytics";
import { useCanteenStore } from "@/lib/storage";
import { Filters } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/utils";

import { DashboardView } from "./dashboard-view";
import { DailyInputForm } from "./daily-input-form";
import { HistoryFilters } from "./history-filters";
import { SectionCard } from "./section-card";
import { StatusPill } from "./status-pill";

const emptyFilters: Filters = {
  dishId: "",
  weekday: "",
  weatherType: "",
  examPeriod: "",
  startDate: "",
  endDate: ""
};

function useEntries() {
  const hydrate = useCanteenStore((state) => state.hydrate);
  const allEntries = useCanteenStore((state) => state.allEntries);
  const hydrated = useCanteenStore((state) => state.hydrated);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const entries = useMemo(() => withDish(allEntries()), [allEntries]);

  return { entries, hydrated };
}

export function DashboardClientPage() {
  const { entries, hydrated } = useEntries();
  if (!hydrated) return <div className="text-sm text-slate">Loading dashboard…</div>;
  return <DashboardView entries={entries} />;
}

export function InputClientPage() {
  return <DailyInputForm />;
}

export function HistoryClientPage() {
  const { entries, hydrated } = useEntries();
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const filtered = useMemo(() => filterEntries(entries, filters), [entries, filters]);

  if (!hydrated) return <div className="text-sm text-slate">Loading history…</div>;

  return (
    <div className="space-y-5">
      <SectionCard title="Filters" subtitle="Narrow the history quickly without a dense spreadsheet.">
        <HistoryFilters filters={filters} onChange={setFilters} />
      </SectionCard>

      <SectionCard title="Service History" subtitle={`${filtered.length} records match the current filters.`}>
        <div className="space-y-3">
          {filtered.slice().reverse().slice(0, 30).map((entry) => (
            <div key={entry.id} className="rounded-3xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-medium">{entry.dish.name}</div>
                  <div className="text-sm text-slate">
                    {entry.date} • {entry.weekday} • {entry.weatherType} • attendance {entry.studentAttendanceLevel}
                  </div>
                </div>
                <StatusPill tone={entry.portionsWasted / Math.max(entry.portionsProduced, 1) > 0.2 ? "warning" : "good"}>
                  {formatPercent(entry.portionsWasted / Math.max(entry.portionsProduced, 1))} waste
                </StatusPill>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div><span className="text-slate">Produced</span><div className="font-medium">{entry.portionsProduced}</div></div>
                <div><span className="text-slate">Sold</span><div className="font-medium">{entry.portionsSold}</div></div>
                <div><span className="text-slate">Waste</span><div className="font-medium">{entry.portionsWasted}</div></div>
                <div><span className="text-slate">Notes</span><div className="font-medium">{entry.notes || "—"}</div></div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

export function InsightsClientPage() {
  const { entries, hydrated } = useEntries();
  const performance = useMemo(() => getDishPerformance(entries), [entries]);
  const weekdayData = useMemo(() => getWeekdayPerformance(entries), [entries]);
  const contextSignals = useMemo(() => getContextSignals(entries), [entries]);

  if (!hydrated) return <div className="text-sm text-slate">Loading insights…</div>;

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Weekday Patterns" subtitle="Mid-week tends to be strongest, and Friday is often softer.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weekdayData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="weekday" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="sold" stroke="#11243D" strokeWidth={3} />
                <Line type="monotone" dataKey="wasteRate" stroke="#F66B4E" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Context Signals" subtitle="Useful for explaining why a dish struggled on a given day.">
          <div className="space-y-3">
            {contextSignals.map((signal) => (
              <div key={signal.context} className="rounded-3xl bg-mist px-4 py-3">
                <div className="font-medium">{signal.context}</div>
                <div className="text-sm text-slate">
                  Average sold {signal.avgSold} • Waste {formatPercent(signal.wasteRate)}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Cost Efficiency Ranking" subtitle="Balances sales, waste, margin, and consistency into a single explainable score.">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performance.slice(0, 8).map((item) => ({ name: item.dishName.split(" ")[0], score: item.score }))}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="score" radius={[12, 12, 0, 0]} fill="#11243D" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
    </div>
  );
}

export function RecommendationsClientPage() {
  const { entries, hydrated } = useEntries();
  const performance = useMemo(() => getDishPerformance(entries), [entries]);
  const recommendations = useMemo(() => getRecommendations(entries), [entries]);

  if (!hydrated) return <div className="text-sm text-slate">Loading recommendations…</div>;

  return (
    <div className="space-y-5">
      <SectionCard title="Dish Scores" subtitle="Each score combines sell-through, waste, margin, and consistency for a demo-friendly decision rule.">
        <div className="space-y-3">
          {performance.slice(0, 8).map((item) => (
            <div key={item.dishId} className="rounded-3xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-medium">{item.dishName}</div>
                  <div className="text-sm text-slate">{item.category}</div>
                </div>
                <StatusPill tone={item.status === "strong" ? "good" : item.status === "risky" ? "warning" : "neutral"}>
                  {item.score}/100
                </StatusPill>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-slate sm:grid-cols-2">
                <div>Sell-through: {formatPercent(item.avgSellThrough)}</div>
                <div>Waste rate: {formatPercent(item.avgWasteRate)}</div>
                <div>Average margin: {formatCurrency(item.avgMargin)}</div>
                <div>Consistency: {formatPercent(item.consistencyScore)}</div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Plain-English Actions" subtitle="Simple outputs for a canteen manager, not a data scientist.">
        <div className="space-y-3">
          {recommendations.map((item) => (
            <div key={item.id} className="rounded-3xl border border-slate-200 p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="font-medium">{item.title}</div>
                <StatusPill tone={item.tone}>
                  {item.tone === "good" ? "Do more" : item.tone === "warning" ? "Act now" : "Review"}
                </StatusPill>
              </div>
              <p className="text-sm text-slate">{item.detail}</p>
              <p className="mt-2 text-sm font-medium">{item.action}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
