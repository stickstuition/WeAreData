"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import {
  getDishPerformance,
  getOverviewStats,
  getRecommendations,
  getTrendData,
  round
} from "@/lib/analytics";
import { EntryWithDish } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/utils";

import { SectionCard } from "./section-card";
import { StatCard } from "./stat-card";
import { StatusPill } from "./status-pill";

export function DashboardView({ entries }: { entries: EntryWithDish[] }) {
  const overview = getOverviewStats(entries);
  const performance = getDishPerformance(entries);
  const recommendations = getRecommendations(entries).slice(0, 4);
  const trends = getTrendData(entries).slice(-14);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Produced"
          value={`${overview.produced}`}
          helper="Portions prepared across the tracked period"
        />
        <StatCard
          label="Total Sold"
          value={`${overview.sold}`}
          helper={`${formatPercent(overview.sellThroughRate)} sell-through overall`}
          tone="good"
        />
        <StatCard
          label="Total Waste"
          value={`${overview.waste}`}
          helper={`${formatPercent(overview.wasteRate)} waste rate`}
          tone={overview.wasteRate > 0.2 ? "warning" : "neutral"}
        />
        <StatCard
          label="Estimated Margin"
          value={formatCurrency(overview.margin)}
          helper={`${formatCurrency(overview.revenue)} revenue less ${formatCurrency(overview.cost)} cost`}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.95fr]">
        <SectionCard
          title="Recent Waste vs Sales"
          subtitle="A quick read on whether production is staying close to demand."
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends}>
                <defs>
                  <linearGradient id="soldFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#6D9F71" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6D9F71" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="wasteFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#F66B4E" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F66B4E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="sold" stroke="#6D9F71" fill="url(#soldFill)" />
                <Area type="monotone" dataKey="waste" stroke="#F66B4E" fill="url(#wasteFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="Recommendation Highlights"
          subtitle="Plain-English signals for the next planning conversation."
        >
          <div className="space-y-3">
            {recommendations.map((item) => (
              <div key={item.id} className="rounded-3xl border border-slate-200 p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="font-medium">{item.title}</div>
                  <StatusPill tone={item.tone}>
                    {item.tone === "good" ? "Green" : item.tone === "warning" ? "Red" : "Amber"}
                  </StatusPill>
                </div>
                <p className="text-sm text-slate">{item.detail}</p>
                <p className="mt-2 text-sm font-medium text-ink">{item.action}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Top and Bottom Dishes" subtitle="Best score means strong sell-through, low waste, and healthy margin.">
          <div className="space-y-3">
            {performance.slice(0, 3).concat(performance.slice(-3)).map((item) => (
              <div key={item.dishId} className="flex items-center justify-between rounded-3xl bg-mist px-4 py-3">
                <div>
                  <div className="font-medium">{item.dishName}</div>
                  <div className="text-sm text-slate">
                    {round(item.avgSellThrough * 100, 0)}% sell-through • {round(item.avgWasteRate * 100, 0)}% waste
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">{item.score}</div>
                  <div className="text-sm text-slate">{item.status}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Waste Leaderboard" subtitle="Useful for spotting dishes that need portion or pairing changes.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={performance
                  .slice()
                  .sort((a, b) => b.avgWasteRate - a.avgWasteRate)
                  .slice(0, 6)
                  .map((item) => ({
                    name: item.dishName.split(" ")[0],
                    waste: round(item.avgWasteRate * 100, 0)
                  }))}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="waste" radius={[12, 12, 0, 0]} fill="#F66B4E" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
