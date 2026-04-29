import { DAYS, FOOD_CATEGORIES, RECIPES } from "@/lib/constants";
import { DailyForecast, HistoricalRecord, WeeklyPlan } from "@/lib/types";

const recipeFor = (category: string, offset = 0) => {
  const pool = RECIPES.filter((recipe) => recipe.category === category);
  return pool[offset % pool.length]?.id ?? "";
};

export function createEmptyWeeklyPlan(): WeeklyPlan {
  return Object.fromEntries(
    DAYS.map((day, dayIndex) => [
      day,
      Object.fromEntries(
        FOOD_CATEGORIES.map((category) => {
          const slots = category === "Salads" ? 2 : category === "Dessert" ? 4 : 1;
          return [
            category,
            Array.from({ length: slots }, (_, slotIndex) => recipeFor(category, dayIndex + slotIndex))
          ];
        })
      )
    ])
  ) as WeeklyPlan;
}

export const SEEDED_WEEKLY_PLAN = createEmptyWeeklyPlan();

export const SEEDED_FORECASTS: DailyForecast[] = DAYS.flatMap((day, dayIndex) => {
  const selected = Object.values(SEEDED_WEEKLY_PLAN[day]).flat();
  return selected.map((recipeId, index) => {
    const forecast = 42 + dayIndex * 5 + index * 3;
    return {
      day,
      recipeId,
      forecastPortions: forecast,
      manualForecast: forecast,
      actualSold: Math.round(forecast * (0.82 + (index % 3) * 0.04)),
      actualRevenue: 0,
      correctionType: "none",
      varianceNote: ""
    };
  });
});

export const SEEDED_HISTORY: HistoricalRecord[] = [
  ["2026-04-20", "Day 1", "cod-rice", 128, 92, 414, 1.5, 165, 4.5],
  ["2026-04-20", "Day 1", "chickpea-stew", 128, 64, 256, 1, 86, 4],
  ["2026-04-21", "Day 2", "chicken-mushroom", 142, 104, 468, 2, 178, 4.5],
  ["2026-04-21", "Day 2", "goat-cheese-puff", 142, 58, 244, 1.5, 112, 4.2],
  ["2026-04-22", "Day 3", "beef-bourguignon", 151, 76, 395, 3, 238, 5.2],
  ["2026-04-22", "Day 3", "vegetable-soup", 151, 94, 113, 0.5, 42, 1.2],
  ["2026-04-23", "Day 4", "salmon-passion", 136, 68, 374, 2.5, 244, 5.5],
  ["2026-04-23", "Day 4", "pasta-salad", 136, 44, 114, 0.5, 38, 2.6],
  ["2026-04-24", "Day 5", "caldo-verde", 109, 88, 114, 1, 46, 1.3],
  ["2026-04-24", "Day 5", "rice-pudding", 109, 72, 115, 0.5, 51, 1.6]
].map(([date, day, recipeId, people, sales, revenue, overtimeHours, poValue, unitPrice]) => ({
  id: `${date}-${recipeId}`,
  date: String(date),
  day: String(day),
  recipeId: String(recipeId),
  people: Number(people),
  sales: Number(sales),
  revenue: Number(revenue),
  overtimeHours: Number(overtimeHours),
  poValue: Number(poValue),
  unitPrice: Number(unitPrice)
}));
