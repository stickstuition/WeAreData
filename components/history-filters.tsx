"use client";

import { DISHES, WEATHER_TYPES, WEEKDAY_ORDER } from "@/lib/constants";
import { Filters } from "@/lib/types";

export function HistoryFilters({
  filters,
  onChange
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  const update = (key: keyof Filters, value: string) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
      <label className="text-sm">
        <div className="mb-1 font-medium">Start</div>
        <input
          type="date"
          value={filters.startDate}
          onChange={(event) => update("startDate", event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3"
        />
      </label>
      <label className="text-sm">
        <div className="mb-1 font-medium">End</div>
        <input
          type="date"
          value={filters.endDate}
          onChange={(event) => update("endDate", event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3"
        />
      </label>
      <label className="text-sm">
        <div className="mb-1 font-medium">Dish</div>
        <select
          value={filters.dishId}
          onChange={(event) => update("dishId", event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3"
        >
          <option value="">All dishes</option>
          {DISHES.map((dish) => (
            <option key={dish.id} value={dish.id}>
              {dish.name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        <div className="mb-1 font-medium">Weekday</div>
        <select
          value={filters.weekday}
          onChange={(event) => update("weekday", event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3"
        >
          <option value="">All weekdays</option>
          {WEEKDAY_ORDER.map((weekday) => (
            <option key={weekday} value={weekday}>
              {weekday}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        <div className="mb-1 font-medium">Weather</div>
        <select
          value={filters.weatherType}
          onChange={(event) => update("weatherType", event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3"
        >
          <option value="">All weather</option>
          {WEATHER_TYPES.map((weather) => (
            <option key={weather} value={weather}>
              {weather}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        <div className="mb-1 font-medium">Exam Period</div>
        <select
          value={filters.examPeriod}
          onChange={(event) => update("examPeriod", event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3"
        >
          <option value="">All</option>
          <option value="true">Exam period</option>
          <option value="false">Not exam period</option>
        </select>
      </label>
    </div>
  );
}
