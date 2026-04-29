import { CATEGORY_RULES, DAYS, FOOD_CATEGORIES, RECIPES, SUPPLIERS } from "@/lib/constants";
import { DailyForecast, FoodCategory, HistoricalRecord, Recipe, WeatherForecastDay, WeeklyPlan } from "@/lib/types";

export const round = (value: number, digits = 1) => Number(value.toFixed(digits));

const dayToWeekday: Record<string, string> = {
  "Day 1": "Monday",
  "Day 2": "Tuesday",
  "Day 3": "Wednesday",
  "Day 4": "Thursday",
  "Day 5": "Friday"
};

export function getRequiredSlotCount(category: FoodCategory) {
  return CATEGORY_RULES[category] ?? 1;
}

export function getRecipe(recipeId: string) {
  return RECIPES.find((recipe) => recipe.id === recipeId);
}

export function recipesByCategory(category: FoodCategory) {
  return RECIPES.filter((recipe) => recipe.category === category && recipe.active);
}

function fallbackRecipeId(category: FoodCategory, offset = 0) {
  const pool = recipesByCategory(category);
  return pool[offset % Math.max(pool.length, 1)]?.id ?? "";
}

export function normalizeWeeklyPlan(plan: WeeklyPlan): WeeklyPlan {
  const used = new Set<string>();
  const normalized = {} as WeeklyPlan;

  DAYS.forEach((day, dayIndex) => {
    normalized[day] = {} as WeeklyPlan[string];
    FOOD_CATEGORIES.forEach((category) => {
      const required = getRequiredSlotCount(category);
      const source = plan?.[day]?.[category] ?? [];
      const pool = recipesByCategory(category);
      const slots: string[] = [];

      for (let index = 0; index < required; index += 1) {
        const candidate = source[index];
        const valid = candidate && getRecipe(candidate)?.category === category && !used.has(candidate);
        const replacement =
          pool.find((recipe) => !used.has(recipe.id) && !slots.includes(recipe.id))?.id ??
          fallbackRecipeId(category, dayIndex + index);
        const next = valid ? candidate : replacement;
        slots.push(next);
        if (next) used.add(next);
      }

      normalized[day][category] = slots;
    });
  });

  return normalized;
}

export function canUseRecipe(plan: WeeklyPlan, currentRecipeId: string, nextRecipeId: string) {
  if (currentRecipeId === nextRecipeId) return true;
  return !Object.values(plan).flatMap((row) => Object.values(row).flat()).includes(nextRecipeId);
}

export function getSelectedRecipesForDay(plan: WeeklyPlan, day: string): Recipe[] {
  return Object.values(plan[day] ?? {})
    .flat()
    .map(getRecipe)
    .filter((recipe): recipe is Recipe => Boolean(recipe));
}

export function getDuplicateDishIds(plan: WeeklyPlan) {
  const counts = new Map<string, number>();
  Object.values(plan).forEach((day) => {
    Object.values(day).flat().forEach((recipeId) => counts.set(recipeId, (counts.get(recipeId) ?? 0) + 1));
  });
  return Array.from(counts.entries()).filter(([, count]) => count > 1).map(([recipeId]) => recipeId);
}

export function getCategoryRuleIssues(plan: WeeklyPlan) {
  return DAYS.flatMap((day) =>
    FOOD_CATEGORIES.flatMap((category) => {
      const expected = getRequiredSlotCount(category);
      const actual = plan[day]?.[category]?.length ?? 0;
      return actual === expected ? [] : [{ day, category, expected, actual }];
    })
  );
}

export function getRecipeCost(recipe: Recipe) {
  return recipe.ingredients.reduce((sum, ingredient) => sum + ingredient.quantityPerPortion * ingredient.unitCost, 0);
}

export function getDishHistory(history: HistoricalRecord[], recipeId: string) {
  return history.filter((row) => row.recipeId === recipeId);
}

export function getDemandPattern(history: HistoricalRecord[], recipeId: string) {
  const rows = getDishHistory(history, recipeId);
  if (!rows.length) {
    return { averageSales: 42, averagePeople: 120, sellThrough: 1, demandBias: 1, status: "new" as const };
  }

  const averageSales = rows.reduce((sum, row) => sum + row.sales, 0) / rows.length;
  const averagePeople = rows.reduce((sum, row) => sum + row.people, 0) / rows.length;
  const expectedShare = averagePeople * 0.42;
  const sellThrough = averageSales / Math.max(expectedShare, 1);
  const demandBias = sellThrough > 1.12 ? 1.12 : sellThrough < 0.88 ? 0.88 : 1;
  const status = sellThrough > 1.08 ? "overselling" : sellThrough < 0.92 ? "underselling" : "stable";

  return { averageSales, averagePeople, sellThrough, demandBias, status };
}

export function getWeatherImpact(recipe: Recipe, weather?: WeatherForecastDay) {
  if (!weather) return { multiplier: 1, reason: "baseline" };
  const hot = weather.maxTemperatureC >= 24;
  const cold = weather.maxTemperatureC <= 17;
  const rainyOrCold = cold || weather.condition === "rainy";

  if (recipe.category === "Soup" && rainyOrCold) return { multiplier: 1.18, reason: "cold/rainy soup lift" };
  if (recipe.category === "Soup" && hot) return { multiplier: 0.82, reason: "hot day soup reduction" };
  if (recipe.category === "Salads" && hot) return { multiplier: 1.16, reason: "hot day salad lift" };
  if (recipe.category === "Dessert" && hot) return { multiplier: 0.95, reason: "hot day lighter dessert demand" };
  if ((recipe.category === "Meat/Fish" || recipe.category === "Nomad") && hot) return { multiplier: 0.96, reason: "hot day heavier-main reduction" };
  return { multiplier: 1, reason: "normal weather" };
}

export function getAutoForecast(
  recipe: Recipe,
  day: string,
  history: HistoricalRecord[],
  previousForecasts: DailyForecast[],
  weather?: WeatherForecastDay
 ) {
  const pattern = getDemandPattern(history, recipe.id);
  const sameDayRows = history.filter((row) => row.day === day && row.recipeId === recipe.id);
  const sameDayAverage = sameDayRows.length
    ? sameDayRows.reduce((sum, row) => sum + row.sales, 0) / sameDayRows.length
    : pattern.averageSales;
  const previousActuals = previousForecasts.filter((row) => row.actualSold > 0).slice(-3);
  const previousSignal = previousActuals.length
    ? previousActuals.reduce((sum, row) => sum + row.actualSold / Math.max(row.manualForecast || row.forecastPortions, 1), 0) /
      previousActuals.length
    : 1;
  const weatherImpact = getWeatherImpact(recipe, weather);
  const value = Math.max(8, Math.round(sameDayAverage * pattern.demandBias * previousSignal * weatherImpact.multiplier));

  return {
    value,
    phase: "Phase 2",
    inputs: ["same weekday historical data", "previous days", "weather forecast"],
    explanation: `${pattern.status}; ${weatherImpact.reason}`
  };
}

function getCannibalisationPenalty(dayRecipes: Recipe[], recipe: Recipe, history: HistoricalRecord[]) {
  const premium = ["Nomad", "Meat/Fish"].includes(recipe.category);
  const premiumCount = dayRecipes.filter((item) => ["Nomad", "Meat/Fish"].includes(item.category)).length;
  const demand = getDemandPattern(history, recipe.id).sellThrough;
  if (premium && premiumCount > 1 && demand > 1.05) return 0.86;
  if (recipe.category === "Vegetarian" && dayRecipes.some((item) => item.category === "Nomad" && getDemandPattern(history, item.id).sellThrough > 1.05)) {
    return 0.92;
  }
  return 1;
}

export function optimizeWeeklyPlan(plan: WeeklyPlan, history: HistoricalRecord[], forecast: WeatherForecastDay[] = []) {
  const used = new Set<string>();
  const next = {} as WeeklyPlan;

  DAYS.forEach((day, dayIndex) => {
    next[day] = {} as WeeklyPlan[string];
    const dayWeather = forecast[dayIndex];
    const dayRecipes: Recipe[] = [];

    FOOD_CATEGORIES.forEach((category) => {
      const required = getRequiredSlotCount(category);
      const ranked = recipesByCategory(category)
        .filter((recipe) => !used.has(recipe.id))
        .map((recipe) => {
          const pattern = getDemandPattern(history, recipe.id);
          const weatherImpact = getWeatherImpact(recipe, dayWeather);
          const cannibalisation = getCannibalisationPenalty(dayRecipes, recipe, history);
          const marginScore = recipe.sellingPricePerPortion - getRecipeCost(recipe);
          return {
            recipe,
            score: pattern.averageSales * pattern.demandBias * weatherImpact.multiplier * cannibalisation + marginScore * 6
          };
        })
        .sort((a, b) => b.score - a.score);

      next[day][category] = Array.from({ length: required }, (_, index) => {
        const chosen = ranked[index]?.recipe ?? recipesByCategory(category)[index % recipesByCategory(category).length];
        dayRecipes.push(chosen);
        used.add(chosen.id);
        return chosen.id;
      });
    });
  });

  return normalizeWeeklyPlan(next);
}

export function getDailyPurchaseNeeds(
  plan: WeeklyPlan,
  forecasts: DailyForecast[],
  day: string,
  history: HistoricalRecord[] = [],
  weather?: WeatherForecastDay
) {
  const selected = getSelectedRecipesForDay(plan, day);
  return selected.flatMap((recipe) => {
    const forecast = forecasts.find((item) => item.day === day && item.recipeId === recipe.id);
    const autoForecast = getAutoForecast(recipe, day, history, forecasts, weather);
    const portions = forecast?.manualForecast || autoForecast.value;
    const pattern = getDemandPattern(history, recipe.id);
    const adjustmentFactor = pattern.status === "overselling" ? 1.1 : pattern.status === "underselling" ? 0.9 : 1;
    const suggestedPortions = Math.max(1, Math.round(portions * adjustmentFactor));

    return recipe.ingredients.map((ingredient) => {
      const supplier = SUPPLIERS.find((item) => item.id === ingredient.supplierId);
      const requiredQuantity = ingredient.quantityPerPortion * portions;
      const suggestedQuantity = ingredient.quantityPerPortion * suggestedPortions;
      return {
        recipe,
        ingredient,
        supplier,
        portions,
        suggestedPortions,
        requiredQuantity: round(requiredQuantity, 2),
        suggestedQuantity: round(suggestedQuantity, 2),
        estimatedCost: round(requiredQuantity * ingredient.unitCost, 2),
        suggestedCost: round(suggestedQuantity * ingredient.unitCost, 2),
        suggestion: pattern.status === "overselling" ? "buy more" : pattern.status === "underselling" ? "buy less" : "hold"
      };
    });
  });
}

export function getPurchaseScheduleRows(
  plan: WeeklyPlan,
  forecasts: DailyForecast[],
  history: HistoricalRecord[] = [],
  weather: WeatherForecastDay[] = []
) {
  const groups = [
    { purchaseDay: "Friday", coversFoodFor: ["Day 1", "Day 2"], calendarDays: "Monday / Tuesday" },
    { purchaseDay: "Monday", coversFoodFor: ["Day 3", "Day 4"], calendarDays: "Wednesday / Thursday" }
  ];

  return groups.map((group) => {
    const needs = group.coversFoodFor.flatMap((day) =>
      getDailyPurchaseNeeds(plan, forecasts, day, history, weather[DAYS.indexOf(day as (typeof DAYS)[number])])
    );
    const ingredientGroups = new Map<string, typeof needs>();
    needs.forEach((need) => {
      const key = `${need.supplier?.id}-${need.ingredient.name}-${need.ingredient.unit}`;
      ingredientGroups.set(key, [...(ingredientGroups.get(key) ?? []), need]);
    });
    const aggregated = Array.from(ingredientGroups.values()).map((items) => ({
      supplier: items[0].supplier,
      ingredient: items[0].ingredient.name,
      unit: items[0].ingredient.unit,
      requiredQuantity: round(items.reduce((sum, item) => sum + item.requiredQuantity, 0), 2),
      suggestedQuantity: round(items.reduce((sum, item) => sum + item.suggestedQuantity, 0), 2),
      suggestion: items.some((item) => item.suggestion === "buy more")
        ? "buy more"
        : items.some((item) => item.suggestion === "buy less")
          ? "buy less"
          : "hold"
    }));
    const total = needs.reduce((sum, item) => sum + item.suggestedCost, 0);
    const suppliers = Array.from(new Set(needs.map((item) => item.supplier?.name).filter(Boolean)));
    return { ...group, suppliers, estimatedPO: round(total, 2), lineCount: aggregated.length, aggregated };
  });
}

export function getVarianceRows(plan: WeeklyPlan, forecasts: DailyForecast[], day: string, history: HistoricalRecord[], weather?: WeatherForecastDay) {
  return getSelectedRecipesForDay(plan, day).map((recipe) => {
    const forecast = forecasts.find((item) => item.day === day && item.recipeId === recipe.id);
    const auto = getAutoForecast(recipe, day, history, forecasts, weather);
    const planned = forecast?.manualForecast || auto.value;
    const actual = forecast?.actualSold ?? 0;
    const variance = actual ? actual - planned : 0;
    return {
      recipe,
      planned,
      auto,
      actual,
      variance,
      varianceRate: actual ? variance / Math.max(planned, 1) : 0,
      correctionType: forecast?.correctionType ?? "none",
      note: forecast?.varianceNote ?? ""
    };
  });
}

export function getHistoryTrendRows(history: HistoricalRecord[]) {
  return history.map((item) => ({
    ...item,
    recipe: getRecipe(item.recipeId),
    month: item.date.slice(0, 7)
  }));
}

export function aggregateHistory(history: HistoricalRecord[], by: "dish" | "day" | "month") {
  const rows = getHistoryTrendRows(history);
  const groups = new Map<string, HistoricalRecord[]>();
  rows.forEach((row) => {
    const key = by === "dish" ? row.recipe?.name ?? row.recipeId : by === "day" ? row.day : row.date.slice(0, 7);
    groups.set(key, [...(groups.get(key) ?? []), row]);
  });

  return Array.from(groups.entries()).map(([label, items]) => ({
    label,
    people: items.reduce((sum, item) => sum + item.people, 0),
    sales: items.reduce((sum, item) => sum + item.sales, 0),
    revenue: round(items.reduce((sum, item) => sum + item.revenue, 0), 2),
    poValue: round(items.reduce((sum, item) => sum + item.poValue, 0), 2),
    overtimeHours: round(items.reduce((sum, item) => sum + item.overtimeHours, 0), 1)
  }));
}

export function getDishTypePerformance(history: HistoricalRecord[]) {
  const groups = new Map<FoodCategory, HistoricalRecord[]>();
  history.forEach((row) => {
    const category = getRecipe(row.recipeId)?.category;
    if (!category) return;
    groups.set(category, [...(groups.get(category) ?? []), row]);
  });

  return Array.from(groups.entries()).map(([category, rows]) => ({
    category,
    sales: rows.reduce((sum, row) => sum + row.sales, 0),
    revenue: round(rows.reduce((sum, row) => sum + row.revenue, 0), 2),
    poValue: round(rows.reduce((sum, row) => sum + row.poValue, 0), 2),
    margin: round(rows.reduce((sum, row) => sum + row.revenue - row.poValue, 0), 2)
  }));
}
