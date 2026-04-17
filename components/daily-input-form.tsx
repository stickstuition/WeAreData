"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";

import { ATTENDANCE_LEVELS, DISHES, TEMPERATURE_BANDS, WEATHER_TYPES } from "@/lib/constants";
import { DailyMenuEntry } from "@/lib/types";
import { useCanteenStore } from "@/lib/storage";

type DraftRow = {
  dishId: string;
  traysPrepared: number;
  portionsProduced: number;
  portionsSold: number;
  portionsWasted: number;
  notes: string;
};

const createRow = (): DraftRow => ({
  dishId: DISHES[0].id,
  traysPrepared: 3,
  portionsProduced: 54,
  portionsSold: 44,
  portionsWasted: 10,
  notes: ""
});

export function DailyInputForm() {
  const addEntries = useCanteenStore((state) => state.addEntries);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [weatherType, setWeatherType] = useState("cloudy");
  const [temperatureBand, setTemperatureBand] = useState("mild");
  const [studentAttendanceLevel, setStudentAttendanceLevel] = useState("medium");
  const [examPeriod, setExamPeriod] = useState(false);
  const [rows, setRows] = useState<DraftRow[]>([createRow(), createRow(), createRow()]);
  const [message, setMessage] = useState("");

  const weekday = useMemo(
    () => new Intl.DateTimeFormat("en-GB", { weekday: "long" }).format(new Date(date)),
    [date]
  );

  const updateRow = (index: number, patch: Partial<DraftRow>) => {
    setRows((current) =>
      current.map((row, rowIndex) => (rowIndex === index ? { ...row, ...patch } : row))
    );
  };

  const save = () => {
    const created: DailyMenuEntry[] = rows.map((row, index) => ({
      id: `${date}-${row.dishId}-${Date.now()}-${index}`,
      date,
      weekday,
      dishId: row.dishId,
      traysPrepared: Number(row.traysPrepared),
      portionsProduced: Number(row.portionsProduced),
      portionsSold: Number(row.portionsSold),
      portionsWasted: Number(row.portionsWasted),
      weatherType: weatherType as DailyMenuEntry["weatherType"],
      temperatureBand: temperatureBand as DailyMenuEntry["temperatureBand"],
      studentAttendanceLevel:
        studentAttendanceLevel as DailyMenuEntry["studentAttendanceLevel"],
      examPeriod,
      notes: row.notes
    }));

    addEntries(created);
    setMessage(`Saved ${created.length} dish entries for ${date}.`);
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <label className="text-sm">
          <div className="mb-1 font-medium">Date</div>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3"
          />
        </label>
        <label className="text-sm">
          <div className="mb-1 font-medium">Weekday</div>
          <input
            value={weekday}
            readOnly
            className="w-full rounded-2xl border border-slate-200 bg-mist px-3 py-3"
          />
        </label>
        <label className="text-sm">
          <div className="mb-1 font-medium">Weather</div>
          <select
            value={weatherType}
            onChange={(event) => setWeatherType(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3"
          >
            {WEATHER_TYPES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <div className="mb-1 font-medium">Temperature</div>
          <select
            value={temperatureBand}
            onChange={(event) => setTemperatureBand(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3"
          >
            {TEMPERATURE_BANDS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <div className="mb-1 font-medium">Attendance</div>
          <select
            value={studentAttendanceLevel}
            onChange={(event) => setStudentAttendanceLevel(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3"
          >
            {ATTENDANCE_LEVELS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="inline-flex items-center gap-3 rounded-2xl bg-mist px-4 py-3 text-sm font-medium">
        <input
          type="checkbox"
          checked={examPeriod}
          onChange={(event) => setExamPeriod(event.target.checked)}
          className="h-4 w-4"
        />
        Exam period is active
      </label>

      <div className="space-y-3">
        {rows.map((row, index) => (
          <div key={index} className="rounded-[28px] border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="font-medium">Dish {index + 1}</div>
              {rows.length > 1 ? (
                <button
                  type="button"
                  onClick={() => setRows((current) => current.filter((_, rowIndex) => rowIndex !== index))}
                  className="rounded-full p-2 text-slate transition hover:bg-coral/10 hover:text-coral"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm sm:col-span-2">
                <div className="mb-1 font-medium">Dish</div>
                <select
                  value={row.dishId}
                  onChange={(event) => updateRow(index, { dishId: event.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3"
                >
                  {DISHES.map((dish) => (
                    <option key={dish.id} value={dish.id}>
                      {dish.name}
                    </option>
                  ))}
                </select>
              </label>

              {[
                { key: "traysPrepared", label: "Trays prepared" },
                { key: "portionsProduced", label: "Portions produced" },
                { key: "portionsSold", label: "Portions sold" },
                { key: "portionsWasted", label: "Waste portions" }
              ].map((field) => (
                <label key={field.key} className="text-sm">
                  <div className="mb-1 font-medium">{field.label}</div>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={row[field.key as keyof DraftRow] as number}
                    onChange={(event) =>
                      updateRow(index, {
                        [field.key]: Number(event.target.value)
                      })
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3"
                  />
                </label>
              ))}

              <label className="text-sm sm:col-span-2">
                <div className="mb-1 font-medium">Notes</div>
                <input
                  value={row.notes}
                  onChange={(event) => updateRow(index, { notes: event.target.value })}
                  placeholder="Optional note"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3"
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => setRows((current) => [...current, createRow()])}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-4 text-sm font-medium text-ink transition hover:bg-mist"
        >
          <Plus className="h-4 w-4" />
          Add another dish
        </button>
        <button
          type="button"
          onClick={save}
          className="rounded-2xl bg-ink px-5 py-4 text-sm font-medium text-white transition hover:opacity-90"
        >
          Save full day
        </button>
      </div>

      {message ? <div className="rounded-2xl bg-sage/12 px-4 py-3 text-sm text-sage">{message}</div> : null}
    </div>
  );
}
