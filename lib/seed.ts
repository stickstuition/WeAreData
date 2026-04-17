import { subDays } from "date-fns";

import {
  ATTENDANCE_LEVELS,
  DISHES,
  TEMPERATURE_BANDS,
  WEATHER_TYPES,
  WEEKDAY_ORDER
} from "@/lib/constants";
import { DailyMenuEntry, Dish } from "@/lib/types";

function createSeededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function pick<T>(items: readonly T[], random: () => number) {
  return items[Math.floor(random() * items.length)];
}

function getWeekday(date: Date) {
  return new Intl.DateTimeFormat("en-GB", { weekday: "long" }).format(date);
}

function getDayDishPool(weekday: string) {
  if (weekday === "Wednesday") {
    return ["veg-lasagna", "chicken-curry", "grilled-fish", "pasta-soup", "poke-bowl"];
  }
  if (weekday === "Friday") {
    return ["beef-burger", "pasta-soup", "veggie-wrap", "grilled-fish", "mushroom-risotto"];
  }
  return DISHES.map((dish) => dish.id);
}

function getDishDemandBias(dish: Dish) {
  switch (dish.id) {
    case "beef-burger":
      return 1.18;
    case "chicken-curry":
      return 1.14;
    case "veg-lasagna":
      return 1.12;
    case "grilled-fish":
      return 0.84;
    case "veggie-wrap":
      return 0.9;
    case "salmon-pasta":
      return 0.82;
    default:
      return 1;
  }
}

export function generateSeedData() {
  const random = createSeededRandom(2485);
  const today = new Date("2026-04-17T00:00:00");
  const entries: DailyMenuEntry[] = [];

  for (let offset = 84; offset >= 1; offset -= 1) {
    const date = subDays(today, offset);
    const weekday = getWeekday(date);
    if (!WEEKDAY_ORDER.includes(weekday as (typeof WEEKDAY_ORDER)[number])) continue;

    const weatherType = pick(WEATHER_TYPES, random);
    const temperatureBand = pick(TEMPERATURE_BANDS, random);
    const examPeriod = offset < 30 || (offset > 55 && offset < 68);
    const attendanceBase =
      weekday === "Wednesday" || weekday === "Thursday"
        ? 0.68
        : weekday === "Friday"
          ? 0.38
          : 0.55;
    const attendanceLevel = ATTENDANCE_LEVELS[
      Math.min(
        2,
        Math.max(
          0,
          Math.round(
            attendanceBase +
              (examPeriod ? 0.2 : 0) +
              (temperatureBand === "warm" ? 0.05 : 0) +
              random() * 0.25
          )
        )
      )
    ];

    const pool = getDayDishPool(weekday);
    const dishesToday = [...pool].sort(() => random() - 0.5).slice(0, 4);
    const hasHeroDish = dishesToday.includes("beef-burger") || dishesToday.includes("chicken-curry");

    for (const dishId of dishesToday) {
      const dish = DISHES.find((item) => item.id === dishId);
      if (!dish) continue;

      const attendanceMultiplier =
        attendanceLevel === "high" ? 1.14 : attendanceLevel === "low" ? 0.86 : 1;
      const weatherMultiplier =
        temperatureBand === "cold" && ["pasta-soup", "veg-lasagna", "chicken-curry"].includes(dishId)
          ? 1.12
          : temperatureBand === "warm" && ["poke-bowl", "veggie-wrap"].includes(dishId)
            ? 1.12
            : temperatureBand === "warm" && ["pasta-soup", "roast-turkey"].includes(dishId)
              ? 0.88
              : 1;
      const heroPenalty =
        hasHeroDish && ["grilled-fish", "veggie-wrap", "salmon-pasta"].includes(dishId)
          ? 0.8
          : 1;
      const demandBase = 42 * getDishDemandBias(dish) * attendanceMultiplier * weatherMultiplier * heroPenalty;
      const produced = Math.round(demandBase + 8 + random() * 16);
      const sold = Math.max(
        8,
        Math.min(
          produced,
          Math.round(
            demandBase +
              (examPeriod ? 3 : 0) +
              (weekday === "Friday" ? -4 : 0) +
              (weatherType === "rainy" && dish.category === "comfort food" ? 4 : 0) +
              (random() * 10 - 5)
          )
        )
      );
      const wasted = Math.max(0, produced - sold);
      const traysPrepared = Math.max(2, Math.round(produced / 18));

      entries.push({
        id: `${date.toISOString().slice(0, 10)}-${dishId}`,
        date: date.toISOString().slice(0, 10),
        weekday,
        dishId,
        traysPrepared,
        portionsProduced: produced,
        portionsSold: sold,
        portionsWasted: wasted,
        weatherType,
        temperatureBand,
        studentAttendanceLevel: attendanceLevel,
        examPeriod,
        notes:
          wasted > 12
            ? "Leftovers noticeably high."
            : sold >= produced - 2
              ? "Almost sold out."
              : "Normal service."
      });
    }
  }

  return entries.sort((a, b) => a.date.localeCompare(b.date));
}

export const SEEDED_ENTRIES = generateSeedData();
